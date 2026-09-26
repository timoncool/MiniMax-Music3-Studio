// The project page's text in every language. docs/*.html are built from it by scripts/build-pages.mjs.
export const ORDER = ["en","ru","zh","ja","ko"];

// The model sets the studio offers, by the video memory they need.
export const SETS = [
  {
    "vram": "30 GB+",
    "size": "28.6 GB",
    "key": "setNative"
  },
  {
    "vram": "15 GB+",
    "size": "12.8 GB",
    "key": "setQuality"
  },
  {
    "vram": "11.5 GB+",
    "size": "9.8 GB",
    "key": "setBalanced"
  },
  {
    "vram": "9.5 GB+",
    "size": "7.7 GB",
    "key": "setLight"
  },
  {
    "vram": "8 GB",
    "size": "6.5 GB",
    "key": "setMinimal"
  }
];

// No listening samples on this page yet.
export const SAMPLES = [];

export const STRINGS = {
  "en": {
    "shotsTitle": "Screenshots",
    "shotsSub": "The studio itself, in your language.",
    "shots": [
      [
        "01-create",
        "Writing a track: the caption as a document with sections, the lyrics, and every generation parameter on a slider."
      ],
      [
        "02-player",
        "A finished track: cover, timed lyrics, the request that produced it, and the player."
      ],
      [
        "03-tools",
        "Studio tools: six-stem separation on the GPU, transcription and the wave editor."
      ],
      [
        "04-models",
        "Model sets: one quantisation per role, what is already on disk, and switching between installed sets."
      ],
      [
        "05-providers",
        "Every capability runs where you say - locally or through OpenRouter, with the model named."
      ],
      [
        "06-cover",
        "Cover art: a large preview, prompt templates filled in from the track, or a file of your own."
      ],
      [
        "07-lora",
        "The LoRA catalogue: styles, artists and sound, each credited to its author, downloaded in one pass."
      ],
      [
        "08-dataset",
        "A dataset: the lyrics found for every song, the caption written by ear with the tempo and key measured."
      ],
      [
        "09-training",
        "Your own LoRA trained on the card: the loss as it learns, a checkpoint every 100 steps, one click into the library."
      ],
      [
        "10-midi",
        "Any track to MIDI: a piano roll of every instrument, played against the original, with mute and solo."
      ],
      [
        "11-processing",
        "Audio processing: noise reduction, the Spectral Lifter, a vocal naturaliser, VST3 plugins and mastering to a reference."
      ],
      [
        "12-agent",
        "Connect an agent over MCP: the address and the lines to paste into Claude Code or any other client."
      ],
      [
        "13-derived",
        "Tracks made by tools stay in the library, each linked to the one it was made from."
      ],
      [
        "14-listen",
        "The equalizer with its curve and MilkDrop over the studio, as the song plays."
      ],
      [
        "15-winamp",
        "The whole window as Winamp 2: equalizer, playlist and MilkDrop, skinned."
      ]
    ],
    "label": "English",
    "heroTitle": "Full-length AI music on your own GPU",
    "heroLead": "A Windows desktop studio for MiniMax Music3. Write a caption and lyrics, generate a complete track locally, and keep the audio, the settings and the exact request that produced it in a library on your disk. One executable — no Python, no Node.js, no launcher script.",
    "ctaDownload": "Download for Windows",
    "ctaSource": "Source on GitHub",
    "ctaDonate": "Support the project",
    "ctaNote": "Windows 10/11 x64 and an NVIDIA card, from the GTX 900 series on. The model files are downloaded from inside the studio, when you decide to — nothing downloads on its own.",
    "featuresTitle": "What it does",
    "featuresSub": "Everything below runs on your machine unless you connect a cloud key yourself.",
    "features": [
      [
        "Generate locally",
        "The complete Music3 component set, up to six minutes per track: caption, lyrics, duration, DiT steps, CFG, top-k, separate seeds, several songs per prompt."
      ],
      [
        "Reproduce exactly",
        "Every track stores its request and its audio codes, so it can be re-rendered exactly, or re-rendered with different steps, seed or format."
      ],
      [
        "Word-level karaoke",
        "Enhanced LRC with per-word timings, aligned by Parakeet, Whisper or a cloud model — your lyrics, only the timing is borrowed."
      ],
      [
        "Video export",
        "Karaoke video written with the bundled ffmpeg, hardware-encoded when the machine can, software when it cannot."
      ],
      [
        "A writing assistant",
        "Captions and lyrics from a local GGUF model or from OpenRouter, following MiniMax’s own published prompting skill."
      ],
      [
        "Cover art",
        "Prompt templates with {title}, {style} and {excerpt}, saved once and filled in from the track the cover is for."
      ],
      [
        "Your library",
        "Search, playlists, favourites, import your own audio, export, edit — all in plain files on your disk."
      ],
      [
        "What it costs you",
        "Live GPU load, VRAM, temperature, power draw and engine memory while it generates."
      ],
      [
        "Stems on your GPU",
        "Six tracks - drums, bass, other, vocals, guitar, piano - separated by HT-Demucs on the card, or on the processor when you prefer. The model is an optional download, like everything else."
      ],
      [
        "Files that carry their own data",
        "Exported MP3s hold title, artist, album, genre, tempo, the lyrics and the cover art, so a player shows the track the way the studio does."
      ],
      [
        "LoRA",
        "LoRA and LoKr for the composition or the sound, each with its own strength. A catalogue of ready ones, and a Hugging Face search that downloads what you pick."
      ],
      [
        "Your own LoRA",
        "Songs of one artist or style become a LoRA on your card, with HOT-Step’s trainer and recipe. Every setting is editable, and datasets move between this studio and YuE2 Studio."
      ],
      [
        "A dataset in one drop",
        "Drop a folder: the lyrics come word for word from the databases players use (LRCLIB, QQ Music, Kugou), Whisper hears only what none of them knows, and MOSS-Music listens to every song and writes its caption with the tempo and key measured. Each song shows its progress, and a restart picks the work up where it stopped."
      ],
      [
        "Audio processing",
        "Noise reduction, the Spectral Lifter, a vocal naturaliser, your own VST3 plugins and mastering to a reference. Compare before and after, keep it as a version or throw it away."
      ],
      [
        "Driven by your agent (MCP)",
        "Connect Claude Code, Claude Desktop or Cursor and the agent does everything the studio does: writes and makes songs, fills a dataset and trains, draws covers, cuts clips in the video editor, plays songs - and sees the window and presses its buttons. MiniMax’s own caption rules come with it, so the agent writes the captions and lyrics itself. Pick it as the writing assistant and it writes instead of the local model."
      ],
      [
        "Any track to MIDI",
        "A song, a stem or a processed take becomes multi-instrument MIDI - 34 instrument groups and drums - with MuScriptor on your GPU. A piano roll fills in as it listens; play it against the original, mute or solo an instrument, save the .mid. Downloaded the first time you use it."
      ],
      [
        "Every result is a track",
        "Stems, a processed take, a re-render and a cover land in the library as tracks of their own, each linked to the one it was made from and keeping the settings it was made with."
      ],
      [
        "A player of its own",
        "A ten-band equalizer on Winamp's frequencies with its presets and .EQF files; MilkDrop with hundreds of presets or a spectrum in ten looks; and a Winamp mode whose windows move apart, dock and resize, in the original skin or any from the Winamp Skin Museum."
      ],
      [
        "Save as, and a Files panel",
        "Songs, stems, MIDI, lyric sheets, scores and videos are saved where you say, in Windows' own Save dialog, and the Files panel shows each save."
      ],
      [
        "A proxy for the whole studio",
        "HTTP, HTTPS, SOCKS5 or SOCKS4, with a login: model downloads, Hugging Face, OpenRouter and updates go through it."
      ]
    ],
    "modelsTitle": "Models",
    "modelsSub": "A runnable Music3 installation is always five components: language model, RVQ depth decoder, condition encoder, DiT and vocoder.",
    "modelsGpu": "Your GPU",
    "modelsSize": "Download",
    "modelsNote": "The studio detects your card and preselects the profile it can actually run, but the download is always your decision. Every file is checksum-verified against a pinned Hugging Face revision, and an interrupted download resumes where it stopped.",
    "startTitle": "Getting started",
    "steps": [
      [
        "Install",
        "run the installer or unpack the portable archive."
      ],
      [
        "Choose a set",
        "the first screen preselects what your card can run; press download and it fetches only what is missing."
      ],
      [
        "Write",
        "a caption is the style, the lyrics are optional — an instrumental is one switch."
      ],
      [
        "Generate",
        "the engine starts by itself and the track lands in your library, with its settings attached."
      ],
      [
        "Optional: connect OpenRouter",
        "one key adds the writing assistant, cover art and cloud transcription. Local stays the default."
      ]
    ],
    "archTitle": "How it is built",
    "archSub": "The service is compiled into the desktop binary and supervises the C++ engine. When the application closes, everything it started closes with it.",
    "privacyTitle": "Privacy",
    "privacySub": "The short version: your music is yours, and it stays on your disk.",
    "privacy": [
      [
        "No account",
        "There is nothing to sign up for and nothing to sign in to."
      ],
      [
        "No telemetry",
        "The studio does not report what you generate, or that you generated anything."
      ],
      [
        "Cloud is opt-in",
        "Nothing leaves the machine until you add a key, and then only for the capability you assigned it to."
      ]
    ],
    "authorTitle": "Who made this",
    "authorSub": "Nerual Dreming — artist, founder of ArtGeneration.me and of the Neuro-Cartel community, author of ACE-Step Studio, which this studio grew out of.",
    "footerLicense": "The studio is open source. MiniMax Music3 weights are governed by their own community license — commercial use must display the MiniMax-Music3 name and implement the safeguards that license requires.",
    "footerIssues": "Report an issue",
    "insideTitle": "What runs where",
    "insideSub": "Local by default. A cloud key is added by you, for the capability you choose, and can be taken away again.",
    "insidePart": "Part",
    "insideRuns": "Runs",
    "insideSize": "Size",
    "inside": [
      [
        "MiniMax Music3 engine (minimaxmusic.cpp)",
        "Your GPU, CUDA",
        "bundled"
      ],
      [
        "Music3 model set - five components",
        "Your GPU",
        "6.5-28.6 GB"
      ],
      [
        "Karaoke timings - Parakeet or Whisper",
        "Your machine",
        "optional download"
      ],
      [
        "Stem separation - HT-Demucs, six stems",
        "Your GPU or CPU",
        "136 MB"
      ],
      [
        "Writing assistant",
        "Local GGUF or OpenRouter",
        "your choice"
      ],
      [
        "Cover art",
        "OpenRouter image model",
        "cloud only"
      ],
      [
        "Video export - ffmpeg",
        "Your machine",
        "bundled"
      ],
      [
        "LoRA trainer — HOT-Step ace-train",
        "NVIDIA RTX 30 or newer, 22 GB of VRAM",
        "10.5 GB, optional"
      ],
      [
        "Describing songs by ear — MOSS-Music-8B",
        "about 12 GB of VRAM",
        "10 GB, optional"
      ],
      [
        "VST3 host — HOT-Step",
        "Your machine, a process of its own",
        "bundled"
      ],
      [
        "Audio to MIDI — MuScriptor (HOT-Step ace-midi)",
        "NVIDIA GTX 16 / RTX 20 or newer",
        "0.5–5.6 GB, optional"
      ]
    ],
    "modelsSet": "Profile",
    "setNative": "Full Native — BF16 / BF16 / F32",
    "setQuality": "Q8 Quality",
    "setBalanced": "Balanced — Q6 / Q8 / Q5",
    "setLight": "Light — for speed and low VRAM",
    "setMinimal": "Minimal — Q3, for 8 GB cards",
    "footerChanges": "What changed",
    "title": "MiniMax Music3 Studio — full-length AI music on your own GPU",
    "description": "A Windows desktop studio for MiniMax Music3. One executable, no Python, no launcher: write a caption and lyrics, generate a full track on your own GPU, keep everything in a local library."
  },
  "ru": {
    "shotsTitle": "Скриншоты",
    "shotsSub": "Сама студия — на вашем языке.",
    "shots": [
      [
        "01-create",
        "Написание трека: описание как документ с секциями, текст и каждый параметр генерации ползунком."
      ],
      [
        "02-player",
        "Готовый трек: обложка, тайминги текста, запрос, которым он сделан, и плеер."
      ],
      [
        "03-tools",
        "Инструменты: разделение на шесть стемов на видеокарте, распознавание речи и редактор волны."
      ],
      [
        "04-models",
        "Наборы моделей: по одному кванту на роль, что уже на диске и переключение между установленными."
      ],
      [
        "05-providers",
        "Каждая возможность выполняется там, где скажете, — локально или через OpenRouter, с указанием модели."
      ],
      [
        "06-cover",
        "Обложка: крупный предпросмотр, шаблоны промпта с подстановкой данных трека, своя картинка при желании."
      ],
      [
        "07-lora",
        "Каталог LoRA: стили, артисты и звучание с указанием авторов, скачиваются одним заходом."
      ],
      [
        "08-dataset",
        "Датасет: тексты песен найдены, описание написано на слух, темп и тональность измерены."
      ],
      [
        "09-training",
        "Своя LoRA обучена на видеокарте: ошибка по ходу обучения, чекпоинт каждые 100 шагов, в библиотеку одним кликом."
      ],
      [
        "10-midi",
        "Любой трек в MIDI: пианоролл по инструментам, прослушивание вместе с оригиналом, mute и solo."
      ],
      [
        "11-processing",
        "Обработка звука: шумоподавление, Spectral Lifter, очеловечивание вокала, VST3-плагины и мастеринг по эталону."
      ],
      [
        "12-agent",
        "Подключение агента по MCP: адрес и строки для Claude Code и других клиентов."
      ],
      [
        "13-derived",
        "Треки, сделанные инструментами, лежат в библиотеке со ссылкой на оригинал."
      ],
      [
        "14-listen",
        "Эквалайзер с кривой и MilkDrop поверх студии, пока играет песня."
      ],
      [
        "15-winamp",
        "Всё окно как Winamp 2: эквалайзер, плейлист и MilkDrop в скине."
      ]
    ],
    "label": "Русский",
    "heroTitle": "Полноценные треки нейросетью — на своей видеокарте",
    "heroLead": "Десктопная студия для MiniMax Music3 под Windows. Пишете описание стиля и текст, получаете целый трек локально, а аудио, настройки и точный запрос, который его породил, остаются в библиотеке на вашем диске. Один exe — без Python, без Node.js, без лаунчеров.",
    "ctaDownload": "Скачать для Windows",
    "ctaSource": "Исходники на GitHub",
    "ctaDonate": "Поддержать проект",
    "ctaNote": "Windows 10/11 x64 и видеокарта NVIDIA — GTX 900 и новее. Модели скачиваются из самой студии и только по вашей команде — сама она ничего не тянет.",
    "featuresTitle": "Что умеет",
    "featuresSub": "Всё перечисленное работает на вашей машине, пока вы сами не подключите облачный ключ.",
    "features": [
      [
        "Генерация локально",
        "Полный набор компонентов Music3, до шести минут на трек: описание, текст, длительность, шаги DiT, CFG, top-k, отдельные сиды, несколько песен за раз."
      ],
      [
        "Точное повторение",
        "Каждый трек хранит свой запрос и аудио-коды, поэтому его можно перерендерить один в один — или с другими шагами, сидом и форматом."
      ],
      [
        "Караоке по словам",
        "Enhanced LRC с таймингом на каждое слово: выравнивание через Parakeet, Whisper или облако — текст ваш, из распознавания берётся только время."
      ],
      [
        "Экспорт видео",
        "Караоке-видео собирается встроенным ffmpeg: аппаратное кодирование, если машина умеет, программное — если нет."
      ],
      [
        "Ассистент-автор",
        "Описания и тексты от локальной GGUF-модели или через OpenRouter, по официальному скиллу промптинга от MiniMax."
      ],
      [
        "Обложки",
        "Шаблоны промптов с {title}, {style} и {excerpt}: стиль пишется один раз, данные подставляются из трека."
      ],
      [
        "Библиотека",
        "Поиск, плейлисты, избранное, импорт своего аудио, экспорт, редактор — обычные файлы на вашем диске."
      ],
      [
        "Сколько это стоит железу",
        "Живая нагрузка GPU, VRAM, температура, потребление и память движка прямо во время генерации."
      ],
      [
        "Стемы на вашей видеокарте",
        "Шесть дорожек — ударные, бас, остальное, вокал, гитара, пианино — разбирает HT-Demucs на карте или на процессоре, как решите. Модель качается по желанию, как и всё остальное."
      ],
      [
        "Файлы со своими данными",
        "В экспортированный MP3 записаны название, исполнитель, альбом, жанр, темп, текст и обложка, поэтому плеер показывает трек так же, как студия."
      ],
      [
        "LoRA",
        "LoRA и LoKr на композицию или на звук, у каждой своя сила. Каталог готовых и поиск по Hugging Face со скачиванием выбранного."
      ],
      [
        "Своя LoRA",
        "Песни одного артиста или стиля превращаются в LoRA на вашей видеокарте — тренером и рецептом HOT-Step. Каждую настройку можно поменять, датасеты переносятся между этой студией и YuE2 Studio."
      ],
      [
        "Датасет одним перетаскиванием",
        "Бросьте папку: тексты дословно берутся из баз, которыми пользуются плееры (LRCLIB, QQ Music, Kugou), Whisper слушает только то, чего там нет, а MOSS-Music слушает каждую песню и пишет её описание с измеренными темпом и тональностью. У каждой песни свой статус, а после перезапуска работа продолжается с того же места."
      ],
      [
        "Обработка звука",
        "Шумоподавление, Spectral Lifter, очеловечивание вокала, ваши VST3-плагины и мастеринг по эталону. Сравните до и после, сохраните версией или выбросьте."
      ],
      [
        "Управление агентом (MCP)",
        "Подключите Claude Code, Claude Desktop или Cursor — и агент делает всё, что умеет студия: пишет и генерирует песни, заполняет датасет и обучает, рисует обложки, собирает клипы в видеоредакторе, включает песни, а ещё видит окно и нажимает его кнопки. Правила описаний от самих MiniMax идут в комплекте, поэтому описания и тексты агент пишет сам. Выберите агента ассистентом — и тексты он будет писать вместо локальной модели."
      ],
      [
        "Любой трек в MIDI",
        "Песня, стем или обработанная версия превращается в многодорожечный MIDI — 34 группы инструментов и ударные — моделью MuScriptor на вашей видеокарте. Пианоролл заполняется по ходу, MIDI можно слушать вместе с оригиналом, глушить инструменты и сохранить .mid. Скачивается при первом запуске."
      ],
      [
        "Каждый результат — трек",
        "Стемы, обработка, перерендер и кавер попадают в библиотеку отдельными треками со ссылкой на оригинал и настройками, с которыми они сделаны."
      ],
      [
        "Свой плеер",
        "Десятиполосный эквалайзер на частотах Winamp с его пресетами и файлами .EQF; MilkDrop с сотнями пресетов или спектр в десяти видах; и режим Winamp, чьи окна разъединяются, стыкуются и растягиваются, в оригинальном скине или любом из музея скинов Winamp."
      ],
      [
        "«Сохранить как» и панель файлов",
        "Песни, стемы, MIDI, тексты, партитуры и видео сохраняются, куда скажете, через обычное окно сохранения Windows, а панель файлов показывает каждое сохранение."
      ],
      [
        "Прокси на всю студию",
        "HTTP, HTTPS, SOCKS5 или SOCKS4, с логином: через него идут загрузки моделей, Hugging Face, OpenRouter и обновления."
      ]
    ],
    "modelsTitle": "Модели",
    "modelsSub": "Рабочая установка Music3 — это всегда пять компонентов: языковая модель, RVQ depth-декодер, condition-энкодер, DiT и вокодер.",
    "modelsGpu": "Видеокарта",
    "modelsSize": "Загрузка",
    "modelsNote": "Студия определяет карту и заранее выбирает профиль, который на ней реально пойдёт, но скачивание — всегда ваше решение. Каждый файл сверяется по контрольной сумме с зафиксированной ревизией на Hugging Face, а прерванная загрузка продолжается с места остановки.",
    "startTitle": "С чего начать",
    "steps": [
      [
        "Установите",
        "инсталлятор или портативный архив."
      ],
      [
        "Выберите набор",
        "на первом экране уже отмечено то, что тянет ваша карта; по кнопке докачивается только недостающее."
      ],
      [
        "Напишите",
        "описание — это стиль, текст необязателен: инструментал включается одним переключателем."
      ],
      [
        "Сгенерируйте",
        "движок поднимается сам, трек попадает в библиотеку вместе со своими настройками."
      ],
      [
        "По желанию — OpenRouter",
        "один ключ добавляет ассистента, обложки и облачное распознавание. Локальное остаётся по умолчанию."
      ]
    ],
    "archTitle": "Как устроено",
    "archSub": "Служба вкомпилирована в десктопный бинарник и присматривает за C++-движком. Закрыли приложение — умерло всё, что оно запускало.",
    "privacyTitle": "Приватность",
    "privacySub": "Коротко: ваша музыка — ваша и остаётся на вашем диске.",
    "privacy": [
      [
        "Без аккаунта",
        "Регистрироваться негде и входить некуда."
      ],
      [
        "Без телеметрии",
        "Студия не сообщает, что вы сгенерировали, и что вы вообще что-то генерировали."
      ],
      [
        "Облако — по желанию",
        "Ничего не уходит с машины, пока вы не добавите ключ, и уходит только по той возможности, которой вы его назначили."
      ]
    ],
    "authorTitle": "Кто сделал",
    "authorSub": "Nerual Dreming — художник, основатель ArtGeneration.me и сообщества Neuro-Cartel, автор ACE-Step Studio, из которой выросла эта студия.",
    "footerLicense": "Студия с открытым исходным кодом. Веса MiniMax Music3 распространяются по собственной community-лицензии: коммерческое использование обязано указывать имя MiniMax-Music3 и выполнять требования этой лицензии.",
    "footerIssues": "Сообщить о проблеме",
    "insideTitle": "Что где выполняется",
    "insideSub": "По умолчанию всё локально. Облачный ключ добавляете вы сами и ровно для той возможности, для которой решили, — и можете забрать обратно.",
    "insidePart": "Часть",
    "insideRuns": "Где считает",
    "insideSize": "Размер",
    "inside": [
      [
        "Движок MiniMax Music3 (minimaxmusic.cpp)",
        "Ваша видеокарта, CUDA",
        "в комплекте"
      ],
      [
        "Набор моделей Music3 — пять компонентов",
        "Ваша видеокарта",
        "6.5–28.6 ГБ"
      ],
      [
        "Тайминги караоке — Parakeet или Whisper",
        "Ваша машина",
        "по желанию"
      ],
      [
        "Разделение на стемы — HT-Demucs, шесть дорожек",
        "Видеокарта или процессор",
        "136 МБ"
      ],
      [
        "Ассистент-автор",
        "Локальная GGUF или OpenRouter",
        "на ваш выбор"
      ],
      [
        "Обложки",
        "Модель изображений OpenRouter",
        "только облако"
      ],
      [
        "Сборка видео — ffmpeg",
        "Ваша машина",
        "в комплекте"
      ],
      [
        "Обучение LoRA — HOT-Step ace-train",
        "NVIDIA RTX 30 и новее, 22 ГБ видеопамяти",
        "10.5 ГБ, по желанию"
      ],
      [
        "Описание песен на слух — MOSS-Music-8B",
        "около 12 ГБ видеопамяти",
        "10 ГБ, по желанию"
      ],
      [
        "VST3-хост — HOT-Step",
        "Ваш компьютер, отдельный процесс",
        "в комплекте"
      ],
      [
        "Аудио в MIDI — MuScriptor (HOT-Step ace-midi)",
        "NVIDIA GTX 16 / RTX 20 и новее",
        "0.5–5.6 ГБ, по желанию"
      ]
    ],
    "modelsSet": "Профиль",
    "setNative": "Full Native — BF16 / BF16 / F32",
    "setQuality": "Q8 Quality",
    "setBalanced": "Balanced — Q6 / Q8 / Q5",
    "setLight": "Light — ради скорости и малой VRAM",
    "setMinimal": "Minimal — Q3, для карт 8 ГБ",
    "footerChanges": "Что изменилось",
    "title": "MiniMax Music3 Studio — полноценные треки нейросетью на своей видеокарте",
    "description": "Десктопная студия для MiniMax Music3 под Windows. Один exe, без Python и лаунчеров: пишете описание и текст, получаете целый трек локально, всё остаётся в библиотеке на вашем диске."
  },
  "zh": {
    "shotsTitle": "截图",
    "shotsSub": "工作室本身，使用你的语言。",
    "shots": [
      [
        "01-create",
        "创作曲目：分段式描述文档、歌词，以及每个生成参数的滑块。"
      ],
      [
        "02-player",
        "完成的曲目：封面、歌词时间轴、生成它的请求，以及播放器。"
      ],
      [
        "03-tools",
        "工作室工具：在显卡上分离六条音轨、语音转文字与波形编辑器。"
      ],
      [
        "04-models",
        "模型组合：每个角色一个量化版本，磁盘上已有什么，以及在已安装组合之间切换。"
      ],
      [
        "05-providers",
        "每项能力都按你的选择运行——本地或通过 OpenRouter，并标明所用模型。"
      ],
      [
        "06-cover",
        "封面：大图预览、按曲目信息填充的提示词模板，也可以使用自己的图片。"
      ],
      [
        "07-lora",
        "LoRA 目录：风格、艺术家和音色，注明作者，一次下载。"
      ],
      [
        "08-dataset",
        "数据集：每首歌的歌词已找到，描述靠听写成，速度与调性经过测量。"
      ],
      [
        "09-training",
        "在显卡上训练自己的 LoRA：训练中的损失曲线，每 100 步一个检查点，一键加入库。"
      ],
      [
        "10-midi",
        "任意音轨转 MIDI：按乐器显示的钢琴卷帘，可与原曲对照播放，支持静音和独奏。"
      ],
      [
        "11-processing",
        "音频处理：降噪、Spectral Lifter、人声自然化、VST3 插件和参考母带。"
      ],
      [
        "12-agent",
        "通过 MCP 连接智能体：地址以及粘贴到 Claude Code 或其他客户端的配置。"
      ],
      [
        "13-derived",
        "工具生成的音轨保存在曲库中，并链接到原曲。"
      ],
      [
        "14-listen",
        "播放时悬浮在工作室上方的均衡器曲线与 MilkDrop。"
      ],
      [
        "15-winamp",
        "整个窗口化身 Winamp 2：均衡器、播放列表和 MilkDrop，带皮肤。"
      ]
    ],
    "label": "中文",
    "heroTitle": "在自己的显卡上生成完整的 AI 音乐",
    "heroLead": "面向 MiniMax Music3 的 Windows 桌面工作室。写下风格描述与歌词，在本地生成一首完整的曲子；音频、参数以及生成它的确切请求都保存在你磁盘上的曲库里。只有一个可执行文件——无需 Python、Node.js 或启动脚本。",
    "ctaDownload": "下载 Windows 版",
    "ctaSource": "GitHub 源码",
    "ctaDonate": "支持项目",
    "ctaNote": "需要 Windows 10/11 x64 与 NVIDIA 显卡（GTX 900 系列及更新）。模型在工作室内按你的指令下载——程序不会自行下载任何东西。",
    "featuresTitle": "功能",
    "featuresSub": "除非你自己连接云端密钥，以下一切都在本机运行。",
    "features": [
      [
        "本地生成",
        "完整的 Music3 组件组合，单曲最长六分钟：描述、歌词、时长、DiT 步数、CFG、top-k、独立随机种子、一次多首。"
      ],
      [
        "精确复现",
        "每首曲子都保存自己的请求与音频编码，可以逐比特复现，也可以换步数、种子或格式重新渲染。"
      ],
      [
        "逐词卡拉OK",
        "带逐词时间戳的增强 LRC，由 Parakeet、Whisper 或云端模型对齐——歌词是你的，只借用时间轴。"
      ],
      [
        "视频导出",
        "卡拉OK 视频由内置 ffmpeg 生成：机器支持就用硬件编码，不支持则回落到软件编码。"
      ],
      [
        "写作助手",
        "由本地 GGUF 模型或 OpenRouter 生成描述与歌词，遵循 MiniMax 官方发布的提示词技能。"
      ],
      [
        "封面",
        "带 {title}、{style}、{excerpt} 占位符的提示词模板：风格只写一次，数据自动取自当前曲目。"
      ],
      [
        "你的曲库",
        "搜索、歌单、收藏、导入自有音频、导出、编辑——全部是磁盘上的普通文件。"
      ],
      [
        "硬件开销一目了然",
        "生成过程中实时显示 GPU 占用、显存、温度、功耗与引擎内存。"
      ],
      [
        "在你的显卡上分离音轨",
        "六条音轨——鼓、贝斯、其他、人声、吉他、钢琴——由 HT-Demucs 在显卡上分离，也可以改用处理器。模型和其他一切一样，按需下载。"
      ],
      [
        "自带信息的文件",
        "导出的 MP3 内含标题、艺术家、专辑、风格、速度、歌词与封面，播放器看到的与工作室一致。"
      ],
      [
        "LoRA",
        "作用于作曲或音色的 LoRA 与 LoKr，各自设置强度。内置现成目录，也可在 Hugging Face 搜索并下载所选。"
      ],
      [
        "训练你自己的 LoRA",
        "用同一歌手或风格的歌曲，在你的显卡上以 HOT-Step 的训练器和配方训练 LoRA。每项设置都可修改，数据集可在本工作室与 YuE2 Studio 之间迁移。"
      ],
      [
        "拖入即成数据集",
        "拖入一个文件夹：歌词逐字取自播放器使用的歌词库（LRCLIB、QQ 音乐、酷狗），只有它们都没有的歌才由 Whisper 听写，MOSS-Music 聆听每首歌，写出带测得速度和调性的描述。每首歌都显示进度，重启后从中断处继续。"
      ],
      [
        "音频处理",
        "降噪、Spectral Lifter、人声自然化、你自己的 VST3 插件，以及参考母带处理。对比处理前后，保存为版本或丢弃。"
      ],
      [
        "由你的智能体操控（MCP）",
        "连接 Claude Code、Claude Desktop 或 Cursor，智能体就能做工作室能做的一切：写歌并生成、整理数据集并训练、绘制封面、在视频编辑器里剪辑 MV、播放歌曲——还能看到窗口并点击按钮。MiniMax 官方的描述规则随之提供，描述和歌词由智能体自己来写。把它选为写作助手，就由它代替本地模型写词。"
      ],
      [
        "任意音轨转 MIDI",
        "歌曲、分轨或处理后的版本都能在你的显卡上由 MuScriptor 转为多乐器 MIDI——34 个乐器组加鼓。钢琴卷帘随识别实时填充，可与原曲对照播放、静音或独奏乐器并保存 .mid。首次使用时下载。"
      ],
      [
        "每个结果都是音轨",
        "分轨、处理后的版本、重新渲染和翻唱都会作为独立音轨进入曲库，链接到原曲并保留生成时的设置。"
      ],
      [
        "自带播放器",
        "基于 Winamp 频率的十段均衡器，含其预设和 .EQF 文件；带数百个预设的 MilkDrop，或十种样式的频谱；还有 Winamp 模式，各窗口可分离、吸附和调整大小，使用原版皮肤或 Winamp 皮肤博物馆中的任意皮肤。"
      ],
      [
        "另存为与文件面板",
        "歌曲、分轨、MIDI、歌词、乐谱和视频通过 Windows 自带的保存对话框存到你指定的位置，文件面板显示每次保存。"
      ],
      [
        "整个工作室的代理",
        "HTTP、HTTPS、SOCKS5 或 SOCKS4，支持登录：模型下载、Hugging Face、OpenRouter 和更新都经由它。"
      ]
    ],
    "modelsTitle": "模型",
    "modelsSub": "可运行的 Music3 安装始终由五个组件构成：语言模型、RVQ 深度解码器、条件编码器、DiT 与声码器。",
    "modelsGpu": "显卡",
    "modelsSize": "下载量",
    "modelsNote": "工作室会识别你的显卡并预选它真正跑得动的配置，但是否下载始终由你决定。每个文件都按固定的 Hugging Face 版本校验哈希，中断的下载会从断点继续。",
    "startTitle": "快速开始",
    "steps": [
      [
        "安装",
        "运行安装程序或解压便携版。"
      ],
      [
        "选择组合",
        "首屏已按你的显卡预选；点击下载只会补齐缺失的文件。"
      ],
      [
        "编写",
        "描述即风格，歌词可选——纯音乐只需一个开关。"
      ],
      [
        "生成",
        "引擎自动启动，曲子连同参数一起进入曲库。"
      ],
      [
        "可选：连接 OpenRouter",
        "一个密钥即可启用写作助手、封面与云端转写。默认仍然是本地。"
      ]
    ],
    "archTitle": "架构",
    "archSub": "服务被编译进桌面程序并托管 C++ 引擎。应用关闭时，它启动的一切都会随之退出。",
    "privacyTitle": "隐私",
    "privacySub": "一句话：你的音乐属于你，并留在你的磁盘上。",
    "privacy": [
      [
        "无需账号",
        "没有注册，也没有登录。"
      ],
      [
        "无遥测",
        "工作室不会上报你生成了什么，也不会上报你生成过。"
      ],
      [
        "云端可选",
        "在你添加密钥之前，没有任何东西离开这台机器；添加之后也只用于你指定的那项能力。"
      ]
    ],
    "authorTitle": "作者",
    "authorSub": "Nerual Dreming——艺术家，ArtGeneration.me 与 Neuro-Cartel 社区创始人，ACE-Step Studio 作者，本工作室由此发展而来。",
    "footerLicense": "本工作室开源。MiniMax Music3 权重遵循其自身的社区许可：商业使用必须标明 MiniMax-Music3 名称并落实该许可要求的安全措施。",
    "footerIssues": "反馈问题",
    "insideTitle": "各部分在哪里运行",
    "insideSub": "默认全部在本地。云端密钥由你自己添加，只用于你指定的能力，也可以随时移除。",
    "insidePart": "组成部分",
    "insideRuns": "运行位置",
    "insideSize": "大小",
    "inside": [
      [
        "MiniMax Music3 引擎（minimaxmusic.cpp）",
        "你的显卡，CUDA",
        "已内置"
      ],
      [
        "Music3 模型组合 — 五个组件",
        "你的显卡",
        "6.5–28.6 GB"
      ],
      [
        "卡拉OK 时间轴 — Parakeet 或 Whisper",
        "你的电脑",
        "可选下载"
      ],
      [
        "音轨分离 — HT-Demucs，六条音轨",
        "显卡或处理器",
        "136 MB"
      ],
      [
        "写作助手",
        "本地 GGUF 或 OpenRouter",
        "由你选择"
      ],
      [
        "封面图",
        "OpenRouter 图像模型",
        "仅云端"
      ],
      [
        "视频导出 — ffmpeg",
        "你的电脑",
        "已内置"
      ],
      [
        "LoRA 训练 — HOT-Step ace-train",
        "NVIDIA RTX 30 或更新，22 GB 显存",
        "10.5 GB，可选"
      ],
      [
        "按听觉描述歌曲 — MOSS-Music-8B",
        "约 12 GB 显存",
        "10 GB，可选"
      ],
      [
        "VST3 宿主 — HOT-Step",
        "你的电脑，独立进程",
        "内置"
      ],
      [
        "音频转 MIDI — MuScriptor（HOT-Step ace-midi）",
        "NVIDIA GTX 16 / RTX 20 或更新",
        "0.5–5.6 GB，可选"
      ]
    ],
    "modelsSet": "配置",
    "setNative": "Full Native — BF16 / BF16 / F32",
    "setQuality": "Q8 Quality",
    "setBalanced": "Balanced — Q6 / Q8 / Q5",
    "setLight": "Light — 追求速度与低显存",
    "setMinimal": "Minimal — Q3，用于 8 GB 显卡",
    "footerChanges": "更新记录",
    "title": "MiniMax Music3 Studio — 在自己的显卡上生成完整曲目",
    "description": "面向 MiniMax Music3 的 Windows 桌面工作室。一个可执行文件，无需 Python 与启动脚本：写下描述与歌词，在本机显卡上生成完整曲目，一切都留在你的曲库里。"
  },
  "ja": {
    "shotsTitle": "スクリーンショット",
    "shotsSub": "スタジオそのものを、あなたの言語で。",
    "shots": [
      [
        "01-create",
        "曲を書く：セクション構成のキャプション、歌詞、そして生成パラメータはすべてスライダーで。"
      ],
      [
        "02-player",
        "完成した曲：カバー、歌詞のタイミング、生成に使われたリクエスト、そしてプレーヤー。"
      ],
      [
        "03-tools",
        "スタジオツール：GPU での 6 ステム分離、文字起こし、波形エディタ。"
      ],
      [
        "04-models",
        "モデルセット：役割ごとに 1 つの量子化、ディスク上の状況、インストール済みセットの切り替え。"
      ],
      [
        "05-providers",
        "各機能は指定した場所で動きます - ローカルか OpenRouter か、モデル名つきで。"
      ],
      [
        "06-cover",
        "カバーアート：大きなプレビュー、曲の情報が入るプロンプトテンプレート、自分の画像も使えます。"
      ],
      [
        "07-lora",
        "LoRA カタログ：スタイル、アーティスト、サウンド。作者を明記し、まとめてダウンロード。"
      ],
      [
        "08-dataset",
        "データセット：各曲の歌詞を見つけ、聴いて説明文を書き、テンポとキーを測定。"
      ],
      [
        "09-training",
        "自分の LoRA を GPU で学習：学習中の損失、100 ステップごとのチェックポイント、ワンクリックでライブラリへ。"
      ],
      [
        "10-midi",
        "どのトラックも MIDI に：楽器ごとのピアノロール、原曲と重ねて再生、ミュートとソロ。"
      ],
      [
        "11-processing",
        "オーディオ処理：ノイズ除去、Spectral Lifter、ボーカルの自然化、VST3 プラグイン、リファレンスへのマスタリング。"
      ],
      [
        "12-agent",
        "MCP でエージェントを接続：アドレスと、Claude Code などのクライアントに貼り付ける設定。"
      ],
      [
        "13-derived",
        "ツールで作ったトラックはライブラリに残り、元の曲にリンクします。"
      ],
      [
        "14-listen",
        "再生中、スタジオの上に浮かぶカーブ付きイコライザーと MilkDrop。"
      ],
      [
        "15-winamp",
        "ウィンドウ全体が Winamp 2 に：イコライザー、プレイリスト、MilkDrop をスキン付きで。"
      ]
    ],
    "label": "日本語",
    "heroTitle": "自分の GPU でフルサイズの AI 音楽を",
    "heroLead": "MiniMax Music3 のための Windows デスクトップスタジオ。スタイルの説明と歌詞を書けば、ローカルで一曲まるごと生成できます。音声も設定も、それを生んだリクエストそのものも、ディスク上のライブラリに残ります。実行ファイルは一つだけ——Python も Node.js も起動スクリプトも不要です。",
    "ctaDownload": "Windows 版をダウンロード",
    "ctaSource": "GitHub のソース",
    "ctaDonate": "プロジェクトを支援",
    "ctaNote": "Windows 10/11 x64 と NVIDIA のカード（GTX 900 シリーズ以降）が必要です。モデルはスタジオ内から、あなたが決めたときにだけダウンロードされます。",
    "featuresTitle": "できること",
    "featuresSub": "クラウドのキーを自分でつなぐまで、以下はすべて手元のマシンで動きます。",
    "features": [
      [
        "ローカル生成",
        "Music3 の全コンポーネント、一曲あたり最長 6 分：説明、歌詞、長さ、DiT ステップ、CFG、top-k、独立したシード、一度に複数曲。"
      ],
      [
        "同じものを再現",
        "各トラックがリクエストとオーディオコードを保持するので、そのまま再レンダリングも、ステップやシード、形式を変えての再生成もできます。"
      ],
      [
        "単語単位のカラオケ",
        "単語ごとのタイムスタンプを持つ Enhanced LRC。Parakeet、Whisper、クラウドのいずれかで整列——歌詞はあなたのもので、借りるのは時間だけです。"
      ],
      [
        "動画の書き出し",
        "カラオケ動画は同梱の ffmpeg で作成。可能ならハードウェアエンコード、無理ならソフトウェアに切り替えます。"
      ],
      [
        "作詞アシスタント",
        "ローカルの GGUF モデルまたは OpenRouter で説明と歌詞を生成。MiniMax 公式のプロンプトスキルに従います。"
      ],
      [
        "ジャケット",
        "{title}、{style}、{excerpt} を使うプロンプトのテンプレート。スタイルは一度書けば、あとは曲のデータが入ります。"
      ],
      [
        "ライブラリ",
        "検索、プレイリスト、お気に入り、自分の音源の取り込み、書き出し、編集——すべてディスク上の普通のファイルです。"
      ],
      [
        "負荷が見える",
        "生成中の GPU 使用率、VRAM、温度、消費電力、エンジンのメモリをその場で表示。"
      ],
      [
        "GPU でステム分離",
        "ドラム、ベース、その他、ボーカル、ギター、ピアノの 6 トラックを HT-Demucs が GPU で分離します。CPU も選べます。モデルは他と同じく任意のダウンロードです。"
      ],
      [
        "情報を持ったファイル",
        "書き出した MP3 にはタイトル、アーティスト、アルバム、ジャンル、テンポ、歌詞、カバーが入っているので、プレーヤーでもスタジオと同じに見えます。"
      ],
      [
        "LoRA",
        "作曲またはサウンドに効く LoRA と LoKr を、それぞれ強さを付けて使えます。既製のカタログと、選んだものをダウンロードする Hugging Face 検索付き。"
      ],
      [
        "自分だけの LoRA",
        "同じアーティストやスタイルの曲から、HOT-Step のトレーナーとレシピで LoRA を自分の GPU で学習。設定はすべて変更でき、データセットはこのスタジオと YuE2 Studio の間で移せます。"
      ],
      [
        "フォルダを落とすだけでデータセット",
        "フォルダを落とすと、歌詞はプレーヤーが使う歌詞データベース（LRCLIB、QQ Music、Kugou）から一字一句取り込み、どこにもない曲だけ Whisper が聞き取ります。MOSS-Music が各曲を聴き、測定したテンポとキー付きで説明を書きます。曲ごとに進行が見え、再起動しても止まったところから続きます。"
      ],
      [
        "音声処理",
        "ノイズ除去、Spectral Lifter、ボーカルの自然化、自分の VST3 プラグイン、リファレンスマスタリング。処理前後を聴き比べ、バージョンとして残すか破棄します。"
      ],
      [
        "エージェントで操作（MCP）",
        "Claude Code、Claude Desktop、Cursor をつなぐと、エージェントがスタジオでできることをすべて行います。曲を書いて生成し、データセットを整えて学習し、カバーを描き、動画エディタでクリップを作り、曲を再生し、ウィンドウを見てボタンを押します。MiniMax 公式のキャプションのルールが付属するので、キャプションと歌詞はエージェント自身が書きます。 作詞アシスタントに選べば、ローカルモデルの代わりにエージェントが書きます。"
      ],
      [
        "どのトラックも MIDI に",
        "曲、ステム、処理済みテイクを、GPU 上の MuScriptor がマルチ楽器の MIDI（34 の楽器グループとドラム）に変換します。ピアノロールは聴き取りに合わせて埋まり、原曲と重ねて再生、楽器のミュートやソロ、.mid の保存ができます。初回使用時にダウンロードされます。"
      ],
      [
        "結果はすべてトラックに",
        "ステム、処理済みテイク、再レンダー、カバーは、それぞれ独立したトラックとしてライブラリに入り、元の曲へのリンクと作成時の設定を保持します。"
      ],
      [
        "専用プレーヤー",
        "Winamp の周波数による 10 バンドイコライザー（プリセットと .EQF ファイル）、数百のプリセットを持つ MilkDrop または 10 種類のスペクトラム、そして各ウィンドウを切り離し・ドッキング・リサイズできる Winamp モード。オリジナルスキンでも、Winamp スキン博物館のどのスキンでも。"
      ],
      [
        "名前を付けて保存とファイルパネル",
        "曲、ステム、MIDI、歌詞、楽譜、動画を Windows 標準の保存ダイアログで好きな場所に保存し、ファイルパネルがすべての保存を表示します。"
      ],
      [
        "スタジオ全体のプロキシ",
        "HTTP、HTTPS、SOCKS5、SOCKS4、ログイン対応。モデルのダウンロード、Hugging Face、OpenRouter、更新がすべて経由します。"
      ]
    ],
    "modelsTitle": "モデル",
    "modelsSub": "動作する Music3 の構成は常に五つ：言語モデル、RVQ デプスデコーダ、コンディションエンコーダ、DiT、ボコーダ。",
    "modelsGpu": "GPU",
    "modelsSize": "ダウンロード",
    "modelsNote": "スタジオはカードを検出し、実際に動くプロファイルをあらかじめ選びますが、ダウンロードするかどうかは常にあなたの判断です。各ファイルは固定した Hugging Face のリビジョンとハッシュ照合され、中断したダウンロードは途中から再開します。",
    "startTitle": "はじめかた",
    "steps": [
      [
        "インストール",
        "インストーラを実行するか、ポータブル版を展開します。"
      ],
      [
        "セットを選ぶ",
        "最初の画面でカードに合うものが選ばれています。押せば足りない分だけ取得します。"
      ],
      [
        "書く",
        "説明がスタイル、歌詞は任意——インストゥルメンタルはスイッチ一つ。"
      ],
      [
        "生成する",
        "エンジンは自動で起動し、曲は設定ごとライブラリに入ります。"
      ],
      [
        "任意：OpenRouter を接続",
        "キーが一つあればアシスタント、ジャケット、クラウド文字起こしが使えます。既定はローカルのままです。"
      ]
    ],
    "archTitle": "構成",
    "archSub": "サービスはデスクトップのバイナリに組み込まれ、C++ エンジンを監督します。アプリを閉じれば、起動したものはすべて一緒に終了します。",
    "privacyTitle": "プライバシー",
    "privacySub": "要するに、あなたの音楽はあなたのもので、ディスクから出ていきません。",
    "privacy": [
      [
        "アカウント不要",
        "登録するものも、サインインするものもありません。"
      ],
      [
        "テレメトリなし",
        "何を作ったかも、作ったこと自体も送信しません。"
      ],
      [
        "クラウドは任意",
        "キーを追加するまで何も外に出ず、追加後も割り当てた機能にしか使われません。"
      ]
    ],
    "authorTitle": "作者",
    "authorSub": "Nerual Dreming——アーティスト、ArtGeneration.me と Neuro-Cartel コミュニティの創設者、本スタジオの原型である ACE-Step Studio の作者。",
    "footerLicense": "このスタジオはオープンソースです。MiniMax Music3 の重みは独自のコミュニティライセンスに従い、商用利用では MiniMax-Music3 の名称表示とライセンスが求める安全対策が必要です。",
    "footerIssues": "問題を報告",
    "insideTitle": "どこで動くのか",
    "insideSub": "既定ではすべてローカルです。クラウドの鍵はあなたが、選んだ機能のためだけに追加し、いつでも外せます。",
    "insidePart": "構成要素",
    "insideRuns": "実行場所",
    "insideSize": "サイズ",
    "inside": [
      [
        "MiniMax Music3 エンジン（minimaxmusic.cpp）",
        "あなたの GPU、CUDA",
        "同梱"
      ],
      [
        "Music3 モデルセット — 5 コンポーネント",
        "あなたの GPU",
        "6.5〜28.6 GB"
      ],
      [
        "カラオケのタイミング — Parakeet または Whisper",
        "あなたの PC",
        "任意のダウンロード"
      ],
      [
        "ステム分離 — HT-Demucs、6 ステム",
        "GPU または CPU",
        "136 MB"
      ],
      [
        "作詞・説明アシスタント",
        "ローカル GGUF か OpenRouter",
        "お好みで"
      ],
      [
        "カバーアート",
        "OpenRouter の画像モデル",
        "クラウドのみ"
      ],
      [
        "動画書き出し — ffmpeg",
        "あなたの PC",
        "同梱"
      ],
      [
        "LoRA 学習 — HOT-Step ace-train",
        "NVIDIA RTX 30 以降、VRAM 22 GB",
        "10.5 GB、任意"
      ],
      [
        "曲を聴いて説明 — MOSS-Music-8B",
        "VRAM 約 12 GB",
        "10 GB、任意"
      ],
      [
        "VST3 ホスト — HOT-Step",
        "あなたのマシン、独立したプロセス",
        "同梱"
      ],
      [
        "オーディオから MIDI — MuScriptor（HOT-Step ace-midi）",
        "NVIDIA GTX 16 / RTX 20 以降",
        "0.5–5.6 GB、任意"
      ]
    ],
    "modelsSet": "プロファイル",
    "setNative": "Full Native — BF16 / BF16 / F32",
    "setQuality": "Q8 Quality",
    "setBalanced": "Balanced — Q6 / Q8 / Q5",
    "setLight": "Light — 速度と省 VRAM 重視",
    "setMinimal": "Minimal — Q3、8 GB カード向け",
    "footerChanges": "変更履歴",
    "title": "MiniMax Music3 Studio — 自分の GPU でフルサイズの楽曲を",
    "description": "MiniMax Music3 のための Windows デスクトップスタジオ。実行ファイル 1 つ、Python もランチャーも不要。キャプションと歌詞を書けば、自分の GPU でフルサイズの曲ができ、すべて手元のライブラリに残ります。"
  },
  "ko": {
    "shotsTitle": "스크린샷",
    "shotsSub": "스튜디오 그대로, 여러분의 언어로.",
    "shots": [
      [
        "01-create",
        "곡 작성: 섹션으로 나뉜 설명 문서, 가사, 그리고 모든 생성 파라미터를 슬라이더로."
      ],
      [
        "02-player",
        "완성된 곡: 커버, 가사 타이밍, 곡을 만든 요청, 그리고 플레이어."
      ],
      [
        "03-tools",
        "스튜디오 도구: GPU에서 6개 스템 분리, 음성 인식, 파형 편집기."
      ],
      [
        "04-models",
        "모델 세트: 역할마다 하나의 양자화, 디스크에 있는 것, 설치된 세트 간 전환."
      ],
      [
        "05-providers",
        "각 기능은 지정한 곳에서 실행됩니다 - 로컬 또는 OpenRouter, 모델 이름과 함께."
      ],
      [
        "06-cover",
        "커버 아트: 큰 미리보기, 곡 정보가 채워지는 프롬프트 템플릿, 원하면 직접 만든 이미지도."
      ],
      [
        "07-lora",
        "LoRA 카탈로그: 스타일, 아티스트, 사운드를 작가 표기와 함께 한 번에 내려받기."
      ],
      [
        "08-dataset",
        "데이터셋: 곡마다 가사를 찾고, 들어서 설명을 쓰고, 템포와 키를 측정했습니다."
      ],
      [
        "09-training",
        "내 LoRA를 GPU에서 학습: 학습 중 손실, 100스텝마다 체크포인트, 클릭 한 번으로 라이브러리에."
      ],
      [
        "10-midi",
        "어떤 트랙이든 MIDI로: 악기별 피아노 롤, 원곡과 함께 재생, 뮤트와 솔로."
      ],
      [
        "11-processing",
        "오디오 처리: 노이즈 제거, Spectral Lifter, 보컬 자연화, VST3 플러그인, 레퍼런스 마스터링."
      ],
      [
        "12-agent",
        "MCP로 에이전트 연결: 주소와 Claude Code 등 클라이언트에 붙여 넣을 설정."
      ],
      [
        "13-derived",
        "도구로 만든 트랙은 라이브러리에 남고 원곡과 연결됩니다."
      ],
      [
        "14-listen",
        "재생 중 스튜디오 위에 뜬 곡선 이퀄라이저와 MilkDrop."
      ],
      [
        "15-winamp",
        "창 전체가 Winamp 2로: 스킨을 입힌 이퀄라이저, 재생 목록, MilkDrop."
      ]
    ],
    "label": "한국어",
    "heroTitle": "내 GPU에서 만드는 완성형 AI 음악",
    "heroLead": "MiniMax Music3를 위한 Windows 데스크톱 스튜디오. 스타일 설명과 가사를 쓰면 로컬에서 한 곡을 통째로 만들고, 오디오와 설정, 그리고 그것을 만든 요청까지 내 디스크의 라이브러리에 남습니다. 실행 파일 하나면 됩니다 — Python도, Node.js도, 실행 스크립트도 필요 없습니다.",
    "ctaDownload": "Windows용 내려받기",
    "ctaSource": "GitHub 소스",
    "ctaDonate": "프로젝트 후원",
    "ctaNote": "Windows 10/11 x64와 NVIDIA 그래픽 카드(GTX 900 시리즈 이상)가 필요합니다. 모델은 스튜디오 안에서, 사용자가 결정할 때만 내려받습니다.",
    "featuresTitle": "기능",
    "featuresSub": "클라우드 키를 직접 연결하기 전까지는 아래 모든 것이 이 컴퓨터에서 동작합니다.",
    "features": [
      [
        "로컬 생성",
        "Music3의 전체 구성 요소, 한 곡 최대 6분: 설명, 가사, 길이, DiT 스텝, CFG, top-k, 개별 시드, 한 번에 여러 곡."
      ],
      [
        "그대로 재현",
        "모든 트랙이 자신의 요청과 오디오 코드를 저장하므로 똑같이 다시 렌더링하거나, 스텝·시드·포맷만 바꿔 다시 만들 수 있습니다."
      ],
      [
        "단어 단위 노래방",
        "단어마다 타임스탬프가 있는 Enhanced LRC. Parakeet, Whisper 또는 클라우드로 정렬하며 가사는 그대로 두고 타이밍만 가져옵니다."
      ],
      [
        "영상 내보내기",
        "노래방 영상은 함께 들어 있는 ffmpeg로 만듭니다. 가능하면 하드웨어 인코딩, 안 되면 소프트웨어로 내려갑니다."
      ],
      [
        "작사 도우미",
        "로컬 GGUF 모델이나 OpenRouter로 설명과 가사를 만들며, MiniMax가 공개한 프롬프트 스킬을 따릅니다."
      ],
      [
        "커버 아트",
        "{title}, {style}, {excerpt}를 쓰는 프롬프트 템플릿. 스타일은 한 번만 쓰고 나머지는 곡에서 채웁니다."
      ],
      [
        "내 라이브러리",
        "검색, 재생목록, 즐겨찾기, 내 오디오 가져오기, 내보내기, 편집 — 전부 디스크의 평범한 파일입니다."
      ],
      [
        "부하가 보인다",
        "생성 중 GPU 사용률, VRAM, 온도, 전력, 엔진 메모리를 실시간으로 표시합니다."
      ],
      [
        "내 GPU에서 스템 분리",
        "드럼, 베이스, 기타 소리, 보컬, 기타, 피아노 — 여섯 트랙을 HT-Demucs가 그래픽카드에서 분리합니다. 원하면 CPU로도. 모델은 다른 것과 마찬가지로 선택 다운로드입니다."
      ],
      [
        "스스로 정보를 지닌 파일",
        "내보낸 MP3에는 제목, 아티스트, 앨범, 장르, 템포, 가사, 커버가 들어 있어 플레이어에서도 스튜디오와 똑같이 보입니다."
      ],
      [
        "LoRA",
        "작곡 또는 사운드에 적용하는 LoRA와 LoKr, 각각 강도를 따로 설정합니다. 준비된 카탈로그와 고른 것을 내려받는 Hugging Face 검색이 있습니다."
      ],
      [
        "나만의 LoRA",
        "한 아티스트나 스타일의 곡들로 HOT-Step의 트레이너와 레시피를 써서 내 GPU에서 LoRA를 학습합니다. 모든 설정을 바꿀 수 있고, 데이터셋은 이 스튜디오와 YuE2 Studio 사이를 오갑니다."
      ],
      [
        "폴더 하나로 데이터셋",
        "폴더를 끌어다 놓으면 가사는 플레이어가 쓰는 가사 데이터베이스(LRCLIB, QQ Music, Kugou)에서 그대로 가져오고, 어디에도 없는 곡만 Whisper가 듣습니다. MOSS-Music이 곡마다 듣고 측정한 템포와 키로 설명을 씁니다. 곡마다 진행이 보이고, 다시 시작해도 멈춘 곳에서 이어집니다."
      ],
      [
        "오디오 처리",
        "노이즈 제거, Spectral Lifter, 보컬 자연화, 내 VST3 플러그인, 레퍼런스 마스터링. 처리 전후를 비교하고 버전으로 남기거나 버립니다."
      ],
      [
        "에이전트로 조작 (MCP)",
        "Claude Code, Claude Desktop, Cursor를 연결하면 에이전트가 스튜디오의 모든 일을 합니다. 곡을 쓰고 생성하고, 데이터셋을 채워 학습하고, 커버를 그리고, 비디오 편집기에서 클립을 만들고, 곡을 재생하며, 창을 보고 버튼을 누릅니다. MiniMax 공식 캡션 규칙이 함께 제공되어 캡션과 가사는 에이전트가 직접 씁니다. 작사 도우미로 고르면 로컬 모델 대신 에이전트가 씁니다."
      ],
      [
        "어떤 트랙이든 MIDI로",
        "노래, 스템, 처리된 테이크를 GPU의 MuScriptor가 다중 악기 MIDI(34개 악기 그룹과 드럼)로 바꿉니다. 피아노 롤이 듣는 대로 채워지고, 원곡과 함께 재생하거나 악기를 뮤트·솔로하고 .mid로 저장할 수 있습니다. 처음 쓸 때 내려받습니다."
      ],
      [
        "모든 결과가 트랙으로",
        "스템, 처리된 테이크, 재렌더, 커버가 각각 라이브러리의 트랙이 되어 원곡과 연결되고 만들 때의 설정을 간직합니다."
      ],
      [
        "전용 플레이어",
        "Winamp 주파수의 10밴드 이퀄라이저(프리셋과 .EQF 파일), 수백 개의 프리셋을 가진 MilkDrop 또는 열 가지 모양의 스펙트럼, 그리고 각 창을 분리·도킹·크기 조절할 수 있는 Winamp 모드. 오리지널 스킨이나 Winamp 스킨 박물관의 어떤 스킨이든."
      ],
      [
        "'다른 이름으로 저장'과 파일 패널",
        "노래, 스템, MIDI, 가사, 악보, 영상을 Windows 기본 저장 창으로 원하는 곳에 저장하고, 파일 패널이 모든 저장을 보여 줍니다."
      ],
      [
        "스튜디오 전체 프록시",
        "HTTP, HTTPS, SOCKS5, SOCKS4, 로그인 지원: 모델 다운로드, Hugging Face, OpenRouter, 업데이트가 모두 이를 거칩니다."
      ]
    ],
    "modelsTitle": "모델",
    "modelsSub": "동작하는 Music3 설치는 언제나 다섯 구성 요소입니다: 언어 모델, RVQ 깊이 디코더, 조건 인코더, DiT, 보코더.",
    "modelsGpu": "그래픽 카드",
    "modelsSize": "내려받기",
    "modelsNote": "스튜디오가 카드를 확인해 실제로 돌아가는 프로필을 미리 골라 주지만, 내려받을지는 언제나 사용자가 정합니다. 모든 파일은 고정된 Hugging Face 리비전과 체크섬으로 대조되고, 끊긴 다운로드는 멈춘 지점부터 이어집니다.",
    "startTitle": "시작하기",
    "steps": [
      [
        "설치",
        "설치 프로그램을 실행하거나 포터블 버전을 풉니다."
      ],
      [
        "세트 선택",
        "첫 화면에 카드에 맞는 구성이 미리 선택되어 있고, 누르면 없는 것만 받습니다."
      ],
      [
        "쓰기",
        "설명이 곧 스타일이고 가사는 선택 사항 — 연주곡은 스위치 하나입니다."
      ],
      [
        "생성",
        "엔진은 알아서 켜지고, 곡은 설정과 함께 라이브러리에 들어갑니다."
      ],
      [
        "선택: OpenRouter 연결",
        "키 하나로 작사 도우미, 커버 아트, 클라우드 전사가 켜집니다. 기본값은 여전히 로컬입니다."
      ]
    ],
    "archTitle": "구조",
    "archSub": "서비스는 데스크톱 바이너리에 함께 컴파일되어 C++ 엔진을 관리합니다. 앱을 닫으면 앱이 띄운 모든 것이 함께 종료됩니다.",
    "privacyTitle": "개인정보",
    "privacySub": "요약하면, 당신의 음악은 당신 것이고 디스크를 떠나지 않습니다.",
    "privacy": [
      [
        "계정 없음",
        "가입할 곳도, 로그인할 곳도 없습니다."
      ],
      [
        "텔레메트리 없음",
        "무엇을 만들었는지도, 만들었다는 사실도 보내지 않습니다."
      ],
      [
        "클라우드는 선택",
        "키를 추가하기 전에는 아무것도 나가지 않고, 추가한 뒤에도 지정한 기능에만 쓰입니다."
      ]
    ],
    "authorTitle": "만든 사람",
    "authorSub": "Nerual Dreming — 아티스트, ArtGeneration.me와 Neuro-Cartel 커뮤니티 설립자, 이 스튜디오의 뿌리가 된 ACE-Step Studio의 저자.",
    "footerLicense": "이 스튜디오는 오픈 소스입니다. MiniMax Music3 가중치는 자체 커뮤니티 라이선스를 따르며, 상업적 사용 시 MiniMax-Music3 이름을 표시하고 해당 라이선스가 요구하는 안전 조치를 구현해야 합니다.",
    "footerIssues": "문제 신고",
    "insideTitle": "무엇이 어디서 실행되나",
    "insideSub": "기본은 모두 로컬입니다. 클라우드 키는 원하는 기능에 대해서만 직접 추가하고, 언제든 다시 뺄 수 있습니다.",
    "insidePart": "구성 요소",
    "insideRuns": "실행 위치",
    "insideSize": "크기",
    "inside": [
      [
        "MiniMax Music3 엔진 (minimaxmusic.cpp)",
        "내 GPU, CUDA",
        "기본 포함"
      ],
      [
        "Music3 모델 세트 — 다섯 구성 요소",
        "내 GPU",
        "6.5~28.6 GB"
      ],
      [
        "노래방 타이밍 — Parakeet 또는 Whisper",
        "내 컴퓨터",
        "선택 다운로드"
      ],
      [
        "스템 분리 — HT-Demucs, 6개 스템",
        "GPU 또는 CPU",
        "136 MB"
      ],
      [
        "작성 어시스턴트",
        "로컬 GGUF 또는 OpenRouter",
        "선택 사항"
      ],
      [
        "커버 아트",
        "OpenRouter 이미지 모델",
        "클라우드 전용"
      ],
      [
        "영상 내보내기 — ffmpeg",
        "내 컴퓨터",
        "기본 포함"
      ],
      [
        "LoRA 학습 — HOT-Step ace-train",
        "NVIDIA RTX 30 이상, VRAM 22 GB",
        "10.5 GB, 선택"
      ],
      [
        "곡을 듣고 설명 — MOSS-Music-8B",
        "VRAM 약 12 GB",
        "10 GB, 선택"
      ],
      [
        "VST3 호스트 — HOT-Step",
        "내 컴퓨터, 별도 프로세스",
        "포함"
      ],
      [
        "오디오를 MIDI로 — MuScriptor (HOT-Step ace-midi)",
        "NVIDIA GTX 16 / RTX 20 이상",
        "0.5–5.6 GB, 선택"
      ]
    ],
    "modelsSet": "프로필",
    "setNative": "Full Native — BF16 / BF16 / F32",
    "setQuality": "Q8 Quality",
    "setBalanced": "Balanced — Q6 / Q8 / Q5",
    "setLight": "Light — 속도와 낮은 VRAM",
    "setMinimal": "Minimal — Q3, 8 GB 카드용",
    "footerChanges": "변경 내역",
    "title": "MiniMax Music3 Studio — 내 GPU에서 완성곡을",
    "description": "MiniMax Music3용 Windows 데스크톱 스튜디오. 실행 파일 하나, Python도 런처도 필요 없습니다. 설명과 가사를 쓰면 내 GPU에서 완성곡이 만들어지고 모든 것이 로컬 라이브러리에 남습니다."
  }
};
