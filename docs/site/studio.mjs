// What the project page says about this studio beyond its text: the release it offers, the features
// its tiles show (places in each language's features list, with the screenshot each shows), and the answers it points to.
export const STUDIO = {
  id: 'minimax',
  name: 'MiniMax Music3 Studio',
  repo: 'https://github.com/timoncool/MiniMax-Music3-Studio',
  site: 'https://timoncool.github.io/MiniMax-Music3-Studio/',
  version: '3.5.3',
  installerMB: 455.27,
  updated: '2026-10-10',
  bento: [
    { feature: 11, shot: '09-training' },
    { feature: 2, shot: '02-player' },
    { feature: 8, shot: '03-tools' },
    { feature: 15, shot: '10-midi' },
    { feature: 20, shot: '16-covers' },
    { feature: 14, shot: '12-agent' },
  ],
  faq: { lora: 11, mcp: 14 },
  arch: "React UI ─┐\n          ├─ MiniMax Music3 Studio.exe   (window + native service)\nRust axum ┘        │\n                   └─ minimaxmusic.cpp `mm-server`  (C++/CUDA, GGUF)",
};
