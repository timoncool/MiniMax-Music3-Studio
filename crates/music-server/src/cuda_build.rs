//! Which CUDA build of the engine this machine runs.
//!
//! The engine ships one CUDA backend per toolkit. CUDA 13 targets Turing and
//! newer and needs a driver from its own release on; CUDA 12 carries the
//! Maxwell, Pascal and Volta cards CUDA 13 dropped, and every newer card whose
//! driver predates CUDA 13. Both hold device code for each architecture, so no
//! driver ever compiles PTX.

use std::sync::OnceLock;

use serde::Serialize;

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum CudaBuild {
    Cuda12,
    Cuda13,
}

impl CudaBuild {
    /// The folder beside mm-server.exe that holds this build's ggml-cuda.dll.
    pub fn folder(self) -> &'static str {
        match self {
            CudaBuild::Cuda12 => "cuda12",
            CudaBuild::Cuda13 => "cuda13",
        }
    }
}

/// The first driver of each CUDA major line, from NVIDIA's CUDA compatibility
/// tables: minor version compatibility runs a whole major line on it, and
/// device code needs nothing newer.
pub const CUDA13_DRIVER: u32 = 580;
const CUDA12_DRIVER: u32 = 525;

/// The oldest architecture the CUDA 12 build has device code for: 5.2, the
/// Maxwell of the GTX 900 series and the Tesla M40.
const CUDA12_OLDEST: (u32, u32) = (5, 2);
/// Turing, the oldest architecture CUDA 13 still targets.
const CUDA13_OLDEST: (u32, u32) = (7, 5);

/// Picks the build from the card's compute capability and the driver's major
/// version, the way Ollama chooses between its CUDA runners.
pub fn cuda_build(compute: (u32, u32), driver_major: u32) -> Option<CudaBuild> {
    if compute >= CUDA13_OLDEST && driver_major >= CUDA13_DRIVER {
        Some(CudaBuild::Cuda13)
    } else if compute >= CUDA12_OLDEST && driver_major >= CUDA12_DRIVER {
        Some(CudaBuild::Cuda12)
    } else {
        None
    }
}

/// The card the studio was pointed at (`apply_saved_gpu`), as nvidia-smi's
/// `-i` takes it: the same PCI order CUDA_DEVICE_ORDER=PCI_BUS_ID gives CUDA.
pub fn chosen_card() -> Vec<String> {
    match std::env::var("CUDA_VISIBLE_DEVICES").ok().and_then(|value| value.trim().parse::<u32>().ok()) {
        Some(index) => vec!["-i".into(), index.to_string()],
        None => Vec::new(),
    }
}

/// Every NVIDIA card: its nvidia-smi index, name and memory in GB. nvidia-smi is asked at most every few seconds:
/// the setup status, polled every second, asks for the cards while one is chosen.
pub fn nvidia_cards() -> Vec<(u32, String, f64)> {
    static LAST: std::sync::Mutex<Option<(std::time::Instant, Vec<(u32, String, f64)>)>> = std::sync::Mutex::new(None);
    const FRESH: std::time::Duration = std::time::Duration::from_secs(5);
    let mut last = LAST.lock().unwrap_or_else(|poisoned| poisoned.into_inner());
    if let Some((_, cards)) = last.as_ref().filter(|(at, _)| at.elapsed() < FRESH) {
        return cards.clone();
    }
    let cards = ask_nvidia_smi_for_cards();
    *last = Some((std::time::Instant::now(), cards.clone()));
    cards
}

fn ask_nvidia_smi_for_cards() -> Vec<(u32, String, f64)> {
    let mut command = dub_core::proc::host_command("nvidia-smi");
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        const CREATE_NO_WINDOW: u32 = 0x0800_0000;
        command.creation_flags(CREATE_NO_WINDOW);
    }
    let Ok(output) = command.args(["--query-gpu=index,name,memory.total", "--format=csv,noheader,nounits"]).output() else { return Vec::new() };
    if !output.status.success() {
        return Vec::new();
    }
    String::from_utf8_lossy(&output.stdout)
        .lines()
        .filter_map(|line| {
            let mut fields = line.split(',').map(str::trim);
            let index = fields.next()?.parse().ok()?;
            let name = fields.next()?.to_string();
            let memory = fields.next()?.parse::<f64>().ok()? / 1024.0;
            Some((index, name, memory))
        })
        .collect()
}

/// The first NVIDIA card's compute capability and driver major version,
/// probed once: the machine's card does not change inside one process.
fn device() -> Option<((u32, u32), u32)> {
    static DEVICE: OnceLock<Option<((u32, u32), u32)>> = OnceLock::new();
    *DEVICE.get_or_init(|| {
        let mut command = dub_core::proc::host_command("nvidia-smi");
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            // A GUI process spawning a console tool flashes a window without this.
            const CREATE_NO_WINDOW: u32 = 0x0800_0000;
            command.creation_flags(CREATE_NO_WINDOW);
        }
        // A driver too old to know compute_cap fails the query, and such a
        // driver runs neither build.
        let output = command.args(chosen_card()).args(["--query-gpu=compute_cap,driver_version", "--format=csv,noheader"]).output().ok()?;
        if !output.status.success() {
            return None;
        }
        parse_query(String::from_utf8_lossy(&output.stdout).lines().next()?.trim())
    })
}

/// `7.5, 581.29` into the compute capability and the driver's major version.
fn parse_query(line: &str) -> Option<((u32, u32), u32)> {
    let (compute, driver) = line.split_once(',')?;
    let (major, minor) = compute.trim().split_once('.')?;
    let driver_major = driver.trim().split('.').next()?.parse().ok()?;
    Some(((major.parse().ok()?, minor.parse().ok()?), driver_major))
}

/// Whether the machine has an NVIDIA card with a working driver, whether or
/// not a CUDA build runs it.
pub fn nvidia_card() -> bool {
    static PRESENT: OnceLock<bool> = OnceLock::new();
    *PRESENT.get_or_init(|| {
        let mut command = dub_core::proc::host_command("nvidia-smi");
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            const CREATE_NO_WINDOW: u32 = 0x0800_0000;
            command.creation_flags(CREATE_NO_WINDOW);
        }
        command.arg("-L").output().is_ok_and(|output| output.status.success())
    })
}

/// The build this machine runs, none without an NVIDIA card one of the builds
/// supports.
pub fn current() -> Option<CudaBuild> {
    device().and_then(|(compute, driver)| cuda_build(compute, driver))
}

/// The card a CUDA failure happened on, in what a report needs to tell a missing
/// architecture from an old driver: its name, compute capability, driver and the
/// engine's CUDA build (`cuda13`, `cuda12`, or `no`). Probed once.
#[derive(Clone, Debug, PartialEq)]
pub struct CardFacts {
    pub name: String,
    pub compute: String,
    pub driver: String,
    pub build: &'static str,
}

pub fn describe() -> Option<CardFacts> {
    static CARD: OnceLock<Option<CardFacts>> = OnceLock::new();
    CARD.get_or_init(|| {
        let mut command = dub_core::proc::host_command("nvidia-smi");
        #[cfg(windows)]
        {
            use std::os::windows::process::CommandExt;
            const CREATE_NO_WINDOW: u32 = 0x0800_0000;
            command.creation_flags(CREATE_NO_WINDOW);
        }
        let output = command.args(chosen_card()).args(["--query-gpu=name,compute_cap,driver_version", "--format=csv,noheader"]).output().ok()?;
        if !output.status.success() {
            return None;
        }
        let line = String::from_utf8_lossy(&output.stdout).lines().next()?.trim().to_string();
        let mut fields = line.split(',').map(str::trim);
        Some(CardFacts {
            name: fields.next()?.to_string(),
            compute: fields.next()?.to_string(),
            driver: fields.next()?.to_string(),
            build: current().map(CudaBuild::folder).unwrap_or("no"),
        })
    })
    .clone()
}

/// Tensor cores before Ampere accumulate in FP16, where the V projection can
/// overflow to infinity and poison every later attention; the engine's clamp
/// keeps it in range and changes nothing on a card that never overflows.
pub fn accumulates_in_fp16() -> bool {
    device().is_some_and(|(compute, _)| compute < (8, 0))
}

/// Blackwell and newer (sm_100 = cc 10.0, sm_120 = cc 12.0): the compute
/// capabilities ggml 0.27's flash-attention kernels sing gibberish on, later
/// sections of a song turning to meaningless syllables (#194). Ada (8.9) and
/// Hopper (9.0) are unaffected. A threshold, not a card list, so a newer card
/// stays on the safe path until its kernels are known good.
pub fn fa_regressed() -> bool {
    fa_regressed_cc(device().map(|(compute, _)| compute))
}

/// Whether a compute capability is one ggml 0.27's flash attention gets wrong.
pub fn fa_regressed_cc(compute: Option<(u32, u32)>) -> bool {
    compute.is_some_and(|compute| compute >= (10, 0))
}

/// Why the engine cannot start on CUDA here, in words for the person at the
/// machine.
pub const UNSUPPORTED: &str = "CUDA was chosen, but this card or its driver runs neither CUDA build of the engine: it needs an NVIDIA card from the GTX 900 series on and driver 525 or newer. Update the NVIDIA driver, or choose Vulkan in Settings.";

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_build_follows_the_architecture_and_the_driver() {
        assert_eq!(cuda_build((7, 5), 581), Some(CudaBuild::Cuda13));
        assert_eq!(cuda_build((12, 0), 590), Some(CudaBuild::Cuda13));
        assert_eq!(cuda_build((6, 1), 581), Some(CudaBuild::Cuda12));
        assert_eq!(cuda_build((5, 2), 560), Some(CudaBuild::Cuda12));
        assert_eq!(cuda_build((7, 0), 552), Some(CudaBuild::Cuda12));
        assert_eq!(cuda_build((8, 9), 566), Some(CudaBuild::Cuda12));
        assert_eq!(cuda_build((3, 5), 581), None);
        assert_eq!(cuda_build((5, 0), 581), None);
        assert_eq!(cuda_build((8, 6), 511), None);
    }

    #[test]
    fn the_query_reads_the_capability_and_the_driver_major() {
        assert_eq!(parse_query("7.5, 581.29"), Some(((7, 5), 581)));
        assert_eq!(parse_query("12.0, 591.44"), Some(((12, 0), 591)));
        assert_eq!(parse_query("[N/A], 581.29"), None);
    }

    #[test]
    fn flash_attention_is_regressed_from_blackwell_on() {
        // ggml 0.27's flash attention sings gibberish on Blackwell-or-newer cards (#194)
        assert!(!fa_regressed_cc(None));
        assert!(!fa_regressed_cc(Some((8, 9))), "Ada (RTX 4090) is unaffected");
        assert!(!fa_regressed_cc(Some((9, 0))), "Hopper is unaffected");
        assert!(fa_regressed_cc(Some((10, 0))), "Blackwell sm_100");
        assert!(fa_regressed_cc(Some((12, 0))), "Blackwell sm_120 (RTX 5060 Ti, #194)");
    }
}
