//! What every program and library the studio runs on Windows imports, and whether the Windows loader finds it.
//!
//! Each load is described as the loader sees it: the file, and the folders searched for its imports in order. A
//! program's own folder comes first; a library loaded into a running process by its full path is not searched for
//! in its own folder but in the process's (the "Dynamic-link library search order" of Windows), unless it is
//! loaded with `LOAD_WITH_ALTERED_SEARCH_PATH`. Whatever is not found there has to be a part of Windows, come with
//! the display driver, or be the Visual C++ runtime the studio ships beside the engine and checks by name.
//!
//! The staged installer bundle is checked by an ordinary test whenever it is there; the runtimes the studio
//! downloads are checked where they already lie on this computer, at their pins, by `scripts/check-dll-imports.ps1`.

use std::collections::VecDeque;
use std::path::{Path, PathBuf};

use anyhow::{Context, Result};

use crate::engine_runtime::VC_RUNTIME_LIBRARIES;

/// The DLLs a Windows binary names in its import table and its delay-load table, read by the PE reader Dub Studio,
/// Speech Studio and the release checks share (`dub_core::compat`).
///
/// NVIDIA's deployment guide says to read this with `dumpbin /IMPORTS` and redistribute exactly what it lists,
/// because the binary compatibility version is part of the file name - `cublas64_13.dll`, not `cublas.dll`. A
/// delay-loaded library is loaded on first use instead of at start, and is as missing as any other when that use
/// comes.
pub fn imported_libraries(binary: &Path) -> Result<Vec<String>> {
    let data = std::fs::read(binary).with_context(|| format!("read {}", binary.display()))?;
    dub_core::compat::pe_imports(binary, &data).map_err(|error| anyhow::anyhow!(error))
}

/// Libraries every Windows 10 and 11 machine has, or that arrive with the display driver (its CUDA library and the
/// Vulkan loader), as the shared release checks name them. Everything else has to be shipped or downloaded.
pub fn is_provided_by_the_system(name: &str) -> bool {
    dub_core::compat::windows_has(name)
}

/// A library of the Visual C++ runtime, by the names Microsoft's redistributable installs.
fn is_vc_runtime(name: &str) -> bool {
    let name = name.to_ascii_lowercase();
    ["msvcp140", "vcruntime140", "vcomp140", "concrt140", "vccorlib140", "vcamp140"].iter().any(|stem| name.starts_with(stem))
}

/// One file the loader loads, and the folders it searches for that file's imports, in order.
#[derive(Debug, Clone)]
pub struct Load {
    pub entry: PathBuf,
    pub search: Vec<PathBuf>,
}

impl Load {
    /// A program: its imports are found beside it first, then in `more`.
    #[cfg(test)]
    fn program(entry: PathBuf, more: &[PathBuf]) -> Self {
        let mut search: Vec<PathBuf> = entry.parent().map(Path::to_path_buf).into_iter().collect();
        search.extend(more.iter().cloned());
        Self { entry, search }
    }

    /// A library a running process loads by its full path: its imports are found in the process's folders only.
    fn in_process(entry: PathBuf, process: &[PathBuf]) -> Self {
        Self { entry, search: process.to_vec() }
    }
}

/// What a load needs that the loader will not find, followed through every library it does find
/// (`mm-server.exe` imports `ggml.dll`, `ggml-cuda.dll` imports cuBLAS).
///
/// A Visual C++ library counts as present when it lies in a folder the load searches (the program's own package
/// carries it) or is one of `VC_RUNTIME_LIBRARIES`, which the studio ships beside the engine; one in neither could be
/// missing on a machine with an older runtime and comes from System32 only on the build machine.
pub fn unresolved(load: &Load) -> Result<Vec<String>> {
    let mut seen: Vec<String> = Vec::new();
    let mut missing = Vec::new();
    let mut queue = VecDeque::from([load.entry.clone()]);
    while let Some(binary) = queue.pop_front() {
        for import in imported_libraries(&binary)? {
            let lowered = import.to_ascii_lowercase();
            if is_provided_by_the_system(&lowered) || seen.contains(&lowered) {
                continue;
            }
            seen.push(lowered.clone());
            let found = load.search.iter().map(|folder| folder.join(&import)).find(|path| path.is_file());
            if is_vc_runtime(&lowered) {
                // the studio's own names, or one the program's package carries in the folders it loads from
                if found.is_none() && !VC_RUNTIME_LIBRARIES.iter().any(|library| library.eq_ignore_ascii_case(&lowered)) {
                    missing.push(format!("{import} (Visual C++ runtime, not among VC_RUNTIME_LIBRARIES)"));
                }
                continue;
            }
            match found {
                Some(path) => queue.push_back(path),
                None => missing.push(import),
            }
        }
    }
    Ok(missing)
}

/// The programs and libraries in one folder, without its sub-folders.
fn binaries_in(folder: &Path) -> Vec<PathBuf> {
    let Ok(entries) = std::fs::read_dir(folder) else { return Vec::new() };
    let mut binaries: Vec<PathBuf> = entries
        .flatten()
        .map(|entry| entry.path())
        .filter(|path| {
            path.is_file()
                && path.extension().and_then(|extension| extension.to_str()).is_some_and(|extension| {
                    extension.eq_ignore_ascii_case("exe") || extension.eq_ignore_ascii_case("dll")
                })
        })
        .collect();
    binaries.sort();
    binaries
}

/// Every program and library of a folder whose programs run from it, with `more` searched after it.
fn folder_loads(folder: &Path, more: &[PathBuf]) -> Vec<Load> {
    binaries_in(folder)
        .into_iter()
        .map(|binary| {
            let mut search = vec![folder.to_path_buf()];
            search.extend(more.iter().cloned());
            Load { entry: binary, search }
        })
        .collect()
}

#[cfg(test)]
/// The installer's bundle: the engine folder (`mm-server.exe`, `neural-codec.exe`, every ggml backend beside them
/// and the CUDA backends in their sub-folders, loaded by the engine and resolved from its folder) and the VST host.
/// `engine_libraries` are where the studio's cuBLAS lies when it is not in the engine folder itself.
pub fn bundle_loads(resources: &Path, engine_libraries: &[PathBuf]) -> Vec<Load> {
    let mut loads = engine_loads(&resources.join("minimaxmusic-cpp"), engine_libraries);
    let vst = resources.join("vst-host").join("vst-host.exe");
    if vst.is_file() {
        loads.push(Load::program(vst, &[]));
    }
    loads
}

/// The engine folder alone: its programs and libraries, and the CUDA backends the engine loads from its sub-folders.
pub fn engine_loads(engine: &Path, engine_libraries: &[PathBuf]) -> Vec<Load> {
    let mut process = vec![engine.to_path_buf()];
    process.extend(engine_libraries.iter().cloned());
    let mut loads = folder_loads(engine, engine_libraries);
    for build in [crate::cuda_build::CudaBuild::Cuda13, crate::cuda_build::CudaBuild::Cuda12] {
        let backend = engine.join(build.folder()).join("ggml-cuda.dll");
        if backend.is_file() {
            loads.push(Load::in_process(backend, &process));
        }
    }
    loads
}

#[cfg(test)]
/// Whether the install record the studio writes beside a download it fetched names this address.
fn recorded(record: &Path, url: &str) -> bool {
    crate::install_record::read(record).is_some_and(|parsed| parsed.url == url)
}

#[cfg(test)]
/// The folder a recorded download put its first file in.
fn recorded_folder(record: &Path, root: &Path) -> Option<PathBuf> {
    let parsed = crate::install_record::read(record)?;
    root.join(&parsed.files.first()?.path).parent().map(Path::to_path_buf)
}


#[cfg(test)]
/// Runtimes that unpack into one folder and only work together there: (name, the assets, where each one's pin record
/// is under a data folder). The first data folder that holds every record at its pin is the one checked.
struct Unit {
    name: &'static str,
    ids: Vec<&'static str>,
    urls: Vec<&'static str>,
    /// Each asset's install record and the root its files are recorded under.
    records: Box<dyn Fn(&Path) -> Vec<(PathBuf, PathBuf)>>,
}

#[cfg(test)]
impl Unit {
    fn of_downloader(name: &'static str, assets: Vec<&'static crate::downloads::Asset>, downloader: fn(&Path) -> Vec<crate::downloads::Downloader>) -> Self {
        let ids = assets.iter().map(|asset| asset.id).collect();
        let urls = assets.iter().map(|asset| asset.url).collect();
        Self {
            name,
            ids,
            urls,
            records: Box::new(move |root| {
                downloader(root)
                    .into_iter()
                    .flat_map(|downloader| assets.iter().map(move |asset| (downloader.record_of(asset), downloader.root().to_path_buf())).collect::<Vec<_>>())
                    .collect()
            }),
        }
    }

    /// The folder of the first data folder holding all of this unit at its pin, read only.
    fn find(&self, roots: &[PathBuf]) -> Option<PathBuf> {
        for root in roots {
            let records = (self.records)(root);
            // a downloader that offers several places (the engine's folder or the data folder) gives one record per
            // asset per place; the unit is found when one place holds every record
            for place in records.chunks(self.urls.len()) {
                if place.iter().zip(&self.urls).all(|((record, _), url)| recorded(record, url)) {
                    return place.first().and_then(|(record, root)| recorded_folder(record, root));
                }
            }
        }
        None
    }
}

#[cfg(test)]
/// A transcribe.cpp build on this computer whose size and SHA-256 are the pin's: in a studio's karaoke folder, in
/// Dub Studio's or Speech Studio's models folder, or in a build folder (`<backend>/bin`).
fn local_tcpp(build: dub_tcpp::Build, roots: &[PathBuf]) -> Result<Option<PathBuf>> {
    let pin = build.download();
    let backend = match build {
        dub_tcpp::Build::Cuda => "cuda",
        dub_tcpp::Build::Cuda12 => "cuda12",
        dub_tcpp::Build::Vulkan => "vulkan",
        dub_tcpp::Build::Cpu => "cpu",
    };
    for root in roots {
        let candidates = [
            dub_tcpp::engine_dir(&root.join("karaoke").join("models"), build).join(dub_tcpp::LIBRARY),
            dub_tcpp::engine_dir(&root.join("models"), build).join(dub_tcpp::LIBRARY),
            root.join(backend).join("bin").join(dub_tcpp::LIBRARY),
        ];
        for candidate in candidates {
            let Ok(metadata) = std::fs::metadata(&candidate) else { continue };
            if metadata.len() == pin.size && crate::install_record::sha256_of(&candidate)? == pin.sha256 {
                return Ok(Some(candidate));
            }
        }
    }
    Ok(None)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cuda_build::CudaBuild;
    use crate::downloads::{AssetKind, Downloader};
    use crate::engine_runtime::{CUDA12_LIBRARIES, CUDA13_LIBRARIES};

    fn resources() -> Option<PathBuf> {
        let resources = Path::new(env!("CARGO_MANIFEST_DIR")).join("../../desktop/src-tauri/resources").canonicalize().ok()?;
        resources.join("minimaxmusic-cpp").join("mm-server.exe").is_file().then_some(resources)
    }

    /// The import table is the whole basis of the checks here; if it cannot be read, they pass on anything.
    #[test]
    fn imports_are_read_out_of_a_real_binary() {
        let system = Path::new("C:/Windows/System32/notepad.exe");
        if !system.is_file() {
            return;
        }
        let imports: Vec<String> =
            imported_libraries(system).expect("notepad has an import table").iter().map(|name| name.to_ascii_lowercase()).collect();
        assert!(imports.iter().any(|name| name == "user32.dll"), "an ordinary import: {imports:?}");
        assert!(imports.iter().any(|name| name == "comdlg32.dll"), "a delay-loaded import: {imports:?}");
        assert!(imports.iter().all(|name| name.ends_with(".dll") || name.ends_with(".drv")), "{imports:?}");
    }

    /// A library of the redistributable that the studio does not check by name is reported, not taken for present.
    #[test]
    fn a_visual_cpp_library_outside_the_checked_names_is_missing() {
        assert!(is_vc_runtime("MSVCP140_1.dll") && is_vc_runtime("vcomp140.dll") && !is_vc_runtime("msvcrt.dll"));
        assert!(VC_RUNTIME_LIBRARIES.iter().all(|library| is_vc_runtime(library)));
    }

    /// A record of another pin, or none, is not the pin; a record names the folder its archive unpacked into.
    #[test]
    fn only_a_record_of_the_pin_counts() {
        let folder = std::env::temp_dir().join(format!("dll-imports-{}", uuid::Uuid::now_v7()));
        let unpacked = folder.join("runtime").join("cuda");
        std::fs::create_dir_all(&unpacked).unwrap();
        let library = unpacked.join("x.dll");
        std::fs::write(&library, b"x").unwrap();
        let record = crate::install_record::record_path(&folder.join("x.zip"));
        assert!(!recorded(&record, "https://example.invalid/b1/x.zip"));
        crate::install_record::write(&record, "https://example.invalid/b0/x.zip", "", &[library.clone()], &folder).unwrap();
        assert!(!recorded(&record, "https://example.invalid/b1/x.zip"));
        crate::install_record::write(&record, "https://example.invalid/b1/x.zip", "", &[library], &folder).unwrap();
        assert!(recorded(&record, "https://example.invalid/b1/x.zip"));
        assert_eq!(recorded_folder(&record, &folder), Some(unpacked), "the folder the archive unpacked into");
        std::fs::remove_dir_all(&folder).ok();
    }

    /// Whatever the staged bundle imports is beside it, supplied by Windows or the driver, the Visual C++ runtime,
    /// or the cuBLAS the studio downloads on first start - nothing else.
    #[test]
    fn the_staged_bundle_can_actually_be_loaded() {
        let Some(resources) = resources() else {
            // No engine has been built into the bundle on this machine, the normal state of a checkout that only
            // touches the service.
            return;
        };
        let first_start: Vec<&str> = CUDA13_LIBRARIES.iter().chain(CUDA12_LIBRARIES.iter()).copied().collect();
        let mut problems = Vec::new();
        for load in bundle_loads(&resources, &[]) {
            for name in unresolved(&load).expect("read the bundle's import tables") {
                if !first_start.iter().any(|library| library.eq_ignore_ascii_case(&name)) {
                    problems.push(format!("{} imports {name}", load.entry.display()));
                }
            }
        }
        assert!(
            problems.is_empty(),
            "neither shipped, nor in Windows, nor installed on first start: {problems:#?}. Ship them next to mm-server.exe, \
             or add them to engine_runtime so the studio fetches them."
        );
    }

    /// The runtimes the studio downloads, read where they already lie on this computer and never fetched:
    /// `MM3_DLL_SOURCES` lists data folders (studios' data, installations, build folders), separated by `;`. Each
    /// pinned runtime is taken from the first folder that holds it at its pin - an unpacked archive by the studio's
    /// pin record, a single file by its size and SHA-256 - and every program and library in it is walked from the
    /// folders the studio runs it with. A runtime found nowhere is named as skipped. `scripts/check-dll-imports.ps1`
    /// runs it.
    #[test]
    #[ignore]
    fn local_runtimes_can_be_loaded() {
        let roots: Vec<PathBuf> = std::env::var("MM3_DLL_SOURCES")
            .expect("MM3_DLL_SOURCES lists the folders that hold the studios' downloaded runtimes")
            .split(';')
            .map(str::trim)
            .filter(|folder| !folder.is_empty())
            .map(PathBuf::from)
            .collect();
        let resources = resources().expect("the engine bundle is staged in desktop/src-tauri/resources");
        let engine_folder = resources.join("minimaxmusic-cpp");
        let mut skipped: Vec<String> = Vec::new();
        let mut loads = Vec::new();

        let engine_places = |root: &Path| {
            vec![
                Downloader::new(root.join("engine-runtime")),
                Downloader::new(root.parent().unwrap_or(root).join("resources").join("minimaxmusic-cpp")),
            ]
        };
        let cublas = |build| Unit::of_downloader(
            match build {
                CudaBuild::Cuda13 => "cuBLAS 13",
                CudaBuild::Cuda12 => "cuBLAS 12",
            },
            vec![crate::engine_runtime::cublas_asset(build)],
            engine_places,
        );
        let found = |unit: &Unit, skipped: &mut Vec<String>| -> Option<PathBuf> {
            let folder = unit.find(&roots);
            match &folder {
                Some(folder) => studio_log!("[OK] {} ({}) at {}", unit.name, unit.ids.join(", "), folder.display()),
                None => skipped.push(format!("{} ({}): not on this computer at its pin", unit.name, unit.ids.join(", "))),
            }
            folder
        };

        let cublas13 = found(&cublas(CudaBuild::Cuda13), &mut skipped);
        let cublas12 = found(&cublas(CudaBuild::Cuda12), &mut skipped);
        let engine_libraries: Vec<PathBuf> = cublas13.iter().chain(cublas12.iter()).cloned().collect();
        loads.extend(bundle_loads(&resources, &engine_libraries));

        let tools = Unit::of_downloader("HOT-Step tools", vec![&crate::training::pack()[0]], |root| {
            vec![crate::training::Training::new(root, crate::PRIMARY_MUSIC_ENGINE_ID).downloader().clone()]
        });
        if let Some(folder) = found(&tools, &mut skipped) {
            let mut more = vec![engine_folder.clone()];
            more.extend(cublas13.iter().cloned());
            loads.extend(folder_loads(&folder, &more));
        }

        let separation = |root: &Path| vec![crate::separation::Separator::new(root).downloader().clone()];
        let roformer_build = |build| crate::separation::roformer_asset(build).expect("every BSRoformer.cpp build on Windows");
        let roformer = Unit::of_downloader("BSRoformer.cpp CUDA", vec![roformer_build(crate::separation::RoformerBuild::Cuda13)], separation);
        if let Some(folder) = found(&roformer, &mut skipped) {
            // the studio links the engine's cuBLAS 13 beside it
            loads.extend(folder_loads(&folder, &cublas13.iter().cloned().collect::<Vec<_>>()));
        }
        let roformer12 = Unit::of_downloader("BSRoformer.cpp CUDA 12", vec![roformer_build(crate::separation::RoformerBuild::Cuda12)], separation);
        if let Some(folder) = found(&roformer12, &mut skipped) {
            // the studio links the engine's cuBLAS 12 and CUDA 12 runtime beside it
            let mut more = vec![engine_folder.clone()];
            more.extend(cublas12.iter().cloned());
            loads.extend(folder_loads(&folder, &more));
        }
        let roformer_vulkan = Unit::of_downloader("BSRoformer.cpp Vulkan", vec![roformer_build(crate::separation::RoformerBuild::Vulkan)], separation);
        if let Some(folder) = found(&roformer_vulkan, &mut skipped) {
            loads.extend(folder_loads(&folder, &[]));
        }
        let roformer_cpu = Unit::of_downloader("BSRoformer.cpp processor", vec![roformer_build(crate::separation::RoformerBuild::Cpu)], separation);
        if let Some(folder) = found(&roformer_cpu, &mut skipped) {
            loads.extend(folder_loads(&folder, &[]));
        }

        let karaoke_asset = |id: &str| -> &'static crate::downloads::Asset {
            crate::lyrics_sync::assets()
                .iter()
                .find(|asset| asset.kind == AssetKind::Runtime && asset.id == id)
                .unwrap_or_else(|| panic!("{id} is no longer a karaoke runtime"))
        };
        let karaoke = |root: &Path| vec![Downloader::new(root.join("karaoke"))];
        // audio.cpp's server for CrisperWhisper, a folder a build; the CUDA 13 build takes the engine's cuBLAS 13
        for (name, ids, more) in [
            ("audio.cpp server CUDA 13", vec!["audiocpp-cuda13", "audiocpp-cuda13-cufft"], cublas13.iter().cloned().collect::<Vec<_>>()),
            ("audio.cpp server CUDA 12", vec!["audiocpp-cuda12", "audiocpp-cuda12-cudart", "audiocpp-cuda12-cublas", "audiocpp-cuda12-cufft"], Vec::new()),
            ("audio.cpp server Vulkan", vec!["audiocpp-vulkan"], Vec::new()),
            ("audio.cpp server processor", vec!["audiocpp-cpu"], Vec::new()),
        ] {
            let unit = Unit::of_downloader(name, ids.into_iter().map(karaoke_asset).collect(), karaoke);
            if let Some(folder) = found(&unit, &mut skipped) {
                loads.extend(folder_loads(&folder, &more));
            }
        }
        // ONNX Runtime is loaded into the studio's process after its folder joins PATH; only its processor build is
        // downloaded.
        for (name, ids) in [("ONNX Runtime", vec!["onnxruntime"])] {
            let unit = Unit::of_downloader(name, ids.into_iter().map(karaoke_asset).collect(), karaoke);
            if let Some(folder) = found(&unit, &mut skipped) {
                let process = vec![folder.clone()];
                loads.extend(binaries_in(&folder).into_iter().map(|path| Load::in_process(path, &process)));
            }
        }

        // transcribe.cpp, loaded into the studio's process with the altered search path, so its own folder is read
        // first: the studio links the engine's cuBLAS 13 beside the CUDA build.
        for build in [dub_tcpp::Build::Cuda, dub_tcpp::Build::Vulkan, dub_tcpp::Build::Cpu] {
            match local_tcpp(build, &roots).expect("read transcribe.cpp builds") {
                Some(library) => {
                    studio_log!("[OK] transcribe.cpp {build:?} at {}", library.display());
                    let mut process: Vec<PathBuf> = library.parent().map(Path::to_path_buf).into_iter().collect();
                    process.extend(cublas13.iter().cloned());
                    loads.push(Load::in_process(library, &process));
                }
                None => skipped.push(format!("transcribe.cpp {build:?} ({}): not on this computer at its size and SHA-256", build.download().url)),
            }
        }

        // llama.cpp for the assistant, each build with its CUDA runtime in its own folder.
        let assistant_asset = |id: &str| -> &'static crate::assistant_runtime::Asset {
            crate::assistant_runtime::ASSETS.iter().find(|asset| asset.id == id).unwrap_or_else(|| panic!("{id} is no longer an assistant runtime"))
        };
        for (name, ids) in [
            ("llama.cpp CUDA 13", vec!["llama-cuda", "llama-cuda-runtime"]),
            ("llama.cpp CUDA 12", vec!["llama-cuda12", "llama-cuda12-runtime"]),
            ("llama.cpp Vulkan", vec!["llama-vulkan"]),
            ("llama.cpp processor", vec!["llama-cpu"]),
        ] {
            let assets: Vec<&'static crate::assistant_runtime::Asset> = ids.into_iter().map(assistant_asset).collect();
            let unit = Unit {
                name,
                ids: assets.iter().map(|asset| asset.id).collect(),
                urls: assets.iter().map(|asset| asset.url).collect(),
                records: Box::new(move |root| {
                    let runtime = crate::assistant_runtime::AssistantRuntime::new(root);
                    assets.iter().map(|asset| (runtime.record_of(asset), runtime.root().to_path_buf())).collect()
                }),
            };
            if let Some(folder) = found(&unit, &mut skipped) {
                loads.extend(folder_loads(&folder, &[]));
            }
        }

        // what a skipped runtime would have brought cannot be told missing
        let unchecked: Vec<&str> = [(&cublas13, CUDA13_LIBRARIES), (&cublas12, CUDA12_LIBRARIES)]
            .into_iter()
            .filter(|(folder, _)| folder.is_none())
            .flat_map(|(_, libraries)| libraries)
            .collect();
        let mut problems = Vec::new();
        for load in &loads {
            for name in unresolved(load).expect("read the import tables") {
                let line = format!("{} imports {name}", load.entry.display());
                if unchecked.iter().any(|library| library.eq_ignore_ascii_case(&name)) {
                    skipped.push(format!("{line}: not checked, its runtime was skipped"));
                } else {
                    problems.push(line);
                }
            }
        }
        studio_log!("[OK] {} programs and libraries walked", loads.len());
        for skip in &skipped {
            studio_log!("[SKIP] {skip}");
        }
        assert!(problems.is_empty(), "will not load: {problems:#?}");
    }
}
