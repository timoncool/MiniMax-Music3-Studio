# Changelog

What changed, newest first. Dates are release dates; the studio is versioned by its
Windows build.

## Unreleased — 4.0.0

### Added

- **The MIDI editor splits and joins notes**, as in ACE-Step Studio ([YuE2 Studio #146](https://github.com/timoncool/YuE2-Studio/issues/146)): Split Notes (Ctrl+E) cuts the chosen notes at the playhead, or where the right-click menu was opened; Join Notes (Ctrl+J) makes one note of the chosen notes of each pitch, from the start of the first to the end of the last, and leaves a pitch alone when a note of it outside the choice lies between. Both are in the right-click menu and in Edit, and each undoes in one step.
- **Audio to MIDI shows its notes as it hears them**, as in ACE-Step Studio ([YuE2 Studio #185](https://github.com/timoncool/YuE2-Studio/issues/185)): the player draws the notes while MuScriptor works and says which chunk it is on, instead of staying empty until the end; a run you stop says it stopped, plainly and not as a red error, and the finished MIDI is the same as before.
- **The writing assistant follows your own rules**, as in ACE-Step Studio ([YuE2 Studio #209](https://github.com/timoncool/YuE2-Studio/issues/209)): Settings - Models - Writing assistant has Your own rules for the whole song, the style and the lyrics, added after the studio's guide and followed where the two differ, and Words to avoid, typed or loaded from a .txt file; emptying the field clears them; laying out recognised or published lyrics keeps their words. Agents set them with `assistant_set`.
- **Your own subtitles become a song's karaoke, and its lines can be edited**, as in ACE-Step Studio ([YuE2 Studio #218](https://github.com/timoncool/YuE2-Studio/issues/218)): on the song panel, Load .srt / .lrc takes a .srt, .ass, .ssa or .lrc file as the song's karaoke in place of the recognised timings, asking first when the song has karaoke already; Edit lists the karaoke's lines with their starts, and a line changed there is saved as written while the lines left alone keep the times of their words. Agents have `karaoke_set`.
- **A deleted song goes to a bin and comes back from there**, as in ACE-Step Studio ([YuE2 Studio #175](https://github.com/timoncool/YuE2-Studio/issues/175)): Delete puts a song in the Bin tab of the library with its stems and its karaoke, the message after it offers Undo, and Restore on the tab brings it all back for 30 days; after that, or with Delete for good and Empty the bin, the song leaves the library and its files go to the system recycle bin - and a file the recycle bin does not take keeps the song in the studio's bin, named. A song in the bin is not taken for new work - stems, Audio to MIDI, karaoke, recognised lyrics, processing, a cover, a replay, a dataset or Style by ear - and the refusal names it and says to restore it from Library - Bin. Agents have `library_trash_list`, `library_trash_restore`, `library_trash_delete` and `library_trash_empty`.
- **Lyrics are heard from a recording on this computer**, as in ACE-Step Studio ([YuE2 Studio #222](https://github.com/timoncool/YuE2-Studio/issues/222)): Tools - Recognise speech can use the recogniser chosen for karaoke (Parakeet or CrisperWhisper) as well as OpenRouter, the karaoke recogniser first when one is chosen. The words are laid out in lines as dataset preparation lays out what it hears: a sentence's end closes its line, a pause of 1.2 s opens a new one (0.6 s after a comma), a line past 48 characters is cut after its last comma, and Chinese and Japanese words join without spaces. Agents have `lyrics_recognise`.
- **Karaoke timings download as SRT subtitles**, as in YuE2 Studio: beside "Download LRC" in the song panel, "Download SRT" saves the same timings for video editors that import SRT and not LRC (CapCut, Jianying, Premiere); each line shows while it is sung, with gaps where the song plays without words.
- **The interface can be scaled**, as in YuE2 Studio ([YuE2 Studio #165](https://github.com/timoncool/YuE2-Studio/issues/165)): Settings - Appearance - Interface scale draws the whole studio from 90 to 150 % and keeps it for the next start; Ctrl + plus and Ctrl + minus, or Ctrl with the mouse wheel, change it too, and Ctrl + 0 returns to 100 %. The Winamp mode gives the chosen scale back when it closes. In a browser tab the studio and its dialogs fit the window at any scale, with the player at the bottom and no scrolling of the page, and the "slide to turn on" knob and a click on the MIDI player's notes follow the pointer.
- **A song the LM KV cache cut short says so on its card**, as in YuE2 Studio: when the caption and lyrics leave the language model less room than the song's duration needs, the engine makes the song shorter, and its card now carries a "Cut short" mark that tells how many seconds came out and what to do - shorten the lyrics, or raise or clear the LM KV cache in Settings, Engine.
- **An NVFP4 set on the CUDA 13 build**, as ACE-Step Studio offers MXFP4: NVIDIA cards on the CUDA 13 build can choose the set with the language model, the depth decoder and the DiT in NVFP4 (7.9 GB of weights against 12.8 GB in Q8_0); an RTX 50 computes it on its tensor cores. The recommended set stays Q8_0. On the CUDA 12 build, AMD and Intel cards, a Mac and the processor the MXFP4 and NVFP4 sets and parts are not offered, unless they are already on disk or chosen.

### Changed

- **Tools open on the song at work**, as in ACE-Step Studio: when a stems or Audio to MIDI run is still going, the Tools tab opens on its song so the progress is in view, and the chosen song stays in the list even when more than twelve songs match the search.
- **The MIDI editor is updated to the latest signal**, as in ACE-Step Studio: rewind after recording, the direction of curves and lines, the shortest note length and the rest of upstream's work since our last update, with the studio's own mode, chord and section lanes kept.
- **The form's and the song panel's blocks fold and stay folded**, as in ACE-Step Studio ([ACE-Step Studio #63](https://github.com/timoncool/ACE-Step-Studio/issues/63)): in the studio mode the description, the lyrics, LoRA and quality fold by their title, and in the song panel Style, Note, Parameters and Lyrics do too; the choice is kept across restarts, and Parameters still opens folded until you open it. Above the lyrics, buttons put the section tags MiniMax Music 3 reads - [intro], [verse], [pre-chorus], [chorus], [post-chorus], [bridge], [instrumental], [solo], [outro] - at the caret on a line of their own.
- **The library search finds a song by any of its words**, as in ACE-Step Studio ([ACE-Step Studio #62](https://github.com/timoncool/ACE-Step-Studio/issues/62)): the words of a search may come in any order, and it reads the lyrics, your note on the song and the settings it was made with - the seed and the models - besides the title, the style and the tags.
- **The agent's guide names every platform the studio ships for**, as in ACE-Step Studio ([ACE-Step Studio #68](https://github.com/timoncool/ACE-Step-Studio/pull/68)): the first step of the MCP skill said the studio is a Windows program that needs an NVIDIA card; it now points an agent to the Windows, macOS (Apple silicon) and Linux (experimental) packages of the latest release, and says the engine also runs on the processor and, experimentally, on AMD and Intel cards through Vulkan.
- **Stems and Audio to MIDI run on audio.cpp's server**, the one karaoke already runs CrisperWhisper on, as in YuE2 Studio: HT-Demucs 6s separates from audio.cpp's own GGUF (f16, 55 MB) on CUDA, on Vulkan on AMD and Intel cards, or on the processor; MuScriptor of every size reads its folder as before. There is one installation of the server for karaoke, stems and MIDI, and it stops when its work is done, so it holds none of the card the songs need. The Quality setting of the stems goes: audio.cpp cuts and joins the segments itself. The update screen removes the ONNX HT-Demucs of earlier versions once the new model and the server are in place.
- **Flash attention is chosen Auto, On or Off**, as in YuE2 Studio: Settings - Engine has a list beside the LM KV cache instead of the "Disable flash attention" box among the diagnostic flags. Auto keeps it on on every card, RTX 50 among them: turning it off there, as earlier versions did on the reading of [YuE2 Studio #194](https://github.com/timoncool/YuE2-Studio/issues/194), cost those cards twice the time and the memory, and the cause was not confirmed. Off stays in Settings for a song whose later sections turn to meaningless syllables; a ticked box of earlier versions reads as Off. The engine log says once at each start why flash attention is off, and under the LM KV cache Settings shows the cache the running engine has and why ("the model's full context" or "set by you"), and when a saved value waits for the next start.
- **A song longer than the LM KV cache set by hand is made, not refused**: the engine shortens it to the room the cache leaves after the caption and lyrics. Only caption and lyrics that leave no room at all, and a re-render whose codes do not fit, are still refused with the size the cache needs.
- **Engines and tools up to date**, as in YuE2 Studio: the assistant on llama.cpp b12248 (b11900 before; CUDA 13.5 on Windows and Linux, the same Ubuntu 22.04 limit for its CUDA build), tempo and key on ONNX Runtime 1.31.1 (1.30.0 before) with its Rust binding ort 2.0.0-rc.15, Parakeet on transcribe.cpp engine-0.2.1 and stems, karaoke and audio-to-MIDI on the audio.cpp server server-31cb1a4a. The update screen offers them as a components update. On Windows the assistant's CUDA 13 build now comes with the CUDA 13.5 libraries of the same llama.cpp release, so a computer that runs the assistant on CUDA 13 downloads 426 MB of them again.
- **The tempo and key of a song are measured on the processor**, as in YuE2 Studio: 4.5 to 6 seconds for a song of three to four minutes, for Style by ear and dataset preparation alike. ONNX Runtime no longer runs on the graphics card, and the update screen removes the CUDA, cuDNN and DirectML files of earlier versions - over 2 GB on Windows with an NVIDIA card.
- **The writing assistant lets llama.cpp place its layers**, as in YuE2 Studio: the studio no longer asks for every layer on the graphics card, which on a card of 8 GB or less could stop Gemma from loading, as it did in Dub Studio.
- **Studio Hub notices follow what you do at once**, as in YuE2 Studio: a notice closed or clicked, and a song that ends, bring the next notice without waiting for the minute's refresh; a link in a notice is counted by its address, and the hub's requests wait while a song is made.
- **On Linux the song engine computes on NVIDIA cards through CUDA**, as on Windows and as in ACE-Step Studio: the Linux engine ran on Vulkan alone; it now carries its CUDA 13 and CUDA 12 builds, chosen by the card and the driver - CUDA 12 for a card from the GTX 900 to the Titan V series or a driver from 525 to 579. Neither carries its CUDA runtime and cuBLAS in the package: the first CUDA start downloads them from NVIDIA's packages (CUDA 13: about 440 MB, CUDA 12: about 585 MB), with the start screen's percent, into one folder the audio.cpp server of stems, karaoke and audio to MIDI shares: the server keeps only its cuFFT beside it and no longer downloads its own copy of them, and the update screen removes the copy earlier versions laid beside it once the engine's is in place.
- **The song engine runs on ggml 0.29**: minimaxmusic.cpp is brought forward to its upstream, whose ggml carries newer memory handling and Vulkan fixes for AMD and Intel cards; on an RTX 4090 a song is made as fast as before.
- **A song on the processor is made faster**: the engine computes the matrices of F32, F16, BF16, Q8_0 and Q4_0 weights with llamafile's tinyBLAS kernel, which makes a DiT step about 1.2 times faster with the Q8_0 and F16 sets. The same seed on the processor gives a different song than in 3.8.5; on a graphics card nothing changes.

### Fixed

- **The update screen no longer offers files you already have**, as in ACE-Step Studio: a runtime whose record named another address - an earlier pin, or NVIDIA's archive where today's pin is its wheel - was downloaded again even when its files were the same bytes; a file already on disk is now known by its SHA-256 (a file taken out of a package by the hash the package lists), hashed once per size and time, and its record is written for today's pin.
- **An error stays on screen until you close it**, as in ACE-Step Studio ([YuE2 Studio #230](https://github.com/timoncool/YuE2-Studio/issues/230)): an error message vanished after three seconds, often before it could be read; it now stays until closed, a long one scrolls and its text can be selected and copied. Ctrl with the wheel scales the interface over every panel, and an assistant that writes too slowly to finish in three minutes says so instead of reporting that it cannot be reached.
- **A download of an optional part asks for its progress once a second again**, as in YuE2 Studio: while the writing assistant, karaoke or stems downloaded, every answer about the progress started the next question at once, so the window asked the service without a pause for the whole download; it now waits a second between questions.
- **Your own subtitles load in the encoding they were saved in**, as in ACE-Step Studio: Load .srt / .lrc read every file as UTF-8, so a file in Windows-1251, GBK or Shift-JIS turned into replacement marks without a word, and `karaoke_set` refused it; a file in UTF-16 or UTF-8 with its mark, plain UTF-8 or the system's code page now reads as written, as cue sheets and lyrics files already do.
- **Karaoke places the whole text at once**, as in ACE-Step Studio and YuE2 Studio: each line used to take the first stretch that resembled it, so a line heard better in a later chorus stranded the verse sung in between. All lines are now placed together so that they match best overall, a line passed over for a sung stretch the text does not cover pays for every word it skips, lines of a text longer than the song get no time instead of one shared moment, and a first line sung unclearly keeps its place from the first word heard.
- **Karaoke that hears no sung words says so in the window's language**, as in ACE-Step Studio: the song panel's karaoke, Tools and dataset preparation showed the service's English "the recogniser found no words to time"; now it is a sentence in the window's language that names the likely causes - a buried or unclear vocal, or an instrumental.
- **The karaoke of a video moves up to 30 seconds either way, in hundredths**, as in ACE-Step Studio ([YuE2 Studio #231](https://github.com/timoncool/YuE2-Studio/issues/231)): the lyrics offset in the video window reached only 3 seconds in tenths; it now takes from -30.00 to +30.00 seconds, on the slider and typed in its field.
- **A computer without a graphics card to compute on is told what that means**, as asked in YuE2 Studio ([YuE2 Studio #224](https://github.com/timoncool/YuE2-Studio/issues/224)): where songs would be made on the processor - no card, or built-in graphics below the smallest local set - the first screen's recommendation and Settings - Local engine say that this is many times slower, tens of minutes and hours, and that a discrete card or OpenRouter is faster.
- **Karaoke's engine updated while it is in use says when it takes over**: a recogniser loaded in the running studio stays in it until the studio closes, so the update screen now says that karaoke's engine updates after a restart of the studio and the earlier one stays in use until then, instead of reporting the update as in place.
- **What runs where says what the studio really picks on AMD and Intel cards**: Settings - Models and the README showed stems on the processor there; HT-Demucs separates through Vulkan, and Mel-Band RoFormer and audio-to-MIDI (MuScriptor) run on the processor. The Tools page shows its songs loading, and the reason when the library does not answer, instead of "No songs yet"; Settings - Local engine keeps the card list in view after another card is picked in place of one that is gone.
- **A dataset song a cloud recogniser times without words is no longer marked instrumental**: an OpenRouter answer with no timed words is now heard again with the vocal lifted out, as a local "no words" is, and in dataset preparation it is an error to look at, not an instrumental with its lyrics erased, said in the window's language with what to pick instead. While a LoRA trains, that vocal is lifted out on the processor, so karaoke does not take the card from the trainer.
- **A screen reader can play a song from the library**, as asked in YuE2 Studio ([YuE2 Studio #171](https://github.com/timoncool/YuE2-Studio/issues/171)): the play control on a song's cover in the library, a playlist and Liked is a real button named by the song ("Play: <title>", "Pause: <title>" while it plays), reached with Tab and pressed with Enter or Space.
- **Edits after Reuse prompt survive a visit to another page**, as in YuE2 Studio ([YuE2 Studio #216](https://github.com/timoncool/YuE2-Studio/issues/216)): coming back to Create put the reused song's request back over what was changed since; a Reuse now fills the form once.
- **Stems and Audio to MIDI show that they are working**, as in YuE2 Studio: on audio.cpp's server they stood at 0 % (and MIDI at "piece 0/0, 0 notes") until the end; now the bar runs without a figure and the line says how long the work has gone, and a percent shows whenever the run reports one. The MIDI player keeps the original track in its blend after another track is chosen, and the first-use line says what is really downloaded - the model and, if missing, the shared audio engine.
- **No Windows Terminal tab is left open beside the studio**, as in ACE-Step Studio ([ACE-Step Studio #69](https://github.com/timoncool/ACE-Step-Studio/issues/69)): on Windows 11 24H2 and later the studio started from a shortcut gets no console of its own and makes one without a window, which the engine and the other programs it starts share, so neither a console window nor a Terminal tab appears; started from a terminal, it still writes its log there. On Windows 11 22H2 and 23H2 with Windows Terminal as the default terminal the tab still opens, as before: those versions have no way to start a console without one.
- **A graphics card chosen in Settings that is no longer in the computer is said so**: the studio no longer points CUDA at a card number that is not there (which left every CUDA part of the studio without a card); Settings - Local engine says the chosen card is not in this computer and to choose one, and the engine starts once one is chosen.
- **Cloud requests ride out a busy moment**: an OpenRouter request (the assistant, the cloud music, descriptions and covers) that the service answers with 408, 409 or 429 is sent again after the wait it asks for, at most a minute, up to four times; a server that cannot be reached is named by its host.
- **AMD and Intel cards are recognised on Windows**: the studio took a Windows machine without an NVIDIA card for one without a graphics card, recommended the OpenRouter set and counted it as computing on the processor. It now reads the card's name and memory, recommends the set its memory holds as it already did on Linux (the engine computes on it through Vulkan, as Settings - Models says), and built-in graphics below the smallest set keeps the recommendation it had. NVIDIA cards are read from nvidia-smi as before.
- **A download that a proxy does not let through names the proxy**: when the studio goes out through the system's proxy or the one set in Settings - Providers and that proxy does not answer or refuses the connection, the message names the proxy by its address (never its login) and says what to do - start the proxy program, or choose No proxy - instead of suggesting HF-Mirror, which sits behind the same proxy. A model download that failed now shows its reason in Settings - Models too, not only on the first start.
- **Describe by ear keeps to the processor when you chose it**, as in YuE2 Studio ([YuE2 Studio #204](https://github.com/timoncool/YuE2-Studio/issues/204)): with the processor chosen in Settings - Local engine the captioner still ran on the graphics card with its CUDA libraries; it now runs on the processor then, without them.
- **A program of the studio that crashes without a word says where it crashed**, as in YuE2 Studio: when the engine fails to start, or the captioner or the trainer stops on an exit code such as 0xc0000005 or 0xc000001d, the studio reads Windows' record of the crash and adds the module it happened in, the exception and the offset to the error and the engine log - the file name only, never a path.
- **A song whose last stretch is short no longer crashes the engine on NVIDIA cards**: with the older ggml the engine could stop with "CUDA error: an illegal memory access was encountered" while rendering the song's last, shorter window, and the song was lost; on ggml 0.29 the same song with the same seed is made.
- **A failed song names the engine's own reason again when the engine log holds a character that is not UTF-8**: one such byte - a caption or a path in the system's code page - made the studio read the whole log as empty, and the song failed with "the engine failed this job and its log names no cause". The log is now read past such bytes, so the FATAL or ERROR line is shown.

## 2026-11-06 — 3.8.5

### Fixed

- **The Hugging Face mirror is used automatically when Hugging Face cannot be reached**: on a network that cannot open huggingface.co — the most common setup failure in the telemetry, networks behind the Great Firewall among them — the studio now falls back to hf-mirror.com on its own, so the models and tools download instead of the setup stalling.
- **LoRA training runs on Turing cards again**: the shared HOT-Step trainer is brought forward to the build the other studios ship (1123 commits) and now falls back to the F32 path for the ConvRot8 step on RTX 20-series cards (compute 7.5), where training had stopped with "backend does not support".

## 2026-11-05 — 3.8.4

### Fixed

- **The second section and the chorus no longer come out as sound-alike nonsense on newer NVIDIA cards**: the 3.8.0 move to a newer ggml brought a CUDA flash-attention kernel that is numerically wrong on Blackwell-generation cards (compute capability 10.0 and up, such as the RTX 5060 Ti), so a song sang the words right at the start and drifted into "sounds like singing but means nothing" later. The studio now turns flash attention off automatically on these cards; other cards are untouched and their speed does not change.
- **A finished song is no longer lost when the system temp folder cannot be written**: the FLAC was written through a temporary file, and a temp folder gutted, read-only, redirected or named outside the system's code page lost the song at the last step. It is now encoded in memory.
- **Karaoke times original songs whose voice is buried under the mix**: when nothing is heard in the mix and Mel-Band RoFormer is installed, the voice is lifted out and timed on its own, so a freely generated original is timed where the mix alone reported nothing - now with cloud recognition too.
- **Your chosen maximum duration is kept when a new Create loads a request**: reuse, an example or the writing assistant no longer resets it toward the default.
- **The autogenerated lyrics fall back to your language instead of Russian**: under "Automatic" the lyrics follow the studio's own language when the request does not settle one.
- **Each changed component on the update screen has its own line**: the audio.cpp CUDA libraries no longer carry the recogniser's description.

## 2026-10-28 — 3.8.3

### Fixed

- **Every engine runs on any x86-64 processor, with or without AVX2**: the engines are built as all-variants packages with no processor floor, so the 0xc0000005 crash on CPUs without AVX2 (such as an older Intel i3) is gone.

## 2026-10-27 — 3.8.2

YuE2 Studio, ACE-Step Studio and MiniMax Music3 Studio are on one version again: 3.8.2 follows 3.8.0 here.

### Fixed

- **The engine starts when its port is taken or reserved**: the engine listens on port 8086, and when another program held it - or Windows had reserved it for Hyper-V, WSL or Docker - every song was lost with "cannot bind 127.0.0.1:8086". The studio now checks the port before the engine starts and, when it cannot have it, gives the engine a free one; the engine log says which program held 8086 (its name and PID) or which reserved range it lies in, and a song lost to a port taken later says so in the window's language.
- **An update that cannot replace a file in use leaves the earlier one in place**: when the new file could not take the place of one a running program holds, the earlier file stayed moved aside and the program lost it; it is now put back, and a file moved aside in this run is not swept until the next start.

## 2026-10-27 — 3.8.0

### Fixed

- **A runtime of 3.7.0 is replaced by today's pin**: llama.cpp, cuBLAS and the other runtimes 3.7.0 unpacked keep the file names of today's builds, and were taken for them; each download now leaves a record beside it (its address, hash and files), and a runtime from before records counts as today's only when the file that tells its build apart has the pinned size. An earlier build is fetched again, removing only the files its record lists and only once the new build has arrived. An install is marked as under way until its record is written, so a half-unpacked runtime is not taken for installed, also after the studio was closed in between.
- **An update does not stop halfway on a file in use**: a runtime that karaoke, the assistant or a separator still had open could not be removed or replaced on Windows, so an update stopped with "Access is denied" and left neither the old build nor the new one; such a file is now moved aside, the new one takes its place, and the old one is removed at the next start.
- **An M4A of Apple Lossless goes into the library as FLAC**: every M4A was kept as it was, and the window's player does not play ALAC; one plays as it is only when its audio is AAC. A WAV whose `fmt` chunk does not come first (after a JUNK, bext or LIST chunk) is read for what it is.
- **Karaoke keeps the first word after a filler**: a word that starts where a segment the model filled with "[Music]" ends was left out with it.
- **Changing the cover look no longer stalls the window**: switching between Pattern, Photo for the style and AI generation writes the new cover into every track, and the window read the whole library again after each one, with the replay data of every song: 5.2 MB for a library of 37 songs. The library list now leaves the replay data out (a re-render reads it from the song), 0.3 MB for the same library, and a burst of changes is read at most every two seconds (from YuE2 Studio #150).
- **Models in a folder with a name outside the system's code page are found**: on Windows the engine read its models folder through the system's ANSI code page, so a path with, say, "é" on a Russian system or Cyrillic on an English one became "?" and the engine started with no models; it now runs with the UTF-8 code page and opens any path.
- **ADPCM WAV files open**: a WAV in ADPCM (a mastering reference, a training song) failed with "no decoder for this audio"; it is read now.
- **The assistant starts on Linux with a glibc older than 2.38**: the CUDA builds of llama.cpp need glibc 2.38, so on Ubuntu 22.04 and the like the assistant did not start; there it now runs the card through the Vulkan build, and its settings say why, as in Speech Studio.
- **Programs started from the Linux AppImage no longer load its libraries**: the file manager, nvidia-smi, the downloaded engine, llama-server, Whisper, the MIDI tool and the trainer were started with the image's library path and could stop on a newer system («undefined symbol»); they start without it, as in Dub Studio.
- **A program downloaded without its execute bit runs on Linux and macOS**: an archive packed on Windows carries none, and the program answered «Permission denied» or was left out of the unpacking; the studio makes it executable.
- **Karaoke, stems and the measurements load on a computer with an old Visual C++ runtime**: ONNX Runtime imports msvcp140_1.dll, which the studio did not check for, so a computer whose Visual C++ runtime predates it passed the check and ONNX Runtime then did not load. The Visual C++ runtime the engine and ONNX Runtime import now ships beside the engine, as in the other studios, and ONNX Runtime finds it there, also before the engine has started; the studio no longer downloads and runs Microsoft's redistributable installer, which needed administrator rights and the network.
- **"Create" no longer seems to do nothing**: when the song could not start - the writing assistant was not reachable, a field was missing - the reason was written at the foot of the form, below what the window shows, and the click looked lost. The form now scrolls to the reason.
- **Mel-Band RoFormer stems on a Mac, and on the processor under Linux**: the Mac had no RoFormer build at all; it now downloads the author's Apple silicon build of BSRoformer.cpp, which runs on Metal and on the processor where Metal cannot. The processor builds for Linux and macOS ship their libraries by their full version alone (`libggml.so.0.15.1`), so the program did not find the name it asks for (`libggml.so.0`) and did not start; the download now gives each such library that name beside it.
- **Audio codes in the Create form are used**: the service dropped the form's audio codes field, so the song was made from scratch, the language model ran its whole length, and the codes changed nothing; they now reach the engine, which decodes them and skips the language model, as a re-render does, and a limited LM KV cache is counted by the codes' length, not the song's.
- **A caption with only some of its headings keeps them once**: a caption with only "Global Metadata" (or two of the three parts) was taken whole into the first field, heading included, and the form then wrote "Global Metadata" twice; each part now goes into its own field, and a heading word inside a sentence stays text.
- **Every window language is named in its own language**: Settings - Appearance - Language wrote Russian in the window's language («俄语» in a Chinese window, "Russian" in an English one) and, in English, Chinese, Japanese and Korean too, so a reader looking for their language did not always find it; the list now reads Русский, English, 简体中文, 日本語, 한국어 in every window.
- **Every audio file the studio reads is taken everywhere**: the library import took only MP3, WAV, FLAC and Ogg, the mastering reference and training pickers each had a list of their own, and none had the formats the decoder reads since this version. The window, the uploads, the import and the agent's tools now take one list - MP3, MP2, MP1, WAV, FLAC, Ogg, M4A/MP4/AAC, AIFF/AIFC, CAF and Matroska audio - and a file the player cannot play as it is (CAF, MKA, AIFF, MP2, ADPCM WAV) goes into the library as FLAC, losslessly; the import hint names them. Opus is not read yet, and is refused with that list.
- **A CUDA failure names the card it happened on**: a song lost to a CUDA error now says the card, its compute capability, the driver and the engine's CUDA build, which tells a card the build has no code for from a driver too old for it; an engine start whose CUDA device is missing quotes what CUDA answered.
- **A lost song names how the engine ended**: an engine that crashed during a song was only "stopped"; its exit code is now read before the restart replaces it, noted in the engine log and told in words in the studio's language - an access violation, an instruction this processor does not have, a library that did not load, memory that ran out.
- **The chosen compute device reaches the engine**: since the upstream update the engine takes its device as `--device` and no longer reads `GGML_BACKEND`, so a card, Vulkan or the processor chosen in Settings - Local engine was ignored; it is passed as `--device`, and a device the engine does not have is named at the start with the ones it has. A failed song's reason is looked for in the whole engine log, not the window's last 512 lines.
- **The statistics count what people ask for, not the window's own polls**: the setup status, the computer's load, the activity, the running songs, the karaoke and assistant states and the engine start and log were counted as features each time the window asked for them by itself; they now carry `x-hub-skip`, as the shared standard says.
- **The window keeps up with a slow service**: the setup status, the engine start, the tools, LoRAs, training, the agent panel and the engine log were asked again on a timer whether or not the last answer had come, so a service answering slowly had the same request queued several times over and the window showed what was on disk minutes late; each is now asked again a pause after its answer, one at a time.
- **A download from a server this network cannot reach fails in a minute and a half, not six, and names the server**: a connection that never opened - blocked, refused, timed out, no DNS answer - was tried eight times, 30 seconds each plus waits, before the setup said "could not start ... after 8 attempts"; it now gives up after three such attempts and says "could not connect to <host>", so it is clear whether Hugging Face, GitHub or NVIDIA is out of reach.
- **"Use models I already have" says what it took and what it left, and why** ([#32](https://github.com/timoncool/MiniMax-Music3-Studio/issues/32)): picking a folder of downloaded models only refreshed the list, and a file it did not take was left without a word. It now says how many files it took and names each model file it left: one with the studio's name but another size (another build - the Light sets' language models on Hugging Face are now imatrix builds of other sizes, the studio takes the pinned ones), a GGUF of none of the studio's sets, or one it could not link or copy.
- **A song finished while a model or LoRA arrives is kept**: the engine is restarted to find a new model or LoRA, and it was restarted as soon as it stopped rendering, before the studio took the finished song, which was then lost ("mm-server completed the job, but the studio could not safely import its result"), and the songs still queued on the engine with it. The restart now waits until the studio has taken every song it sent.
- **A graphics card that is not there is said, not left to the processor**: a card chosen in Settings - Local engine that the computer no longer has made the engine go to the processor without a word; the start now stops with the reason on screen, the card list shows the missing card so another can be chosen, and an engine running on the processor says so in the sidebar.
- **Mel-Band RoFormer checks the processor first**: its build needs AVX2, FMA, F16C and BMI2, and on an older processor it closed without a word; the studio now names what the processor lacks. Audio to MIDI needs no such check: its pack carries a build of ggml for every processor generation. Karaoke's transcribe.cpp is pinned to engine-0.1.3, built without AVX-512 and with the same check.
- **Karaoke's Parakeet runs on the card without the CUDA Toolkit**: transcribe.cpp's CUDA build is loaded into the studio, and Windows looked for its cuBLAS beside the studio and on PATH, not beside the library where the studio puts it; on a computer without the CUDA Toolkit it did not load (error 126). It is now loaded so that its own folder is searched first.
- **Stems on the processor download what they lack**: with Mel-Band RoFormer on the processor the tools page offered to download the 240 MB model already on disk, and the button fetched HT-Demucs instead; it now names the processor build that is missing and installs it.
- **A runtime of an earlier release is updated**: the studio kept any engine, library or transcriber of the same file name as installed, so a newer pin - like transcribe.cpp without AVX-512 - never replaced it; each runtime now records the build it came from and is fetched again when the pin moves.
- **A song lost to the computer's memory says so**: an engine that stopped because the computer's own memory (RAM) ran out - or that ran out of memory with its models on the processor, the most frequent case on computers without a graphics card - was reported as the graphics card running out of memory; it is now told as RAM, with advice that helps (close programs that take memory, a smaller set or a shorter song), and it no longer counts as a device failure under Auto.
- **A song lost to an engine restart says why again**: the reason was read from the last 600 lines of the engine log, and a long run had already pushed its own start out of them, so the message named the new engine's "Listening on" instead of where the old one stopped; it is now read from the lines before the current start. A job the engine reports unknown is told apart from a timeout only by the engine's own 404, not by "404" anywhere in the error, which a job id in the address could hold.
- **Training writes a step as one line** ([YuE2 Studio #144](https://github.com/timoncool/YuE2-Studio/issues/144)): each trained step rewrote the run's whole file with every step so far, and the training page read the whole training log twice a poll; steps now go into a file of their own a line at a time, and the log is read once.
- **A song that does not fit the LM KV cache set in Settings - Local engine is refused with what to set**: with the cache limited (--max-seq, 512 for example) every caption and lyrics longer than it stopped the engine with "kv_len ... > max_seq 512", and a shorter one was cut to what was left of the cache. The studio now counts what the song needs before sending it and names the size to set, or to clear the field.
- **A note written while the song is being made stays** ([ACE-Step Studio #25](https://github.com/timoncool/ACE-Step-Studio/issues/25)): the note of a song still in the making was cleared when the song was done; it now goes into the finished songs and is saved with them.
- **Show JSON stays open** from song to song in the song's details, to compare their settings ([ACE-Step Studio #48](https://github.com/timoncool/ACE-Step-Studio/issues/48)).
- **The create form keeps its settings** ([YuE2 Studio #134](https://github.com/timoncool/YuE2-Studio/issues/134)): the steps, guidance, sampling and the other generation settings went back to their defaults at every start and every F5; they now stay, as the words, the length and the file format do, until "Reset to reference" puts the defaults back.
- **Change cover works in the Library** ([ACE-Step Studio #48](https://github.com/timoncool/ACE-Step-Studio/issues/48)): the button showed on the Library's songs but opened nothing; it opens the cover editor as on the create page.
- **Mel-Band RoFormer and HT-Demucs download from Settings - Models - Split into stems** ([#33](https://github.com/timoncool/MiniMax-Music3-Studio/issues/33), [YuE2 Studio #134](https://github.com/timoncool/YuE2-Studio/issues/134)): the card's Download button sent the engine's name, which the studio did not know ("unknown asset roformer"), so neither separator could be installed from there in 3.7.0; it now installs the engine whole on the chosen device, the bin removes that engine's files (it always removed HT-Demucs before), and the runtime downloading after HT-Demucs's model shows its progress instead of "not installed".
- **Several songs at once no longer risk a graphics card failure**: the flash attention kernel that skips masked keys read past its mask for the second song of a batch (in YuE2 Studio 3.7.0 the most frequent failure, "CUDA error: an illegal memory access"); the engine now reads the one mask the songs share.
- **Karaoke recognition no longer closes the studio on processors without AVX-512**: the transcribe.cpp engine of 3.7.0 was built for the processor it was built on and used AVX-512 instructions, so on most Intel and older AMD processors the first karaoke stopped the studio without a word. The engine is now built for every x86-64 processor with AVX2 (Intel since 2013, AMD since 2017), as fast as before, and on a processor without AVX2 the studio says so instead of closing.
- **Style by ear on macOS and Linux** ([YuE2 Studio #138](https://github.com/timoncool/YuE2-Studio/issues/138)): the captioner was only published as a Windows build, so the download said "is a Windows build and is not available on this platform yet". The Mac app and the Linux packages now carry their own captioner, built with the MIDI transcriber.

### Changed

- **An update screen says what the release changed in the engines and models**, as in ACE-Step Studio: on the first start of a release that changes what the studio downloads, a screen built like the first-run page lists what is updated (old build → new, size), what is new and what is no longer needed (space freed), each with its reason, and one button downloads it all and then removes what former versions left - Faster-Whisper once CrisperWhisper is in place, the ONNX Parakeet. Nothing is removed at start any more, and a component of an earlier version keeps its files until the new one has arrived, so an update cut off leaves a working studio. «Later» puts it off; the same plan stays in Settings - Models, and agents have it as models_update_plan, models_update_apply and models_update_later.
- **Karaoke and the dataset lyrics hear with CrisperWhisper 2.0 turbo, as in ACE-Step Studio, Speech Studio and Dub Studio**: Whisper-Faster with its CUDA 11 cuBLAS and cuDNN 8 gives way to CrisperWhisper 2.0 turbo, Whisper large-v3 turbo trained for verbatim word timings, in audio.cpp's server: the CUDA 13 or CUDA 12 build on an NVIDIA card (on Linux with NVIDIA's CUDA libraries from their PyPI packages, as Dub Studio takes them), Vulkan on another card, the processor's build without one, Metal on a Mac. Its model is taken from a neighbouring program that has it or downloaded, checked by its SHA-256; segments the model fills a gap with are left out, as before. The update screen removes the old Whisper once CrisperWhisper is in place, and a Whisper size left in the settings no longer names a model.
- **The genres of Search speak the window's language, as in YuE2 Studio**: the genres stay in English, the language the model reads its style in, and a window in Russian, Chinese, Japanese or Korean shows each one's meaning beside its tag on the Search page (dubstep дабстеп, 回响贝斯, ダブステップ, 덥스텝).
- **Every download is checked against its publisher's SHA-256, as in Speech Studio**: the runtimes, the assistant's models, the karaoke and stem models are checked against the hash GitHub, Hugging Face, NVIDIA or PyPI states for the pinned file; a file that differs is removed and the download fails naming both hashes. cuBLAS 12.9 for the stem separator and the measurements now comes from NVIDIA's PyPI wheel, whose hash is published. Whisper-Faster and cuDNN 8 stay checked by size: their publishers state no hash.
- **The studio's log on disk, as in Speech Studio**: every line the service writes goes to `logs/minimax-studio.log` in the data folder at once, with the time, kept to 8 MB with the previous start's beside it; a crash of any thread and, on Windows, an exception nobody handles (an engine library running an instruction this processor lacks, a bad access) are written there with the module and offset; each song's start and end with its outcome; keys masked. The bug-report pack carries it.
- **System diagnostics and a bug-report pack, as in Speech Studio**: Settings - Local engine - System diagnostics shows what the studio sees - the version, the system, the graphics card with its driver, compute capability and the CUDA build, memory, which music models and optional parts are on disk, which libraries the engine misses, and the latest lines of the studio's log - with buttons to copy it, to pack a bug report (the diagnostics, the journal and the logs, every key masked) into the data folder's `reports`, to report a problem and to open the logs folder. Agents get the same through `diagnostics_get` and `diagnostics_report`.
- **Notices from Studio Hub as every studio shows them**: popups from the hub now show in the studio, to everyone, and wait until no song, re-render, cover or timing is being made to appear, then stay until closed; the sections a notice names are the hub's (create, library, news, tools, settings); strips stand by priority; a link in a popup counts as its click; the hub's news stand among the release notes by date with their picture, all their buttons and the ad label. The window's own reads of the training, LoRAs, stems, MIDI and agent states are no longer counted as features used either.
- **llama.cpp b11900 for the assistant**, as in ACE-Step Studio; the Windows CUDA runtimes of llama.cpp are the same files and stay at b11236. ONNX Runtime for the separator and the measurements stays 1.30.0, the build 3.7.0 installed. **ONNX Runtime starts with its telemetry off**: Microsoft's builds send usage telemetry unless the environment turns it off, and the studio's did not.
- **The assistant's Gemma models are pinned to a revision**: they were fetched from the repositories' main branch, where a corrected upload of the same name changes the file under the studio; each is now taken at its commit, and one kept before is installed only at the pinned size. The same for karaoke's Whisper models and for Style by ear's MOSS-Music, Beat This! and S-KEY: no model is fetched from a branch any more.
- **The spectrum has an Analyzer look**, as ACE-Step Studio has: a continuous curve over every FFT point with Hz and dB scales, 20 Hz to 22 kHz; the Hi-Fi look reaches 22 kHz too.
- **Models, LoRAs, the assistant's Gemma and the hub search can come through HF-Mirror** ([#32](https://github.com/timoncool/MiniMax-Music3-Studio/issues/32)): Settings - Providers - Proxy has a model download source, Hugging Face or HF-Mirror (hf-mirror.com), with the pinned revision kept, as in YuE2 Studio; the download error that pointed there had no such setting in this studio. When Hugging Face does not answer, the first-run page asks HF-Mirror too and offers a button to take the models from it; nothing switches by itself, and when the mirror does not answer either the page says so with both reasons and where the proxy is set. The question is asked again after a download fails.
- **Every missing model file can be downloaded by hand** ([#32](https://github.com/timoncool/MiniMax-Music3-Studio/issues/32)): on the first-run page and in Settings - Models, "Download by hand" lists each file of the chosen set that is not on disk with its exact name and size in bytes, its address at the pinned revision on Hugging Face (and on HF-Mirror when that is the source), a copy button, and the folder it goes into.
- **The Library shows a song's details beside the list**, as the create page does ([ACE-Step Studio #48](https://github.com/timoncool/ACE-Step-Studio/issues/48)): a click on a row chooses the song without playing it, the cover plays it, and on a narrow window the details open over the page as before. In Russian the Library is called «Медиатека».
- **Why a song failed is said in the studio's language**: a song refused before it is sent, lost with an engine that restarted, given up by the engine or not taken into the library is told in English, Russian, Chinese, Japanese or Korean, as the window is set; the service keeps the English text for its log, the statistics and agents, with a code and fields beside it.
- **Engine builds for every card and driver**: the CUDA 13 build carries device code only (no PTX, which an older driver cannot compile), NCCL is off, every configure starts fresh, and the Mac build no longer takes the build machine's processor features.
- **Engine updated from minimaxmusic.cpp upstream**: the latest ggml and the --device choice of the compute device; our fixes stay on top.

## 2026-10-21 — 3.7.0

### Added

- **Cleaner vocals with Mel-Band RoFormer.** Settings - Models - Stems now offers Mel-Band RoFormer voc_fv6 (Q8_0), Dub Studio's separator run by BSRoformer.cpp, beside HT-Demucs: it splits a track into the vocals and the instrumental, more cleanly, and the vocals of training are separated with it too; on an NVIDIA card it runs on the engine's cuBLAS, elsewhere on the processor. HT-Demucs stays the default for six stems ([YuE2 Studio #108](https://github.com/timoncool/YuE2-Studio/issues/108)).
- **LoRA from your own folder, without a copy.** LoRA page - Add from folder: every LoRA of a folder you keep for all your programs (ComfyUI, a trainer) and its subfolders is taken in place - a folder with adapter_config.json is one LoRA, elsewhere each .safetensors is one - by a hard link, copied only from another drive, and the studio says which; agents use `lora_import_folder` ([YuE2 Studio #98](https://github.com/timoncool/YuE2-Studio/issues/98)).
- **A saved stem names its song's tempo and key.** A vocal or any other stem saved for a DAW is named like `Song - vocals - 109 BPM, D major.wav`, as the song records them ([YuE2 Studio #108](https://github.com/timoncool/YuE2-Studio/issues/108)).
- **A unique pattern for every song.** Settings - Covers - Pattern - Unique pattern of each song: the shapes come from the song's lyrics (a song without lyrics, its title) and the colours from its style, out of the pattern style's own palette, so songs of one style share their colours and new lyrics draw new shapes; a changed style or text draws the pattern again. The choices now read Pattern, Photo, Generation; a photo for the style stays the default ([ACE-Step Studio #52](https://github.com/timoncool/ACE-Step-Studio/issues/52)).
- **Your own agent CLI writes the words.** Settings - Models - Writing assistant - Agent (CLI): Claude Code, Codex, opencode, Antigravity or Muse Code installed on this computer writes on your own account with it, one hidden run per draft, without tools; the panel shows which are installed, how to install and sign in, and tests one with a short draft. Antigravity runs only sandboxed. Agents see the CLIs with `assistant_cli_agents` (from [YuE2 Studio #112](https://github.com/timoncool/YuE2-Studio/pull/112), thanks to GuilhermeAmado).
- **An agent reaches everything the studio does.** A test now holds every route of the studio to a tool or to a written reason, and the agent gains what it lacked: the network proxy (get, set, test), access from the network, the Activity journal, the look of tracks without a cover, photo and pattern covers and photo search, video background search, a song's note, its own MIDI file, a playlist by itself, the graphics cards and the downloadable parts' state.
- **Lyrics in a video clip, found where they are.** The video screen's Text tab always shows the lyrics overlay: a song without karaoke timing gets a button that makes it there, and the overlay turns on when it is done; without karaoke set up it says where to set it up. Until now the overlay section was hidden for such a song ([#118](https://github.com/timoncool/YuE2-Studio/issues/118)).
- **Fade in and fade out.** The create page's output settings take seconds for a fade at the start and at the end of the made song, so an ending no longer stops abruptly; the studio applies them to the song it keeps, Reuse Prompt and a re-render keep them, and agents give `fade_in` and `fade_out`.

### Fixed

- **Karaoke on an instrumental no longer hangs on "downloading"**: the studio checked the song after fetching the recogniser and left that download's line running when it then refused the track; the song is checked first, and a finished download ends its line.
- **A long step no longer gets the engine restarted** ([YuE2 Studio #129](https://github.com/timoncool/YuE2-Studio/issues/129)): an engine inside a long step does not answer its health check in time, and the studio took that for a crash and restarted it, losing the song; while a job is running and the engine process is alive, it is at work.
- **Auto stays on the graphics card after a silent engine exit** ([YuE2 Studio #127](https://github.com/timoncool/YuE2-Studio/issues/127), [#128](https://github.com/timoncool/YuE2-Studio/pull/128) by ramishi): an exit with no device error in its log (out of memory, a kill, a slow start) no longer moves Auto to the processor for the rest of the session.
- **The create form keeps its words** ([ACE-Step Studio #54](https://github.com/timoncool/ACE-Step-Studio/issues/54)): the name, the style and the lyrics stay across restarts, as the length and the file format do, until Reset clears them.
- **The training page says where to install the card runtime.** When preparation measures tempo on the processor, its notice now names the way to the graphics-card ONNX Runtime for this machine's card: Settings → Models → Optional extras → Split into stems → Graphics card on NVIDIA, Karaoke timings → Graphics card on AMD and Intel (DirectML).
- **A computer's memory as its box says it.** The studio counted RAM in 10⁹-byte gigabytes, so a 32 GB computer read 34 GB (in the issue form too); memory is now counted in 2³⁰-byte gigabytes, as video memory already was, and so are the model sets' needs.

### Changed

- **Karaoke's Parakeet on transcribe.cpp.** Parakeet v3 and Parakeet Ultra run as GGUF Q8_0 on transcribe.cpp, the engine Dub Studio and Speech Studio use, instead of ONNX Runtime: its CUDA build on an NVIDIA card with a CUDA 13 driver, its Vulkan build on any other card (and on Linux without the system's CUDA 13 cuBLAS), its processor build without a card; on a Mac Metal on Apple silicon and the processor on Intel. The files have Dub Studio's names and folders, so one program's copy serves the others, and the model leaves the graphics card when a recognition ends, so the card is the music engine's again. A saved fp32 choice becomes Parakeet v3 (full weights are not kept), and the ONNX Parakeet folders of 3.6 and earlier are removed at start.
- **Whisper on the graphics card keeps int8 weights** (int8_float16) instead of float16.
- **Audio to MIDI and the training pack are one download.** The MIDI transcriber, the trainer and the captioner come from one HOT-Step build that shares its graphics-card libraries, in one folder: 133 MB once instead of 126 and 132 MB apart, and installing either one installs both ([YuE2 Studio #104](https://github.com/timoncool/YuE2-Studio/issues/104)).

## 3.6.1 — not released on its own; its fixes are part of 3.7.0

### Fixed

- **An agent sees the window as you do.** Through the studio's MCP it now sees folded sections (open or closed) and the options of open lists, reads a field by its own label rather than by the options inside it, and a field it fills while the window is in the background saves as after your own click.
- **LoRA preparation says which song does not fit and why.** A song longer than the model's 24576 tokens (prompt, score and audio together) passed preparation and failed at its end with "prepared manifest failed reader roundtrip"; the trainer now names the song and its sizes, and a roundtrip failure carries the reader's reason ([#110](https://github.com/timoncool/YuE2-Studio/issues/110)).
- **Karaoke and stems on a Mac.** The Mac build downloaded the Windows ONNX Runtime and could not load it; it now takes Microsoft's macOS arm64 build, runs Parakeet and the separator on the processor, and the app may load that library (it is signed by Microsoft, not with the app). Whisper and the CUDA and DirectML parts are not offered on a Mac, where they cannot run ([YuE2-Studio #105](https://github.com/timoncool/YuE2-Studio/issues/105)).
- **A download Hugging Face does not answer says why and what to do.** The error kept only "error sending request" and lost the cause (the name not found, a timeout, a refused connection); it now names it, and when the model comes from Hugging Face it points to Settings - Network, which can take models from the HF-Mirror instead.
- **Karaoke that cannot start says why and ends.** An ONNX Runtime the studio could not load stopped the recogniser with a panic: the karaoke stayed "running" for ever and every later try answered "Mutex poisoned" until a restart. The library is now loaded before any work and a failure is that work's error, with the library's path; a recogniser that stops ends its karaoke as failed ([YuE2-Studio #106](https://github.com/timoncool/YuE2-Studio/issues/106)).
- **The song details button is back on wide windows.** 3.6.0 hid it on the create page whenever the details could sit beside the list; it shows at every width again ([YuE2-Studio #99](https://github.com/timoncool/YuE2-Studio/issues/99)).
- **The Linux AppImage starts its engine again.** The AppImage put the MIDI tool's older ggml library on the path every program inherits, so the engine loaded it instead of its own and stopped at once ("undefined symbol: ggml_prec_set_acc"). Every program the studio starts now loads the libraries beside it first: the engine, the writing assistant, the trainer, Audio to MIDI and the karaoke recogniser ([YuE2-Studio #97](https://github.com/timoncool/YuE2-Studio/issues/97)). Thanks to angelside, who found the cause.
- **The writing assistant works on Linux.** It downloaded the Windows builds of llama.cpp and could never start; it now takes llama.cpp's Linux builds for the processor, Vulkan and CUDA ([YuE2-Studio #114](https://github.com/timoncool/YuE2-Studio/issues/114)).

## 2026-10-16 — 3.6.0

### Added

- **A library as roomy as a music service's.** Compact rows show three times as many songs; the tabs count their songs and the filters say how many of how many are shown. Filters pick where songs came from (made in the studio, imported, stems and processing) and those with karaoke or processed versions; Recently played joins the orders. A right click on a song opens its menu, which gains Play next and Add to queue. In a selection the bar stays on screen while the list scrolls, Shift+click takes a range, Ctrl+A every song and Esc leaves it, and the chosen songs can be liked, queued or downloaded at once. Liked and Playlists say what to do when they are empty.
- **Playlists to keep and play.** A playlist's name and description change in place, its songs move by dragging or Alt+Up/Down, and songs are found and added on its own page; a song taken out comes back with Undo. Its picture is the covers of its songs, the same on its card and its page; the song playing is marked; Shuffle plays it in a mixed order, and a card has Play on its cover and a menu on a right click. Adding songs says which playlist they went to and which were there already. Back from a playlist returns to the Playlists tab. Agents queue songs with `player_queue_add`; `playlist_update` takes the whole order.
- **Winamp plays the studio's playlists.** The studio's shuffle and repeat go into Winamp and come back; LOAD LIST and ADD open the studio's playlists, the liked songs and the whole library, and SAVE LIST writes over the playlist the music came from or into a new one.
- **A track's file carries how it was made.** Besides the title, lyrics and cover, the file now holds the song's note as its comment, its whole style, and its generation settings (a JSON document of seed, models and options, without paths on your computer) in fields of the studios' own. Importing such a file back fills Reuse Prompt with what it was made with, in the studio that made it; any file brings its title and lyrics, and the library says how many files came in. Tracks made before get theirs at the first start. Settings › Privacy turn it off, and every stored track is tagged again ([ACE-Step-Studio #50](https://github.com/timoncool/ACE-Step-Studio/issues/50)).
- **Several tracks to MIDI at once.** Choose songs in the library or on the create page and press To MIDI: they are turned into MIDI one after another, Studio tools shows which track it is on and how many are done, Stop ends the set, and a track that fails is named while the rest go on. Agents give `song_ids` to `midi_transcribe` ([YuE2-Studio #94](https://github.com/timoncool/YuE2-Studio/issues/94)).
- **Sorting out a long list of songs.** A song's row has a Delete button beside Add to playlist, and the chosen songs of a selection go to a playlist in one go. The Library's All and Liked tabs have the create page's search, filters, selection, Like, Add to playlist and Delete, and a details button that opens the song's details over the page and closes them again ([ACE-Step-Studio #48](https://github.com/timoncool/ACE-Step-Studio/issues/48)).
- **OGG and FLAC songs can be imported into the library**, beside MP3 and WAV, and turned into MIDI, stems or karaoke like any other ([YuE2-Studio #94](https://github.com/timoncool/YuE2-Studio/issues/94)).
- **The version in the window title and under the studio's name**, with "Portable" on a portable copy, so a copy waiting to be updated tells which it is ([ACE-Step-Studio #40](https://github.com/timoncool/ACE-Step-Studio/issues/40)).
- **Every settings slider takes a typed number.** The value beside a slider is a field: type `0.40` for a LoRA's strength, `2:10` for a duration or `6` for an equalizer band, and Enter sets it, kept within the slider's range (a comma works as the decimal point, Escape puts the value back). On LoRA strength, the creation settings, audio processing, the equalizer, the Winamp size and the video clip editor.
- **Any engine launch flag and a hand-built engine.** Settings - Local engine take one line of extra flags for the engine, split as a shell would and placed after the studio's own, and an engine executable of your own build, picked in a file dialog and checked when saved. The restart button saves the page first and starts what it shows; an old engine still holding the port is waited for and refused instead of being reused with its old flags. Ported from [@wuyue92tree](https://github.com/wuyue92tree)'s change to ACE-Step Studio ([ACE-Step-Studio #46](https://github.com/timoncool/ACE-Step-Studio/pull/46)).

### Fixed

- **"Instrumental" is not a genre.** A style that starts with "instrumental" no longer files the track under the genre Instrumental in its file; the next phrase that names music is taken, or none.
- **An installation under Program Files downloads the engine's libraries.** The studio put NVIDIA's cuBLAS beside the engine, where Windows lets no program write without administrator rights, so an installed studio stood at "Downloading the engine library - 0%" for ever. Where the engine's folder cannot be written, the libraries now go to the studio's data folder and the engine finds them there ([ACE-Step-Studio #49](https://github.com/timoncool/ACE-Step-Studio/issues/49)).
- **Stems, karaoke and Audio to MIDI work on Linux.** The studio downloaded the Windows builds of their runtimes on Linux and stopped there without a word. It now takes Microsoft's and NVIDIA's Linux builds of the same versions - ONNX Runtime with CUDA, cuBLAS, cuDNN, cuFFT, cuRAND - and Purfview's Linux Whisper, runs the separator and recogniser on an NVIDIA card there, and the Linux packages carry the MIDI transcriber ([YuE2-Studio #95](https://github.com/timoncool/YuE2-Studio/issues/95)).
- **A download that cannot start says so in its panel** instead of leaving the bar where it was.
- **"Use models I already have" takes only the models in the folder.** A file was taken for every model of the same size, and many models of one architecture weigh the same to the byte, so four files came in as a dozen models with the wrong weights under their names; a file under another name is now taken only when its contents are that model's ([ACE-Step-Studio #40](https://github.com/timoncool/ACE-Step-Studio/issues/40)).
- **One version everywhere.** The studio's version is written in `desktop/src-tauri/tauri.conf.json` alone: the window, the service, the interface, the project page and the release all read it there, and the studio names itself to the sites it asks with it instead of 0.1.0.
- **An agent's command to a closed window fails at once.** A window that closed without saying so kept the agent waiting the full five minutes for its answer; the command now fails as the window goes, and the next call reaches another open window or says none is open.
- **The window gets the microphone it asks for.** WebView2 left the request with no answer and no prompt, so recording in the audio editor waited for ever; the studio's own page is now allowed the microphone, nothing else is.
- **A song lost to the graphics card names the error.** "The graphics card failed" now carries the engine's own CUDA or Vulkan error, and a song lost to an engine that ended without a word says the last thing it wrote, so the cause can be told apart instead of guessed.
- **A recording that will not play says why.** The player of a training song or a stem turned to Pause and stayed silent when the window could not play the file; it now stays on Play and names the reason the window gave ([YuE2-Studio #75](https://github.com/timoncool/YuE2-Studio/issues/75)).
- **Training songs play in the window.** The player of a song in a training set asked the window's own page for the recording instead of the studio, so in the window it stayed silent while a browser played it ([YuE2-Studio #75](https://github.com/timoncool/YuE2-Studio/issues/75)).
- **Access from the network can be turned on from a browser on the studio's own computer**, not only in its window, so a studio on a server without a desktop is reachable; and access turned on by hand in `studio-settings.json` without a key now gets one when the studio starts instead of staying on this computer only ([ACE-Step-Studio #47](https://github.com/timoncool/ACE-Step-Studio/issues/47)).
- **Downloads that stall come back.** A connection that stopped sending held the download at the same byte for ever, with no error and no retry - most visibly the engine libraries from NVIDIA, which kept the start screen at "Downloading the engine libraries - 0%" ([YuE2-Studio #92](https://github.com/timoncool/YuE2-Studio/issues/92)). A silent connection is now dropped after a minute and the piece is fetched again, and a server that refuses a file says so at once instead of after two minutes of retries.
- **Only the studio's own window and agents can use it.** A web page open in your browser could send requests to the studio on this computer, and the studio answered any site; it now refuses pages of other sites, and requests that reach it under another site's name (DNS rebinding), as Dub Studio does.

## 2026-10-14 — 3.5.5

### Fixed

- **The engine starts on macOS.** The bundled engine looked for its libraries in the build machine's folder and never started on a Mac; it now finds them beside itself ([YuE2-Studio #79](https://github.com/timoncool/YuE2-Studio/issues/79), [YuE2-Studio #81](https://github.com/timoncool/YuE2-Studio/issues/81)).
- **The writing assistant works with OpenRouter.** Saving the model put the assistant back on a local provider, so with a key and a model chosen it still said "not installed" and the wand opened the setup page; the choice now stays, and the providers page no longer undoes a choice made on the models page ([YuE2-Studio #80](https://github.com/timoncool/YuE2-Studio/issues/80)).
- **Imported tracks show their real length.** An MP3 was measured as if it were 128 kbps, so a 320 kbps file showed two and a half times longer in the library than in the player; files are measured from their own headers, and tracks already imported are measured again on start ([YuE2-Studio #77](https://github.com/timoncool/YuE2-Studio/issues/77)).
- **The song details button stays on wide windows.** It disappeared above a certain width, and once the side panel was closed nothing opened it again ([YuE2-Studio #84](https://github.com/timoncool/YuE2-Studio/issues/84)).
- **The audio editor keeps the sample rate.** It decoded every file at 44.1 kHz, so a 48 kHz song was resampled on opening and saved at 44.1 kHz; it now opens and saves at the file's own rate ([YuE2-Studio #83](https://github.com/timoncool/YuE2-Studio/issues/83)).
- **"Without stopping" stops when a song fails.** It sent the same request again and again although each one failed - a deleted source song, a card out of memory - hundreds of times in a row; a failed song now switches it off and says why.
- **A failed song names the cause.** The message showed the engine's last complaint, such as "encode failed", instead of the first one that caused it.
- **Models not downloaded yet are called that.** "Not installed" next to a model read as a broken installation.

## 2026-10-11 — 3.5.4

### Fixed

- **Exports from the MIDI editor are saved.** Export WAV, Export MP3 and the MIDI download filled their progress bar and then did nothing in the desktop window; they now open the Save dialog, named after the song ([YuE2-Studio #71](https://github.com/timoncool/YuE2-Studio/issues/71), [#72](https://github.com/timoncool/YuE2-Studio/issues/72)).
- **Playback on Linux.** The AppImage now carries the GStreamer libraries and plugins the window plays sound with, so playing a song no longer crashes on systems such as Arch ([YuE2-Studio #70](https://github.com/timoncool/YuE2-Studio/issues/70)).
- **Songs stay on this computer's engine.** Settings from an older build could switch song-making to OpenRouter with no model chosen, and every song then stopped with "OpenRouter music requires a selected model"; songs go back to the studio's own engine, and OpenRouter can be picked for songs only once its catalog offers a model ([ACE-Step-Studio #37](https://github.com/timoncool/ACE-Step-Studio/issues/37)).

## 2026-10-10 — 3.5.3

### Fixed

- **Works offline.** With the computer offline the window held every read and change until a network came back:
  a song stood at its last stage although it was made, and a song deleted came back when Wi-Fi was turned on.
  The window talks to the studio on this computer and no longer waits for a network.
- **Describe by ear hears FLAC songs.** Since songs are kept as FLAC the captioner refused them; they are handed
  to it as WAV.
- **WAV (32-bit float)** is offered again beside FLAC and MP3, in the form and in Re-render.
- **Audio to MIDI keeps the size you pick.** The models page put the choice back to medium while a download ran,
  so small and large looked impossible to get; the largest size downloaded is now the one offered first, on the
  models page and on the tools page.
- **Send to the form keeps the song's seeds.** The sound seed and the planner seed came to the form empty, so the
  same song could not be made again; both come along now and the random switch is turned off.
- **Linux packages run on Ubuntu 22.04** and other systems with glibc 2.35 or newer; they needed 2.38.

## 2026-10-10 — 3.5.2

### Added

- **News strips.** Short notes from the author appear as a strip across the top of the window, in the
  window's language, with a link and a close button; the first one is about Dub Studio, the video dubbing
  studio. A closed strip does not come back.

### Fixed

- **Quitting and updating ask in the studio's own language.** The question about quitting while a song is
  being made and the update offer are now part of the window, in its language and look, instead of English
  system dialogs. Closing the window a second time still quits if the window stopped answering.
- **The day's statistics leave when the studio closes** instead of at its next start.
- **A model set put together by hand is counted as it was when the song started**, not as it was when the
  song ended.
- **Statistics count finished songs by job** as well as by song, so the share of failed songs compares
  like with like.
- **Linux builds are marked experimental** in the README, with an invitation to Linux users to polish them
  and send pull requests.

## 2026-10-10 — 3.5.1

### Fixed

- **Statistics name the model set in full.** A set put together by hand is reported by its parts, and a day
  on several sets reports each with its number of songs; a failed song reports its reason, with paths, names,
  links and quoted text cut out on this computer before it leaves.
- An agent's Play no longer takes over the player while you listen: a song you are playing is neither
  switched nor paused, and the agent is told you are listening.
- A like is a heart everywhere: the song list and its Liked filter showed a thumbs-up while the
  player and the side panel showed a heart.
- On the start screen the statistics checkbox, its label and What is sent stand on one line in one
  colour; the link sat lower than the label and in another colour.
- The notes of 3.4.0 and 3.5.0 in News are laid out like the earlier ones: a summary line, then each
  change as a point with its name in bold.

## 2026-10-09 — 3.5.0

### Added

- **Anonymous statistics and news from the hub.** The start screen and Settings - Anonymous statistics have
  a checkbox, on by default, with which the studio sends once a day how many songs were made, failed or
  were cancelled, the model set used, its version, the OS and the class of the graphics card - never lyrics,
  prompts, audio or file names; What is sent shows the report, and DO_NOT_TRACK=1 or STUDIO_TELEMETRY=0
  turns it off entirely. News from the author arrive without an update, on top of the bundled ones.
- **Quitting asks first while a song is being made**, and stops it if you agree; a song the
  studio was closed on is started again at the next start (up to three times), and one you stopped
  stays stopped (as in YuE2 Studio).
- **A note on every song, and its parameters** sent to the form, shown as JSON and saved to a
  file, as in ACE-Step Studio; reusing a song opens the studio form, where its fields are.
- **Engine progress on the card**: the stage, its step counter and the time left.
- **Video export settings**: frame size from 1080p to 240p and AAC from 128 to 320 kbps.
- **Parakeet Ultra int8** for karaoke: Moondream's fine-tune of Parakeet, quantized, a recogniser
  of its own beside v3, which stays as it was.
- The window keeps its size, place and maximised state; the player its repeat and shuffle.
- **macOS and Linux builds**, as in YuE2 Studio: Apple Silicon with the engine and Audio to
  MIDI on Metal, data in Application Support (after stalexxx's port); Linux x86-64 as a .deb
  and an AppImage with the engine on Vulkan, the graphics card named and child processes
  ending with the studio (after SkySlider's fork). Built by hand from a workflow of their own.
- **The prompt checked while it is written**: the length counted by the engine's own tokenizer
  (marked as an estimate when the engine is not running), each lyrics line whose words follow
  a section tag on the same line, which the engine never sings, and a caption that does not say
  who sings. A prompt over 5000 tokens is refused with how much to cut. Agents get the same
  check as `song_prompt_check`.

### Fixed

- The recommended model set fits the computer's memory as well as the card, and a set that needs
  more memory than the computer has says so on the start screen; full BF16 weights are no longer
  recommended, Q8 is near lossless at half the size (as in YuE2 Studio).
- Audio to MIDI no longer needs CUDA 13: it runs on CUDA where the engine does and on the
  processor elsewhere (Pascal, AMD, Intel); the new package is fetched once into a folder of its
  own.
- The MIDI editor keeps notes in place after an unknown meta event (files from Reaper).
- The exported video's visualizer moves as in the player; its background no longer freezes on
  zoom and pan.
- Updating a LoRA from the catalogue left its old weights beside the new ones, and the engine
  refused the pair.
- Training shows the loss as loss.
- A model set downloaded or picked component by component that is exactly one of the declared sets
  is recorded as that set, so songs and statistics name it (as in YuE2 and ACE-Step Studio).

### Changed

- **A song is kept as the model made it.** The engine hands over its float output and the
  studio encodes it once, changing nothing on the way: lossless 24-bit FLAC by default, written
  by libFLAC 1.5.0, the reference encoder; MP3 by LAME when chosen. Generation no longer
  normalises the peak: Normalise is a stage under Process, after mastering. A float above full
  scale is lowered into FLAC and MP3 as a whole rather than cut.
- **Tags in every kept format** (lofty): title, artist, genre, tempo, lyrics and cover go into
  a FLAC's Vorbis comments and picture block as into an MP3's ID3v2.4.
- **Engine: minimaxmusic.cpp of 8 October** (ggml 0.26).
- **Trainer: HOT-Step of 7 October**, about 14% faster per step with identical weights.

## 2026-10-01 — 3.4.0

### Added

- Editable chord and section lanes above the MIDI piano roll; chord timing and section markers survive saving and reopening.

- **The MIDI editor.** A piano roll with tracks, instruments and drums (signal, MIT, played
  through the A320U SoundFont) opens in two places: in Studio tools on a new song, played in
  from a MIDI keyboard or the computer's keys, recorded or drawn; and on a track's MIDI, Edit
  beside Save, kept on the track in place of the transcription while the track's audio stays
  as it is. A new song is saved to the library as a track, its audio rendered through the
  same SoundFont and its MIDI kept beside it.

## 2026-09-30 — 3.3.0

### Added

- **A cover for every track.** A track without a cover of its own gets one chosen in
  Settings - Cover art: a free (CC0) photograph from Wikimedia Commons that fits the genres,
  moods and instruments of its style, found without a key; a pattern in one of 21 DiceBear
  styles (CC0), waves by default; or a cover generated through OpenRouter for every new track,
  the prompt templates shown in that mode. The picture is chosen by the track's seed, so it
  stays the same after a restart, and a stem wears its song's.
- **Save the cover into the track**, on by default: the photograph or pattern is stored with
  the track and written into the MP3's tags, tracks made before included, so a player shows
  it after the download; off, it is only shown in the studio. Changing the look draws the
  placeholders again, and a cover of the track's own is never touched.
- **The cover window** offers the same choices for one track: Commons photographs by search,
  starting from the scenes its style calls up, the track's pattern in any style with Another
  variant, generation through OpenRouter, or a file of one's own; a chosen photograph keeps a
  link to its page.
- **The video editor's background and centre picture** are chosen in the same window, the
  background also from Commons clips free of copyright; the Random background is a
  photograph for the track's style.
- **Activity**, the last item of the sidebar, after News: a log of every change an agent
  makes through the MCP server - a generation started, a song edited or deleted, a playlist,
  stems, karaoke, a dataset and its preparation, training, a LoRA, a model downloaded or
  removed, a setting - and of every message the studio shows, kept by the service (the latest
  500) and read by every window in its own language, with how long ago and the exact moment.
  (YuE2 Studio #34)
- **Sort** beside Filters on the Create page and beside the library's tabs: newest or oldest
  first, by title, by length, and recently liked in Liked Songs; each list keeps its own, and
  songs being made stay on top. (YuE2 Studio #34)
- **The Create list shows the playlist the songs go into**, the way a workspace does: with a
  playlist chosen in "Into playlist" the list beside the form is that playlist and its songs
  being made; "Nowhere" is the whole library. (YuE2 Studio #34)
- Song rows say when a song was made, how long ago with the exact moment on hover, and the
  details give the date with the time. (YuE2 Studio #34)

### Changed

- The hand-written pattern generator is replaced by DiceBear 11, drawing the same picture in
  the window and in the service, which writes it into the track as a PNG.
- The Pexels browser, which needed an API key, and the random photograph from picsum.photos,
  which answers Russia with 403, are gone.
- "Draw a cover for every new track" is now the Generation mode of Settings - Cover art.
- **A like is kept with the song** in the library instead of one window's storage: every
  window and the agent see the same likes (the agent without an open window), they survive a
  profile change, and Liked Songs start from the latest. Likes an earlier version kept in the
  window move into the library once. (YuE2 Studio #34)
- **A stem is shown under the song it was separated from**, behind "Stems · N" with its
  parts' icons, on the Create page and in the library: the song count no longer counts stems,
  a list plays its songs and a stem plays alone. Covers, re-renders and processed songs stay
  songs of their own. (YuE2 Studio #34)
- Separating a song again asks first, naming the stems it replaces; separating a stem is
  disabled with the reason, and the service refuses it to an agent too. (YuE2 Studio #34)
- The playlist page reads the shared library, so a deletion, an edit or a song made anywhere
  shows at once, and deleting a playlist asks in the studio's own dialog.
- Tools that write over stored content (song, playlist, dataset and LoRA edits, a dataset
  prepared again, stems, karaoke, MIDI, covers, the OpenRouter key) are marked destructive,
  so the agent's client asks before them. (YuE2 Studio #34)

### Fixed

- A playlist created, changed or deleted in one window shows in the others at once.
- An agent's song edit that leaves the metadata out keeps what the studio stores there - the
  like, processed versions, karaoke, the cover - instead of wiping it.
- An agent's command goes to the window the person turned to, not the one opened last. (YuE2 Studio #34)
- Every icon button of the player, the song card and the library rows has a name for screen
  readers, the same words as its tooltip. (YuE2 Studio #34)
- While the library is being read, the list says so instead of "no songs match the filters".
- Stem names are shown in the window's language.

## 2026-09-30 — 3.2.0

### Added

- **8 GB cards.** The language model's memory for the song being made (its KV cache) is sized to
  that song instead of the whole context: a two-minute song holds 1.1 GB instead of 2.9 GB. An
  8 GB card is offered the Minimal set, and the Light set names its real quantisations.
- **One page for everything the studio downloads and runs.** Settings - Models lists, besides
  the engine sets, the assistant, stems and karaoke, the training pack, the style-by-ear pack and
  Audio to MIDI with its sizes, each fetched, cancelled and removed there as where it is used. The
  optional parts are closed rows marked optional, and the ready-made sets say that one is enough.
- **What runs where**, on that page and in the README: which part of the studio uses an NVIDIA
  card, an AMD or Intel card, or the processor. The AMD and Intel paths are experimental.
- **AMD and Intel cards.** The writing assistant runs on llama.cpp's Vulkan build, and karaoke's
  Parakeet and the tempo and key models run on the card through DirectML. Stems separate on the
  processor, and training, which needs an NVIDIA card with CUDA, is no longer offered where it
  cannot run.
- **A new playlist from the Create form**: "+ New playlist…" in the playlist choice, which is
  shown even before there is any playlist.
- **The duration is kept** between sessions.
- **"Take as they are" on the train step** too, so songs whose lyrics layout or style no
  assistant wrote can be trained without one.

### Changed

- **"Without stopping" starts by a slide**: pull its knob to the end to switch it on; once on,
  the same place is a bright button that switches it off. A stray click no longer starts it; the
  keyboard does with the right arrow, Enter or Space.
- **The library stays still when a song arrives**: the generation's card becomes the song in its
  own row, songs being made stay on top, and the row keeps its height.
- **Progress comes from the engine** as it works, pushed to the window, and a song is streamed
  with byte ranges, so it starts and seeks at once.

### Fixed

- **A model chosen for one song** is the one it is made with: a single changed role was dropped
  and the song made on the profile's set.
- **Quantisations are named by their type** in the model choice: Q4_K_S, MXFP4 and NVFP4 instead
  of their ids (lm-q4-s).
- **Play on a song that has just finished** while other songs are still being made.
- **The trainer on any processor**: the training pack carries every processor build of ggml
  beside CUDA, so the trainer and the captioner start without AVX2 or an NVIDIA card instead of
  "no backend available". An installed studio downloads the new trainer once and no longer calls
  an older one with options it does not know ("unknown option --loudness-lufs").
- **Style by ear without the training pack**: the captioner carries its own libraries, so
  describing a song by ear works on a machine that never downloaded the trainer - an AMD or Intel
  one included - on the processor there.
- **Tags and lyric files in a legacy code page** - Chinese GBK, Windows-1251 and others - are
  read as Windows reads them instead of as mojibake.
- **Settings and panels on Windows 7 and 8.1** (WebView2 before 111) are no longer transparent.
- **The prompt assistant starts from what you wrote** - the global metadata, the vocal details
  and the arrangement - and keeps it.
- **The assistant cannot loop inside a title**: short fields have a length limit, so a local
  model no longer runs to its token limit.
- Separation, karaoke timing and the tempo and key on an AMD card no longer try CUDA.

## 2026-09-29 — 3.1.0

### Added

- **LoRA for ComfyUI.** A trained LoRA is saved as one file for ComfyUI's native MiniMax Music 3:
  the language model's LoRA with its alpha inside, loaded with the stock LoRA loader on the CLIP.
  On the LoRA page and as `lora_export_comfyui` for agents.
- **The studio from another computer** (Settings - Appearance - Access from the network, off by
  default). The service listens on the network and hands a browser the studio itself; the access
  key is shown in the settings and asked once. A tunnel or proxy on the same computer needs the
  key too.
- **The card to compute on.** With two or more NVIDIA cards, Settings - Engine picks the one the
  engine, the trainer and the assistant run on.
- **Stop after this track**, a fourth position of the repeat button.
- **Player buttons in the sidebar** can be hidden: Winamp, equalizer, visualiser.
- **Without stopping and bigger queues.** The Create form takes more than ten songs at once, and
  "Without stopping" keeps making songs from the form as it was when turned on. New songs can go
  straight into a playlist, the cloud ones too.
- **Stems of any library track**, imported ones included, from the song's panel.
- **A key for your own assistant server** (Settings - Assistant).
- **A switch for the stock photo** of a track without a cover (Settings - Cover art), on by
  default as before; off, the track shows its drawn pattern and nothing is fetched.
- **MiniMax Music 3 Turbo in the LoRA catalogue**: guillaume127's distilled 8-step LoRA for the
  sound half.
- AIFF and Apple Lossless (ALAC) files are read wherever audio is taken.

### Fixed

- **The library keeps up**: stems, processed versions, a song an agent made and a song
  deleted in another window show up at once, without reopening the page.
- **Cancel all stops everything**: the song still on its way to the engine too, and "Without
  stopping" switches off instead of starting the next one.
- Stem separation starts on Auto: the card when its runtime is installed, the processor
  otherwise, instead of showing the card chosen and quietly running on the processor.
- A playlist names each song's artist as the player does.
- **Preparation without an assistant** no longer fails every song: it says an assistant lays out
  the lyrics, with "Set up the assistant" and "Take as they are".
- **The writing wand** explains why it opens the assistant settings: music models do not write
  lyrics, and the built-in assistant is one button away.
- **A song lost to an engine restart** says why - out of video memory, a CUDA error - instead of
  a bare "job not found".
- **The assistant on GTX 900 and 10-series cards and older drivers**: llama.cpp's CUDA 12 build
  where CUDA 13 does not run.
- **WebView2 that will not install** stops the installer with a plain message and Microsoft's
  standalone installer link.
- **A slow training run says why**: it shows what it computes on, and warns when that is the
  processor or when the card's memory is full.
- The training card could fail while a run was going; playlist durations showed NaN; a suggested
  cloud model never filled in; a song title and creator answered clicks with an error.
- An assistant answer no longer carries the model's reasoning into a style or lyrics.
- Engine calls ride out a dropped local connection instead of failing the song.
- MOSS-Music describes the whole track, not its intro.

### Updated

- The minimaxmusic.cpp engine with upstream's ggml and its DiT padding fix, llama.cpp b11236, the
  HOT-Step trainer at 3e7a0778.
- Tauri 2.12, React 19.3, Vite 8, Tailwind 4, TypeScript 7, vitest 5, lucide 1; Rust crates on
  their current majors (reqwest 0.13, symphonia 0.6, rusqlite 0.40, sysinfo 0.39, tower-http 0.7,
  zip 8, ort 2.0.0-rc.13).

## 2026-09-26 — 3.0.0

### Added

- **An equalizer.** Ten bands on Winamp's frequencies, -12 to +12 dB, and a preamp, with the
  curve the filters really play drawn above the sliders. The band gains are solved as Spotifast
  does, so neighbouring bands no longer pile up and a preset sounds as its sliders show. Winamp's
  eighteen presets, presets for situations (Bass Booster, Vocal Booster, Small Speakers, Night
  Listening...), the user's own, and Winamp's .EQF files in and out. Balance and mono work with
  the equalizer off too.
- **A visualiser.** MilkDrop through Butterchurn with several hundred presets, or a spectrum
  analyser in ten looks from Winamp bars to a radial one. It floats over the studio and is sized
  by its corner, goes fullscreen, or moves into a window of its own that hears the studio live.
  Next and previous, hold a preset, random or in order, as MilkDrop's keys N, P, L, R, T and F.
- **A Winamp mode.** The whole window becomes a classic Winamp 2 player: main window, equalizer,
  playlist and MilkDrop, skinned. Its windows move apart and dock as Winamp's did, the playlist
  and MilkDrop resize, and a click between them goes to whatever lies below. Winamp's own base
  skin comes with the studio, and ten more (the Classified trio and Webamp's own favourites);
  every skin is drawn sharp at any scale, resampled once to the screen's pixels. The Winamp Skin
  Museum is one button away, and a .wsz is added with a click or dropped on the player. Scale
  from 100 to 300 %, always on top, random skin, and a
  "don't ask" that starts it at once from the player bar or the sidebar. The song, its place,
  the volume and the equalizer go over to Winamp and come back to the studio; Ctrl+M switches.
- **All of it for agents.** equalizer_*, visualizer_*, winamp_* tools; library_songs_list takes
  since/until (today, yesterday, a date), library_liked and library_song_like give the user's
  best, player_play plays a list of songs as the queue, ui_press_key takes shortcuts, and
  ui_screenshot now shows MilkDrop.
- **Save as, and a Files panel.** Songs, stems, MIDI, lyric sheets, scores, requests and videos
  are saved where the user says, in Windows' own Save dialog, which starts in the folder chosen
  last - before, the browser dropped them in Downloads without a word. Each save shows in a Files
  panel, from Dub Studio: a chip in the sidebar, or a panel dragged anywhere, with its progress
  while it is written and "Show in folder" once it is.
- **A proxy for the whole studio** (Settings - Providers - Proxy): as Windows is set, the
  user's own, or none. HTTP, HTTPS, SOCKS5 and SOCKS4, with a login, written in any usual form -
  `host:port`, `host:port:login:password`, `login:password@host:port` or
  `socks5://login:password@host:port`; SOCKS5 resolves site names on the proxy. Model downloads,
  Hugging Face, OpenRouter, lyrics lookups and updates go through it and take a change at once;
  the window's own image and video search takes it at the next start. "Check" tries Hugging Face
  and OpenRouter through the proxy on the form before it is saved and says why one fails.

### Fixed

- **A news item without tags no longer blanks the window**, and **a Hugging Face error on the
  LoRA page stays in its own tab** and clears on the next attempt instead of hanging over the
  page until a restart. The repository pins the MSVC Rust toolchain, so a machine whose rustup
  defaults to GNU builds too, and the changelog script builds from a source archive with no git
  history. Thanks to @Astemiir for all four.
- **Checked in four review rounds.** Leaving Winamp always gives the window its frame and size
  back, also after a reload; floating panels keep their place through a small window; training a
  run further no longer races an install; an unreadable saved proxy is said in Settings; a failed
  save leaves no half file; the local assistant's model list says why it is empty.
- **The writing wands are always there.** With no assistant set up they were hidden, and nothing
  said the studio could write a style or lyrics at all; now they open the assistant's settings.
- **The engine is found behind a proxy.** A proxy set in HTTP_PROXY or ALL_PROXY took the
  studio's requests to its own engine on 127.0.0.1 as well, and the window waited on "Loading the
  models into memory" for good. The studio's own traffic, and the local network's, now always goes
  straight.
- **The Library page scrolls.** Everything below the first screen of it was cut off.
- **The Instrumental switch works.** It sent the engine empty lyrics, which the engine refuses,
  and the form asked for lyrics before it would even send: with the switch on, nothing could be
  made (issue #4). An instrumental now goes out as the song's structure with no words under
  its tags - the tags of the lyrics in the box, or a plain song shape.
- **The writing assistant stops.** With Ollama the magic wand could not be stopped: the
  studio named no length, Ollama generates without end when none is named, and a small model
  that never closed the style string listed words until the app was restarted. Stop also left
  the model writing, because the service went on reading an answer nobody waited for. A local
  server is now told how long each answer may be, a run that reaches it ends with a message
  instead of a wait, and Stop closes the connection, which is what makes the model stop.
  Stop is also there while the caption or the lyrics are written, not only the whole song.
- **A local server's address saves as soon as it is typed.** The window asked every half-typed
  address for its models, one request per keystroke, each waiting out its timeout, and the save
  queued behind them for seconds: the wand could say no assistant was set up. The models are
  asked for once the address stops changing.
- **A local server's context is checked before the assistant writes.** The writing
  instructions take about 7,000 tokens, and LM Studio loads a model with 8,192 by default,
  Ollama with less: LM Studio cut the answer in seconds, and Ollama silently dropped the start
  of the instructions, so the model wrote with none and ran on. The studio now reads the
  context LM Studio or Ollama runs the model with and, when it is too short, says so at once
  with where to raise it; an answer cut short says whether the context or the length ran out.
- **Cyrillic letters in the assistant's answer** no longer turn into `�`: a letter split
  between two pieces of the stream was decoded piece by piece.
- **A song added to a dataset brings its lyrics** from its own tags (ID3 USLT, Vorbis
  LYRICS) when no text file lies beside it.

## 2026-09-26 — 2.1.2

### Fixed

- **Songs and LoRA an agent makes appear in the window at once.** A song an agent started
  over MCP only showed after a reload, and so did a LoRA it installed: the service now tells
  the window when an agent changes something, and the window reads its songs, jobs, LoRA and
  settings again. Songs the window sends itself are told apart by a mark on the request.
- **Deleting a song removes its files.** The song left the library but its audio, stems and
  cover stayed on disk: the paths were compared as written, and one side was written with
  `\\?\`.
- **Titles for songs without one.** A prose description is named after what it describes,
  and a LoRA's trigger word is never the title.
- **Song counts** take the form each language asks for: 2 песни, 13 песен, 21 песня.
- **A model download** counts only what comes down, not the files of the set already on disk.
- **A model downloaded after the engine started** is found without restarting the studio, and
  **Find models and LoRA again** (Settings, Models, and the LoRA page) does the same for files
  put in the folders by hand. The engine restarts once the songs on it are done.
- **An update installs over the studio it came from.** Started from the studio, the update
  installer did not find the install folder and put a second copy into its default one, or
  died with the studio before it began. It is given the folder and let go of now, as in
  YuE2 Studio.
- **An installed studio keeps its temporary files and its WebView2 profile beside itself**,
  like its models and library, instead of on the system drive.

## 2026-09-25 — 2.1.1

### Fixed

- **Create video everywhere.** The song menu of the Library page, of the song details and of
  the player had no Create video (nor Re-render, Reuse prompt or Delete in some of them): each
  place built its own menu. There is one song menu now, the same wherever it opens, and Create
  video is also a button on every track row and in the song details.
- **A menu near the bottom of a panel** opens upward, or the panel scrolls it into view,
  instead of hiding its last items under the edge.

## 2026-09-25 — 2.1.0

### Added

- **Train further.** A finished run that is not there yet goes on from where it stopped:
  set the steps to reach and press **Train further** on the run. The same recipe and songs,
  the optimizer as it was; the loss chart and the checkpoints continue instead of starting
  over. Runs trained with the LoRA method only - the trainer keeps no state for PiSSA and
  HOT-PiZZA to go on from, and the run card says so. MCP: `training_continue`.
- **Section tags for your own lyrics.** The tag button beside the lyrics lays them out in
  [verse], [chorus], [bridge]... without changing a word: the assistant only says where each
  section starts, and the lines go under the tags as written. MCP: `assistant_sections`.

### Fixed

- **Renaming a track.** The pencil in the song details and the title in the library did
  nothing for most tracks: songs of the local library carried no owner, so the studio took
  them for someone else's. Every track can be renamed from both places now, and the library
  row shows a pencil on hover.
- **Models kept in several folders.** **Use models I already have** looked only at the top
  of the folder you pick; it now searches its subfolders too (hidden ones aside), off the
  window's thread.
- **Wider side panels.** The create panel and the song details stretch up to 1200 px on a
  wide screen, never past 40% of the window; a double click on the edge puts the default
  width back, and the arrow keys move the focused edge.

## 2026-09-25 — 2.0.0

### Added

- **Any track to MIDI.** A song, a stem or a processed take becomes multi-instrument MIDI -
  34 instrument groups and drums, each on its own channel - with MuScriptor (Kyutai & Mirelo)
  on the GPU through HOT-Step's native port. It is on the tools page and in every track's
  menu (**To MIDI**); a piano roll fills in while it listens, the MIDI plays against the
  original with a crossfade and per-instrument mute and solo, and the .mid is kept beside the
  track and saved from there. Nothing is installed up front: the transcriber (126 MB) and the
  chosen model - small 0.4 GB, medium 1.2 GB, large 5.5 GB - download the first time, or
  ahead from the tools page. The weights come from an open mirror of the official files, so
  no Hugging Face sign-in is needed; they are CC BY-NC 4.0, for non-commercial use. MCP:
  `midi_transcribe`, `midi_get`, `midi_status`, `midi_install`, `midi_remove`,
  `midi_delete`, `midi_cancel`, and `studio_wait until: midi`.
- **Tracks made by tools are tracks of the library.** Stems, a kept processing and a re-render
  are new tracks linked to the one they were made from: the list says **Made from «...»**
  with the tool, the click opens the original, and the track keeps the tool's settings.
  Splitting a song again replaces its stems instead of adding more.
- **An MCP server in the studio.** `http://127.0.0.1:8765/mcp` gives an agent 159 tools: every
  route of the studio's API, called inside the process, and the window itself - a
  screenshot, its controls, the player and the video editor - through a bridge the page
  answers. Files are passed by their path; MiniMax's caption rules and reference captions
  are tools, resources and prompts, so a connected agent writes instead of the studio's
  small assistant. `docs/mcp-skill.md` is the skill an agent reads.
- **The agent as the studio's assistant.** Pick **Agent (MCP)** as the writing assistant and
  the write buttons and a dataset preparation ask the connected agent what they would ask
  the local model, with the same instructions and answer schema. Settings has an **Agent
  (MCP)** page: whether an agent and the window are connected, the address and the lines to
  paste into Claude Code or any other client.
- **MCP 2026-07-28.** The server speaks the stateless revision (`server/discover`, per-request
  `_meta`, `Mcp-Method`/`Mcp-Name` headers checked against the body, cacheable lists,
  structured results) and the handshake revisions for older clients, and answers only this
  computer's agents and its own window. An agent reads and fills the create page's form,
  sees every control of the window with its label and the song it belongs to, shows the user
  a message and reads the window's console. `llms.txt` and the README tell an agent given
  the repository how to install, connect and start.
- **A dataset in one drop.** The training page is a three-step wizard: drop a folder of
  songs, check them, train. Albums with a cue sheet are cut into songs; titles and artists
  come from the tags, the file name and the folders.
- **Lyrics from the databases players use.** LRCLIB, then QQ Music, then Kugou, matched by
  title, artist and length, kept word for word. Only a song none of them knows has its
  vocals separated and is heard by Whisper, which is told the language the found lyrics are
  in and has its usual hallucinations (subtitle credits, captions of sounds, 674 known
  phrases in 11 languages) filtered out.
- **Sections without touching the words.** For a published sheet the assistant only says
  where each section starts; the studio puts the sheet's own lines under the tags, so no
  line can be lost or merged. Lines sung more than once are marked so the chorus stands out.
- **Every song shows where it is.** Lyrics and descriptions appear as each song is done,
  with the stage and its count on top. One model is on the card at a time, each loaded once
  for the whole batch.
- **Picks up after a restart.** Each song keeps its lyrics and style state in the dataset,
  and the job itself is kept on disk: after a crash or a restart the preparation carries on
  by itself and redoes nothing. A failed or unfinished song has a button that finishes just
  that song.
- **A trigger word from the start.** Every dataset gets a rare word made from its name
  (`nrmnkhffn` for "Нейромонах Феофан"); a word the user clears stays cleared.
- **README lists every model** the studio downloads — training, listening, lyrics, stems,
  assistant — with its direct link, size and the folder it goes in.
- **Stop by steps or by epochs.** A fixed number of steps, or a number of passes over the
  songs.
- **Describing by ear on the card.** MOSS-Music listens to every song and writes its
  structured caption; tempo and key are measured by Beat This! and S-KEY on the card, loaded
  once.

### Fixed

- **Resampling to 16 kHz is band-limited.** Every reader of 16 kHz audio - Whisper, Parakeet,
  and now MIDI - got the audio through linear interpolation, which folds everything above
  8 kHz back into the band as noise: MuScriptor heard a clean vocal as distorted guitar and
  drums. The studio now filters before it decimates.
- `studio_wait` until idle waited for songs, the preparation and training only; it now waits
  for stems, MIDI, covers, karaoke and processing too, and refuses a `job_id` that names no
  job instead of saying "still running" forever.
- A LoRA passed to `song_create` without strengths ran at zero on every slot; it now starts
  where the create page starts it - its own strengths, else full on every slot it touches.
- A song's delete names the files it could not remove (a player holding one) instead of
  only logging them. MCP names the studio's own version.
- `video_set` and `create_form_set` refuse a field or a value the window does not have
  (`aspectRatio`, not `aspect_ratio`), instead of saying "Set" and changing nothing.
- A kept processing is named by its label; a render started by an agent can no longer leave
  the next manual export going to the studio's folder.
- The assistant's JSON schema reached llama-server in a field it does not read, so local
  answers were never held to it; it now goes where llama-server reads it.
- The engine watcher no longer starts the music engine, and with it unloads the assistant,
  while a preparation or a training run holds the card.
- A song deleted during a preparation fails alone instead of stopping the job.
- A title that starts with a number keeps it ("99 Luftballons").

## 2026-09-24 — 1.6.2

### Fixed

- **Runs on every NVIDIA card from the GTX 900 series on.** For some cards the engine carried
  only PTX, which a driver older than CUDA 13 cannot compile, and the first song failed with
  "PTX was compiled with an unsupported toolchain". The studio now ships two CUDA builds of
  the engine with compiled code for every architecture, and picks the one the card and its
  driver run: CUDA 13 for Turing and newer (GTX 16, RTX 20–50, Tesla T4, A100, RTX A-series,
  L4/L40, H100) with driver 580 or newer; CUDA 12 for Maxwell, Pascal and Volta (GTX 900/1000,
  Titan X/Xp/V, Tesla M40, P40, P100, V100) and for any card on a driver from 525 to 579. The
  cuBLAS of that build is downloaded once, as before.
- **Cards before Ampere** get the engine's FP16 clamp on their own: their tensor cores
  accumulate in FP16, which can overflow into silence.

### Engine

- minimaxmusic.cpp 120a4f6: backends load at run time and the studio names the CUDA build.
  The audio is the same to the byte.

## 2026-09-24 — 1.6.1

### Fixed

- **The create page keeps what was typed in it.** Leaving it for the library, search or any
  other page reset it to the defaults: the style, the lyrics, the score and every setting
  were lost. The page now stays as it was left
  ([#1](https://github.com/timoncool/YuE2-Studio/issues/1)).
- **Songs play after the studio's folder moves.** The library kept each song's full path,
  so a drive that came back under another letter after a restart, or a portable folder
  copied elsewhere, left every song saying it was no longer available while the files
  sat in the media folder. Songs are now found by name in the studio's own media folder.
- **Errors say why.** Stem separation, karaoke and cover art showed only the first line
  of a failure ("load the separation model ..."), without its cause; the whole reason is
  shown now. When the graphics card cannot load the separation model, the message says
  to choose the processor instead.

### Added

- **Select everything in the LoRA catalogue** that is not downloaded yet, in one click,
  and download it as one set.

## 2026-09-24 — 1.6.0

### Added

- **LoRA.** A LoRA page with the installed files, a catalogue of ready sliders by ntc-ai
  and a search on Hugging Face that downloads what you pick. In the create form each LoRA
  gets its own strength for the language model (the composition) and for the DiT (the
  sound), and its trigger word goes into the caption for you. The engine merges LoRA and
  LoKr into either half at load and reads PEFT, LyCORIS, diffusers and ComfyUI files
  (minimaxmusic.cpp fork `adapters`, 12534e3), with the rsLoRA scale honoured.
- **Training your own LoRA.** An optional tab on the LoRA page. 5–20 songs of one artist
  or style become a language-model LoRA on your card with HOT-Step's `mm3-lm-train` and
  its HOT-PiZZA recipe: rank 128, AdamW at 8e-5 with warm-up, a 1536-frame window that
  fits a 24 GB card, the depth decoder's acoustic loss, a checkpoint every 100 steps.
  Every setting is editable under Advanced, with the defaults one click away. The
  assistant writes each song's caption by ear, in MiniMax's own structure, and each
  checkpoint goes into the LoRA library in one click. The trainer and its weights (about
  10.5 GB) download only when you open training; it needs an RTX 30-series card or newer
  with 22 GB of VRAM.
- **Datasets travel between studios.** A dataset is a folder with `dataset.json` and its
  audio; import one from YuE2 Studio or show the folder to take it there.
- **Audio processing.** Noise reduction, the Spectral Lifter, a vocal naturaliser, your own
  VST3 plugins in a chain, and mastering to a reference track, from a track's menu or the
  Tools page. Plugins are found in the system VST3 folders, each is set up in its own
  window, and they run in a host process of their own, so a plugin that crashes does not
  take the studio with it. Compare before and after while it plays; keep the result as a
  version of the track, next to the untouched original, or throw it away.

### Changed

- **MP3 is made by the studio.** The engine renders 32-bit float and the studio encodes
  the MP3 with LAME at 320 kbps, so nothing is lost before the encoder.
- **Fewer DiT steps keep their detail.** Below 30 steps the engine raises the flow shift
  by itself, to `29/(steps-1)`.

### Fixed

- **The Light and Minimal model sets make songs.** Their lighter files come from a second
  community set written in llama.cpp's naming, with the DiT's q, k and v in one matrix, and
  the engine read only the original naming: it stopped on the first tensor, and the
  language model of those sets was not even recognised. The engine now reads both layouts
  as the same weights; a render on the Light DiT matches the Q8_0 one to 0.985.
- **Clearing the create form, resetting its parameters and opening a saved prompt work
  again.** Each of them stopped the form on a setting that had been removed.
- **Broken engine output is no longer saved as silence.** A NaN in the rendered audio
  became the peak the MP3 was normalised to and turned the whole track silent; the song
  now fails with a message saying so.

## 2026-09-24 — 1.5.2

### Changed

- **The engine follows minimaxmusic.cpp up to 448e880.** It draws the initial noise the way
  the reference does, keeps the float fields of a request exact, fixes a Vulkan read of
  the batch stride, stops with a clear error when its port is already taken, and brings
  ggml up to date.
- **Newer runtimes for the add-ons.** The assistant downloads llama.cpp b11146 (CUDA 13.4)
  instead of b9966, and karaoke downloads ONNX Runtime 1.30.0 instead of 1.24.2. Add-ons
  already installed keep working on the versions they have.
- **A new studio in the family.** The news page announces YuE2 Studio, which grew out of
  this one, with links to it and to ACE-Step Studio.

### Fixed

- **The audio editor's waveform library is now in the repository.** The folder was ignored
  by git, so a clean checkout built an editor that opened blank; released builds were not
  affected. A test now checks that every file the editor loads is built in.

## 2026-08-19 — 1.4.0

### Added

- **The studio can read audio, not only write it.** MiniMax published Music 3
  without the encoder that turns audio into the codes the model generates, so a
  finished track could never be handed back to it. The encoder was reconstructed
  by the community; it is exported to ONNX and published as
  [nerualdreming/open-rvq-encoder-minimax-music3-169m-v4-onnx](https://huggingface.co/nerualdreming/open-rvq-encoder-minimax-music3-169m-v4-onnx),
  verified against the PyTorch reference with every code identical. The path
  runs on parts already here: `neural-codec` from the engine turns audio into
  VAE latents, ONNX Runtime turns those into codes, and the engine renders from
  them. What that gives today is a re-render of a whole track through the model.
  Continuing past the end and repainting one section need the engine to accept
  codes as a prefix or a masked span, and its replay path takes neither.
- **Lighter quantisations for every role**, from a second community set: the
  language model down to Q4_K_M, Q4_K_S and Q3_K_M, the DiT to Q4_K_S and
  Q3_K_M, the depth decoder to Q4/Q5/Q6, plus MXFP4 and NVFP4 for all three -
  ggml declares both types and the CUDA backend carries kernels for them.
- **A Minimal profile** at about 6.4 GB, for 8 GB cards that were previously
  told to use the cloud, and Light drops from 8.8 GB to 7.7 GB.
- **Models you already have can be adopted** instead of downloaded again:
  a folder picker matches files by name, then by exact size, and hard-links
  them into place.
- **Six Whisper models and both Parakeet precisions**, matching Dub Studio's
  line-up, with the Gemma quantisations alongside them.

## 2026-08-19 — 1.3.5

### Fixed

- **An instrumental was sung.** The lyrics box keeps what was in it, so the
  words of the previous track went to the engine even with the instrumental
  switch on. An instrumental now submits no lyrics at all.

- **A clean installation never started.** The engine was launched once, at
  startup, and only if a complete set of weights was already on disk - so a
  first install downloaded its models, nothing started them, and the window
  waited on "loading the models into memory" until the studio was restarted by
  hand. The supervisor now watches: whenever the weights are there and nothing
  answers on the engine port, it brings the engine up. The same gap swallowed a
  crashed engine.
- **A 24 GB card was recommended a 26.6 GB set.** The tiers were round numbers;
  they are now the sets' own weights, so a 4090 is pointed at Quality Q8 and
  the full native set is only recommended from 30 GB.

### Changed

- **Six Whisper models instead of two** — tiny, base, small, medium, large-v3
  and large-v3-turbo, the same line-up Dub Studio offers.
- **The OpenRouter key and a self-hosted server address are typed where they
  are needed**, in the group that uses them, rather than on another page.
- **Every local engine is now a choice, not a list of files.** Karaoke offers
  Parakeet, Whisper or OpenRouter and what to run it on, and one button
  installs or removes the whole set - a runtime and five model files are one
  recogniser, not six decisions. The card is the default.
- Every model row states the same things in the same order - what it is, what
  it weighs, whether it is installed, which variant - with download and remove
  beside it, the way Dub Studio states it.
- The controls are shared components now. The settings panels had each drawn
  their own tabs, inputs and buttons, so the same decision looked like a
  different control depending on the page.
- A partial settings request no longer replaces the whole assistant
  configuration: sending a provider used to blank the model, the path and the
  reasoning effort.

## 2026-08-19 — 1.3.4

### Fixed

- **An installed studio kept its models on the system drive.** Portability was
  decided by a `portable.flag` file that only the portable archive ever
  contained, so installing into `F:\AI` still put twenty-five gigabytes of
  weights, the library and the media into `%LOCALAPPDATA%`. The studio now
  keeps its data beside its own executable whenever it can actually write
  there - it tries, rather than reasoning about permissions - and falls back to
  the profile only for a read-only location such as Program Files.
- **The engine started before its libraries had finished downloading.**
  Fetching cuBLAS only queued the download and returned at once, so the engine
  was launched into a folder that did not have it yet and failed exactly as if
  nothing had been fetched. The install now waits, and reports the failure if
  the files do not arrive.
- Automatic cover art was on by default, which does nothing without an
  OpenRouter key and costs money with one. It is off until switched on.
- The OpenRouter catalogue was requested every time the providers page opened,
  with or without a key, so people without one watched a spinner and then read
  an error they could do nothing about. It is only fetched once a key is saved.

## 2026-08-19 — 1.3.3

### Fixed

- **The installed executable had a different name from the portable one.** The
  installer wrote `minimax-music3-studio-desktop.exe`, after the Rust crate,
  while the portable build named the same binary `MiniMax-Music3-Studio.exe`:
  one studio under two names depending on how it arrived. Both are now
  `MiniMax-Music3-Studio.exe`, and the installer deletes the old name so an
  updated folder is not left with a dead 52 MB copy and a shortcut pointing at
  whichever was clicked first.

## 2026-08-19 — 1.3.2

### Fixed

- **The engine could not start on a machine without the CUDA Toolkit.**
  `mm-server.exe` loads `ggml.dll`, which loads `ggml-cuda.dll`, which imports
  `cublas64_13.dll` and through it `cublasLt64_13.dll` — all static imports,
  resolved by Windows before the engine's own code runs. Neither library was
  shipped, so the process died in the loader with "cublas64_13.dll was not
  found" and no fallback to the processor was possible. The studio now installs
  them itself, from NVIDIA's own redistributable archive, beside the engine
  binary where the loader looks first. A machine that already has them — a CUDA
  Toolkit on PATH — downloads nothing.
- **The Visual C++ runtime was missing the same way.** The engine and ggml
  import `MSVCP140.dll`, `VCRUNTIME140.dll`, `VCRUNTIME140_1.dll` and
  `VCOMP140.DLL`. When they are absent the studio downloads Microsoft's own
  redistributable and runs it, once, and only then.
- **The download buttons for the optional CUDA libraries did nothing.** The
  endpoint started the download inside a task that threw away its own result,
  then answered "started" regardless - so a refusal ("another download is
  already running") vanished into a successful reply, and no interface could
  have reported it. The refusal now reaches the caller, and the interface reads
  the reply instead of discarding it.
- All five interface languages declared `karaokeOff` twice, and the second
  silently replaced the first.
- **The writing assistant kept the graphics card after it had answered.** Gemma
  holds around five gigabytes; the engine then asked for eleven more and died
  on a 24 GB card, and the studio reported a queued job that never ran. The
  assistant is now unloaded as soon as it answers, and again before the engine
  starts — unless "keep models in VRAM between jobs" is on, which is exactly
  what that setting is for. It starts itself again on the next request.
- **A crashed engine is restarted instead of ending the request.** A job that
  found no engine used to come back as "mm-server is unavailable"; the
  supervisor now brings it back and sends the job again.
- **Running out of video memory says so.** The engine's own log is read when a
  job cannot be submitted, and a card that ran out of room is reported as
  that — instead of "download the five components", which pointed at models
  already on disk.

### Added

- The starting screen reports the library download with real percentages and
  gigabytes, and the "this is taking too long" warning no longer fires while
  half a gigabyte is on its way.
- A release now checks itself: a test walks the import tables of the built
  engine bundle and fails if it names a library that is neither beside it nor
  installed on first start. It found the Visual C++ runtime immediately.

### Changed

- The studio opens in its dark theme unless the user has chosen otherwise.
- The CUDA build carries PTX for the newest architecture as well, so a
  Blackwell variant without its own device code has something to compile from
  instead of failing at the first kernel launch — NVIDIA's own "Building for
  Maximum Compatibility" rule. ggml rewrites the flag to `120a-virtual`,
  because its Blackwell kernels use instructions that exist only there, so this
  does not reach past Blackwell.

## 2026-08-19 — 1.3.1

### Added

- **A portable copy keeps everything inside its own folder** — models, the
  library, media, logs, settings, temporary files and the WebView cache all sit
  beside the executable. Nothing is written into the user profile, so deleting
  the folder deletes the studio.
- **Downloads can be undone** — every ready-made set, every per-role
  quantisation and every optional model has a remove button beside the one that
  fetched it, and the panel shows the folder they live in with a button that
  opens it.
- **A local model fetches itself on first use** — choosing Parakeet or Whisper
  is the instruction to use it, so the first track that needs timings downloads
  the model, reporting real percentages, and then does the work.

### Changed

- The engine now dies with the studio however the studio ends — a job object
  ties the process tree together, so a force-closed window no longer leaves the
  engine holding the graphics card.
- The local writing assistant is constrained by a JSON schema at the sampling
  level, and its context doubled to 16384 tokens. It could previously answer
  with prose, with a fenced block, with a list where a string belonged, or run
  out of room mid-answer.
- Lyrics are written in the language of the request. The rule that keeps the
  caption English - the engine reads it - had been swallowing the song too.
- Cover art and cloud transcription stay silent without a key instead of
  reporting a failure nobody can act on.

### Fixed

- A settings page that changed one capability erased every other choice, which
  is how a studio with a downloaded engine started answering "the local music
  engine is not configured" and queueing jobs forever.
- The download panel sent `component_ids` while the service read `ids`, so
  pressing download on the 11.9 GB set fetched the 26.6 GB one. An empty
  request is now refused outright rather than falling back to a default.
- Removing weights left the download that would resume them in the studio's
  state, so deleted files came back by themselves on the next start.
- A job that names weights no longer on disk is refused with an explanation
  instead of being sent to the engine, which spent a minute loading nothing.
- The window recovers on its own when the service takes a moment longer to
  start, instead of leaving a browser connection error on screen for good.

## 2026-08-18

### Added

- **Stem separation** — a finished track is split into six tracks (drums, bass, other,
  vocals, guitar, piano) by HT-Demucs through ONNX Runtime. Runtime is chosen the same way
  as everywhere else: automatic, GPU or CPU. The model sits among the optional downloads
  and is fetched only on request. Controls live in Studio tools; the track menu opens a
  song there already selected.
- **Automatic cover art** — a cover is drawn as soon as a track finishes, if the switch is
  on, using the prompt the writing assistant produced along with the title and the length.
- **Cover prompt templates** with `{title}`, `{style}`, `{lyrics}`, `{excerpt}` and
  `{duration}`, and a default template that can be set in Settings.
- **ID3v2.4 tags on exported MP3s** — title, artist, album, genre, tempo, lyrics and the
  cover image.
- **A running account of background work** — covers and karaoke timings report themselves
  while they happen instead of finishing in silence, and the library rereads a track as
  soon as its work is done.

### Changed

- Covers are requested as a square 1024×1024. Image models answered in their own habit
  before, and a 1408×768 frame was cropped to a strip in every card.
- The image format is read from the picture's own bytes rather than from what was declared
  about it, and that type is what reaches the file name, the HTTP response and the tag
  inside the MP3.
- Track titles follow ACE-Step Studio's rule — a chorus line, then any sung line, then the
  description — and the description branch now names the genre instead of the caption's
  heading and measurements.
- Tracks are signed **MiniMax Music 3**, the same name that goes into the artist tag. The
  fork's web-era "Anonymous" is gone.
- Karaoke is refused for an instrumental before any recogniser is involved, on both the
  local and the cloud path, and the button is not offered for a track with no words. The
  failures now say what happened in the language of the interface.
- The writing assistant chooses the length of a track when the request does not, up to 360
  seconds, and fields the user filled in are handed to the model to build around.

### Fixed

- The MiniMax `music-caption-rewriter` skill reached neither the local nor the cloud model:
  the reference captions were selected and then never added to the prompt.
- Genre never made it into the tag, because only the caption's first phrase was examined
  and that phrase is always the heading.
- Downloads no longer re-request a package that finished but was not published, and an
  interrupted file is published atomically so a half-written DLL is never taken for an
  installed one.

## Earlier

The studio grew out of [ACE-Step Studio](https://github.com/timoncool/ACE-Step-Studio) and
was rebuilt around MiniMax Music3: a native Rust service inside a Tauri window, supervising
`minimaxmusic.cpp` — no Python and no Node.js in the shipped runtime.
