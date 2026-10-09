//! Supervisor for the primary `minimaxmusic.cpp` local runtime.
//!
//! The upstream Windows route is `buildcuda.cmd`, followed by `server.cmd`.
//! `server.cmd` launches `mm-server.exe` with `--models`, `--host`, and
//! `--port`; those are the only launch flags this supervisor emits. The
//! upstream server handles SIGINT/SIGTERM by stopping its HTTP listener,
//! cancelling the active pipeline, draining its worker and freeing models.

use std::{
    fs,
    io::{Read, Write},
    net::{IpAddr, SocketAddr, TcpStream},
    path::{Path, PathBuf},
    process::{Child, Command, Stdio},
    thread,
    time::{Duration, Instant},
};

use anyhow::{bail, Context, Result};

const DEFAULT_HOST: &str = "127.0.0.1";
const DEFAULT_PORT: u16 = 8086;

/// A part of the model an adapter can change, with its own strength.
#[derive(Debug, Clone, Copy, serde::Serialize)]
pub struct AdapterSlot {
    /// The engine's name for the part, its flag in `/props` and the prefix of
    /// its `<id>_scale` request field.
    pub id: &'static str,
    /// What changing that part does to a song, for the interface to name.
    pub role: &'static str,
}

/// MiniMax Music 3's planner LM writes the song - its structure, the vocal
/// line, where it ends - and the flow DiT renders its sound; they share no
/// weight.
pub const ADAPTER_SLOTS: &[AdapterSlot] =
    &[AdapterSlot { id: "lm", role: "composition" }, AdapterSlot { id: "dit", role: "sound" }];

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MmServerLaunchConfig {
    pub executable: PathBuf,
    pub models_root: PathBuf,
    /// The studio's adapter folder, which requests name adapters in.
    pub adapters_root: Option<PathBuf>,
    pub host: String,
    pub port: u16,
    pub options: MmServerOptions,
}

/// The ggml backend the engine computes on. The bundled engine loads its
/// backends at run time, so one build serves NVIDIA (CUDA), AMD and Intel
/// (Vulkan) and the processor; `Auto` lets ggml take the best device it finds.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ComputeBackend {
    #[default]
    Auto,
    Cuda,
    Vulkan,
    Cpu,
}

impl ComputeBackend {
    /// The device name `mm-server` reads from `GGML_BACKEND`, none for `Auto`.
    pub fn ggml_device(self) -> Option<&'static str> {
        match self {
            Self::Auto => None,
            Self::Cuda => Some("CUDA0"),
            Self::Vulkan => Some("Vulkan0"),
            Self::Cpu => Some("CPU"),
        }
    }
}

/// The launch flags upstream `mm-server` accepts, as documented by its usage
/// text. They change how the engine uses the GPU for the whole session, so they
/// belong to the process, not to a single request — changing one requires a
/// restart of the engine.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct MmServerOptions {
    /// The device to compute on, passed as `GGML_BACKEND`.
    pub backend: ComputeBackend,
    /// `--keep-loaded`: hold every module in VRAM between jobs instead of
    /// evicting between stages. Much faster back-to-back generation, at the
    /// cost of a permanently higher VRAM footprint.
    pub keep_loaded: bool,
    /// `--max-batch`: language-model batch limit.
    pub max_batch: Option<u32>,
    /// `--max-seq`: language-model KV cache size; defaults to the model context.
    pub max_seq: Option<u32>,
    /// `--no-fa`: disable flash attention.
    pub disable_flash_attention: bool,
    /// `--no-batch-cfg`: run classifier-free guidance as two separate forwards.
    pub split_cfg_forwards: bool,
    /// `--clamp-fp16`: clamp hidden states to the FP16 range.
    pub clamp_fp16: bool,
    /// The folder beside the executable whose `ggml-cuda.dll` the engine
    /// loads, passed as `MM3_CUDA_BACKEND`. A release keeps one CUDA backend
    /// per toolkit in folders of their own.
    pub cuda_folder: Option<&'static str>,
}

impl MmServerOptions {
    fn apply(&self, command: &mut Command) {
        if self.keep_loaded {
            command.arg("--keep-loaded");
        }
        if let Some(max_batch) = self.max_batch {
            command.arg("--max-batch").arg(max_batch.to_string());
        }
        if let Some(max_seq) = self.max_seq {
            command.arg("--max-seq").arg(max_seq.to_string());
        }
        if self.disable_flash_attention {
            command.arg("--no-fa");
        }
        if self.split_cfg_forwards {
            command.arg("--no-batch-cfg");
        }
        if self.clamp_fp16 {
            command.arg("--clamp-fp16");
        }
    }
}

impl MmServerLaunchConfig {
    /// The CUDA backend the engine loads. A developer build keeps its one
    /// `ggml-cuda.dll` beside the executable, which ggml finds by itself; a
    /// release has only the folders, and one missing is a broken install.
    pub fn cuda_backend(&self) -> Result<Option<PathBuf>> {
        let Some(folder) = self.options.cuda_folder else { return Ok(None) };
        let directory = self.executable.parent().context("the engine executable has no folder")?;
        let backend = directory.join(folder).join("ggml-cuda.dll");
        if backend.is_file() {
            return Ok(Some(backend));
        }
        if directory.join("ggml-cuda.dll").is_file() {
            return Ok(None);
        }
        bail!("the engine's CUDA backend {} is missing; reinstall the studio", backend.display())
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MmServerLocation {
    /// Root of the bundled `minimaxmusic.cpp` runtime, not the Studio root.
    pub bundle_root: PathBuf,
    /// Explicit executable selected by settings. It takes priority over the
    /// verified paths that the upstream Windows scripts create.
    pub configured_executable: Option<PathBuf>,
    /// Explicit model directory selected by settings. The directory must
    /// already exist; the supervisor never creates or downloads weights.
    pub configured_models_root: Option<PathBuf>,
    /// The studio's adapter folder; created by the studio, never here.
    pub adapters_root: Option<PathBuf>,
    pub host: Option<String>,
    pub port: Option<u16>,
    pub options: MmServerOptions,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StartOutcome {
    ReusedHealthyServer,
    Started,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct StopOutcome {
    pub was_running: bool,
    pub graceful: bool,
}

pub struct MmServerSupervisor {
    config: MmServerLaunchConfig,
    child: Option<Child>,
}

impl MmServerLocation {
    pub fn resolve(self) -> Result<MmServerLaunchConfig> {
        let bundle_root = canonical_directory(&self.bundle_root, "mm-server bundle root")?;
        let executable = match self.configured_executable {
            Some(path) => canonical_file(&path, "configured mm-server executable")?,
            None => locate_bundled_executable(&bundle_root)?,
        };
        let models_root = match self.configured_models_root {
            Some(path) => canonical_directory(&path, "configured MiniMax Music3 models root")?,
            None => canonical_directory(&bundle_root.join("models"), "bundled MiniMax Music3 models root")?,
        };
        let host = self.host.unwrap_or_else(|| DEFAULT_HOST.into());
        validate_loopback_host(&host)?;
        Ok(MmServerLaunchConfig {
            executable,
            models_root,
            adapters_root: self.adapters_root,
            host,
            port: self.port.unwrap_or(DEFAULT_PORT),
            options: self.options,
        })
    }
}

impl MmServerSupervisor {
    pub fn new(config: MmServerLaunchConfig) -> Result<Self> {
        canonical_file(&config.executable, "mm-server executable")?;
        canonical_directory(&config.models_root, "MiniMax Music3 models root")?;
        validate_loopback_host(&config.host)?;
        Ok(Self { config, child: None })
    }

    pub fn config(&self) -> &MmServerLaunchConfig {
        &self.config
    }

    pub fn is_healthy(&self, timeout: Duration) -> bool {
        health_check(&self.config.host, self.config.port, timeout)
    }

    /// Starts one owned server only when no healthy server is already listening
    /// on its loopback endpoint. A live owned child is never duplicated while
    /// it is still initialising.
    pub fn ensure_started(&mut self, readiness_timeout: Duration) -> Result<StartOutcome> {
        if self.is_healthy(Duration::from_millis(300)) {
            return Ok(StartOutcome::ReusedHealthyServer);
        }
        self.clear_exited_child()?;
        if self.child.is_some() {
            self.wait_until_healthy(readiness_timeout)?;
            return Ok(StartOutcome::Started);
        }

        let mut command = Command::new(&self.config.executable);
        command
            .arg("--models")
            .arg(&self.config.models_root)
            .arg("--host")
            .arg(&self.config.host)
            .arg("--port")
            .arg(self.config.port.to_string());
        if let Some(adapters) = &self.config.adapters_root {
            command.arg("--adapters").arg(adapters);
        }
        self.config.options.apply(&mut command);
        match self.config.options.backend.ggml_device() {
            Some(device) => {
                command.env("GGML_BACKEND", device);
            }
            None => {
                command.env_remove("GGML_BACKEND");
            }
        }
        match self.config.cuda_backend()? {
            Some(backend) => {
                command.env("MM3_CUDA_BACKEND", backend);
            }
            None => {
                command.env_remove("MM3_CUDA_BACKEND");
            }
        }
        command.stdin(Stdio::null());
        // Everything the engine says while it is starting - loading weights,
        // choosing a device, failing - happens before its HTTP log exists.
        // Without this the first-run screen has nothing to show but a spinner.
        // Appended, never truncated. Creating this file fresh on every start
        // meant the restart destroyed the evidence: an engine that died mid
        // generation was replaced by one that had just booted, and its log
        // began with "Listening on ..." as though nothing had happened. The
        // reason a run failed is in the last lines of the process that failed,
        // so those lines have to outlive it.
        trim_log_if_huge();
        // What happened to the previous one, if it is still here to ask. An
        // engine that died on its own leaves an exit code - 0xc0000005 for an
        // access violation, for instance - and that code is the difference
        // between "it crashed" and knowing why.
        if let Some(previous) = self.child.as_mut() {
            match previous.try_wait() {
                Ok(Some(status)) => note_in_log(&format!(
                    "the previous engine had already exited: {status}{}",
                    status.code().map(|code| format!(" (0x{:x})", code as u32)).unwrap_or_default()
                )),
                Ok(None) => note_in_log("the previous engine was still running and is being replaced"),
                Err(error) => note_in_log(&format!("could not read the previous engine's exit status: {error}")),
            }
        }
        note_in_log(&format!("---- starting {} ----", self.config.executable.display()));
        match std::fs::OpenOptions::new().create(true).append(true).open(startup_log_path()) {
            Ok(log) => {
                let err = log.try_clone().ok();
                command.stdout(Stdio::from(log));
                match err {
                    Some(handle) => { command.stderr(Stdio::from(handle)); }
                    None => { command.stderr(Stdio::null()); }
                }
            }
            Err(_) => {
                command.stdout(Stdio::null());
                command.stderr(Stdio::null());
            }
        }
        configure_child_process(&mut command);
        let child = command
            .spawn()
            .with_context(|| format!("start mm-server {}", self.config.executable.display()))?;
        // The engine must not outlive the studio, however the studio ends.
        music_core::process::adopt(&child);
        self.child = Some(child);
        if let Err(error) = self.wait_until_healthy(readiness_timeout) {
            let _ = self.stop(Duration::from_secs(1));
            return Err(error);
        }
        Ok(StartOutcome::Started)
    }

/// Requests the shutdown mechanism implemented upstream. If the process
    /// does not exit within the grace period, it is forcibly stopped so Studio
    /// never leaves an orphaned local engine process behind.
    pub fn stop(&mut self, grace_period: Duration) -> Result<StopOutcome> {
        let Some(child) = self.child.as_mut() else {
            return Ok(StopOutcome { was_running: false, graceful: true });
        };
        if child.try_wait().context("inspect mm-server child")?.is_some() {
            self.child = None;
            return Ok(StopOutcome { was_running: false, graceful: true });
        }

        request_graceful_shutdown(child)?;
        let deadline = Instant::now() + grace_period;
        while Instant::now() < deadline {
            if child.try_wait().context("wait for mm-server shutdown")?.is_some() {
                self.child = None;
                return Ok(StopOutcome { was_running: true, graceful: true });
            }
            thread::sleep(Duration::from_millis(50));
        }
        child.kill().context("force-stop mm-server after grace period")?;
        child.wait().context("wait for force-stopped mm-server")?;
        self.child = None;
        Ok(StopOutcome { was_running: true, graceful: false })
    }

    fn clear_exited_child(&mut self) -> Result<()> {
        let exited = self
            .child
            .as_mut()
            .map(|child| child.try_wait().context("inspect mm-server child"))
            .transpose()?
            .flatten()
            .is_some();
        if exited {
            self.child = None;
        }
        Ok(())
    }

    fn wait_until_healthy(&mut self, timeout: Duration) -> Result<()> {
        let deadline = Instant::now() + timeout;
        loop {
            if self.is_healthy(Duration::from_millis(300)) {
                return Ok(());
            }
            if let Some(child) = self.child.as_mut() {
                if let Some(status) = child.try_wait().context("inspect starting mm-server")? {
                    bail!("mm-server exited during startup with status {status}");
                }
            }
            if Instant::now() >= deadline {
                bail!(
                    "mm-server did not pass GET /health on {}:{} before startup timeout",
                    self.config.host,
                    self.config.port
                );
            }
            thread::sleep(Duration::from_millis(100));
        }
    }
}

impl Drop for MmServerSupervisor {
    fn drop(&mut self) {
        let _ = self.stop(Duration::from_secs(2));
    }
}

fn locate_bundled_executable(bundle_root: &Path) -> Result<PathBuf> {
    // `server.cmd` from minimaxmusic.cpp puts `build\\Release` on PATH;
    // CMake also declares the build root as its runtime output directory.
    let executable = if cfg!(windows) { "mm-server.exe" } else { "mm-server" };
    let candidates = [
        bundle_root.join(executable),
        bundle_root.join("bin").join(executable),
        bundle_root.join("build").join("Release").join(executable),
        bundle_root.join("build").join(executable),
    ];
    candidates
        .iter()
        .find(|path| path.is_file())
        .map(|path| canonical_file(path, "bundled mm-server executable"))
        .transpose()?
        .with_context(|| {
            format!(
                "mm-server was not found below {}; expected a packaged binary or one produced by minimaxmusic.cpp buildcuda.cmd/buildall.cmd",
                bundle_root.display()
            )
        })
}

fn canonical_file(path: &Path, label: &str) -> Result<PathBuf> {
    if !path.is_file() {
        bail!("{label} is not a file: {}", path.display());
    }
    fs::canonicalize(path).with_context(|| format!("canonicalize {label}: {}", path.display()))
}

fn canonical_directory(path: &Path, label: &str) -> Result<PathBuf> {
    if !path.is_dir() {
        bail!("{label} is not a directory: {}", path.display());
    }
    fs::canonicalize(path).with_context(|| format!("canonicalize {label}: {}", path.display()))
}

fn validate_loopback_host(host: &str) -> Result<()> {
    let address: IpAddr = host
        .parse()
        .with_context(|| format!("mm-server host must be an IP address, got `{host}`"))?;
    if !address.is_loopback() {
        bail!("mm-server host must remain loopback-only, got `{host}`");
    }
    Ok(())
}

fn health_check(host: &str, port: u16, timeout: Duration) -> bool {
    let Ok(address) = host.parse::<IpAddr>() else {
        return false;
    };
    let Ok(mut stream) = TcpStream::connect_timeout(&SocketAddr::new(address, port), timeout) else {
        return false;
    };
    let _ = stream.set_read_timeout(Some(timeout));
    let _ = stream.set_write_timeout(Some(timeout));
    if stream
        .write_all(b"GET /health HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n")
        .is_err()
    {
        return false;
    }
    let mut response = String::new();
    stream.read_to_string(&mut response).is_ok() && response.starts_with("HTTP/1.1 200")
}

#[cfg(windows)]
fn configure_child_process(command: &mut Command) {
    use std::os::windows::process::CommandExt;
    use windows_sys::Win32::System::Threading::CREATE_NEW_PROCESS_GROUP;
    command.creation_flags(CREATE_NEW_PROCESS_GROUP);
}

/// Off Windows the engine is bound to the studio's lifetime here, before the
/// exec: Linux does it with `PR_SET_PDEATHSIG`, as the job object `adopt`
/// assigns does on Windows.
#[cfg(not(windows))]
fn configure_child_process(command: &mut Command) {
    music_core::process::ensure_dies_with_parent(command);
}

#[cfg(windows)]
fn request_graceful_shutdown(child: &Child) -> Result<()> {
    use std::os::windows::io::AsRawHandle;
    use windows_sys::Win32::System::{Console::{GenerateConsoleCtrlEvent, CTRL_BREAK_EVENT}, Threading::GetProcessId};
    let process_group = unsafe { GetProcessId(child.as_raw_handle()) };
    if unsafe { GenerateConsoleCtrlEvent(CTRL_BREAK_EVENT, process_group) } == 0 {
        bail!("send CTRL_BREAK to mm-server process group failed")
    }
    Ok(())
}

#[cfg(not(windows))]
fn request_graceful_shutdown(child: &Child) -> Result<()> {
    let result = unsafe { libc::kill(child.id() as libc::pid_t, libc::SIGTERM) };
    if result != 0 {
        bail!("send SIGTERM to mm-server process failed: {}", std::io::Error::last_os_error());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn fresh_directory(label: &str) -> PathBuf {
        let path = std::env::temp_dir().join(format!("music-engine-{label}-{}", std::process::id()));
        let _ = fs::remove_dir_all(&path);
        fs::create_dir_all(&path).unwrap();
        path
    }

    #[test]
    fn resolves_packaged_windows_style_runtime_and_default_models() {
        let root = fresh_directory("runtime");
        let build = root.join("build").join("Release");
        fs::create_dir_all(&build).unwrap();
        fs::create_dir_all(root.join("models")).unwrap();
        let executable = build.join(if cfg!(windows) { "mm-server.exe" } else { "mm-server" });
        fs::write(&executable, b"test").unwrap();
        let config = MmServerLocation {
            bundle_root: root.clone(),
            configured_executable: None,
            configured_models_root: None,
            adapters_root: None,
            host: None,
            port: None,
            options: MmServerOptions::default(),
        }
        .resolve()
        .unwrap();
        assert_eq!(config.host, DEFAULT_HOST);
        assert_eq!(config.port, DEFAULT_PORT);
        assert!(config.executable.ends_with(executable.file_name().unwrap()));
        assert!(config.models_root.ends_with("models"));
        fs::remove_dir_all(root).unwrap();
    }

    /// The flags must reach the process exactly as upstream documents them: a
    /// silently dropped `--keep-loaded` looks like the setting simply does
    /// nothing.
    #[test]
    fn the_compute_backend_names_the_device_ggml_reads() {
        assert_eq!(ComputeBackend::Auto.ggml_device(), None);
        assert_eq!(ComputeBackend::Cuda.ggml_device(), Some("CUDA0"));
        assert_eq!(ComputeBackend::Vulkan.ggml_device(), Some("Vulkan0"));
        assert_eq!(ComputeBackend::Cpu.ggml_device(), Some("CPU"));
        assert_eq!(serde_json::to_value(ComputeBackend::Vulkan).unwrap(), "vulkan");
    }

    #[test]
    fn options_become_launch_flags() {
        let mut command = Command::new("mm-server");
        MmServerOptions {
            keep_loaded: true,
            max_batch: Some(2),
            max_seq: Some(9000),
            disable_flash_attention: true,
            split_cfg_forwards: true,
            clamp_fp16: true,
            cuda_folder: None,
            ..Default::default()
        }
        .apply(&mut command);
        let arguments: Vec<String> = command.get_args().map(|value| value.to_string_lossy().into_owned()).collect();
        assert_eq!(
            arguments,
            vec!["--keep-loaded", "--max-batch", "2", "--max-seq", "9000", "--no-fa", "--no-batch-cfg", "--clamp-fp16"]
        );

        let mut default_command = Command::new("mm-server");
        MmServerOptions::default().apply(&mut default_command);
        assert_eq!(default_command.get_args().count(), 0);
    }

    #[test]
    fn refuses_non_loopback_listener() {
        assert!(validate_loopback_host("0.0.0.0").is_err());
        assert!(validate_loopback_host("127.0.0.1").is_ok());
    }

    #[test]
    fn health_check_is_false_without_a_server() {
        assert!(!health_check("127.0.0.1", 65534, Duration::from_millis(10)));
    }
}

/// Where the engine's startup output is kept: beside the studio's data, so the
/// first-run screen can read it before the engine serves anything itself.
/// Writes one line of the studio's own into the engine's log, so a reader can
/// see what the studio did between two runs of the engine - started it, gave up
/// on it, restarted it.
pub fn note_in_log(line: &str) {
    use std::io::Write;
    if let Ok(mut log) = std::fs::OpenOptions::new().create(true).append(true).open(startup_log_path()) {
        let _ = writeln!(log, "[studio] {line}");
    }
}

/// Keeps the log from growing without end: past eight megabytes, the older half
/// goes. Losing the oldest half of a long history is nothing; losing the last
/// page is the whole problem this file exists to solve.
fn trim_log_if_huge() {
    const LIMIT: u64 = 8 * 1024 * 1024;
    let path = startup_log_path();
    let Ok(meta) = std::fs::metadata(&path) else { return };
    if meta.len() < LIMIT {
        return;
    }
    let Ok(text) = std::fs::read_to_string(&path) else { return };
    let keep = text.split_at(text.len() / 2).1;
    let start = keep.find(char::is_control).map(|index| index + 1).unwrap_or(0);
    let _ = std::fs::write(&path, &keep[start..]);
}

pub fn startup_log_path() -> PathBuf {
    let root = std::env::var_os("MINIMAX_STUDIO_DATA_ROOT")
        .map(PathBuf::from)
        .unwrap_or_else(std::env::temp_dir);
    let _ = std::fs::create_dir_all(&root);
    root.join("engine-startup.log")
}

/// The tail of that file, oldest first.
pub fn startup_log_tail(lines: usize) -> Vec<String> {
    let Ok(text) = std::fs::read_to_string(startup_log_path()) else {
        return Vec::new();
    };
    let all: Vec<&str> = text.lines().filter(|line| !line.trim().is_empty()).collect();
    all.iter().rev().take(lines).rev().map(|line| (*line).to_string()).collect()
}
