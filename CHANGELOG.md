# Changelog

What changed, newest first. Dates are release dates; the studio is versioned by its
Windows build.

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
