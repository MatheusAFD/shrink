# Shrink

Preview any website as a mobile device — directly in your browser, with zero setup.

## Why Shrink?

- **No analytics, no tracking** — nothing leaves your browser
- **No ads, no paywalls, no accounts**
- **Open source** (MIT)
- Works on **Chrome** and **Firefox**

## Features

- 24+ devices — iPhone, Samsung Galaxy, Google Pixel, iPad, and more
- Browser mode switching — Chrome, Firefox, Safari user agents
- Portrait & landscape rotation
- Light / Dark / Auto color scheme emulation (`prefers-color-scheme` via CDP)
- Screenshot — capture the simulated viewport as a PNG
- Remembers your last device and settings
- Sidebar device picker with instant search

## Install

| Browser | Link |
|---------|------|
| Chrome | Chrome Web Store *(coming soon)* |
| Firefox | Firefox Add-ons *(coming soon)* |

## Develop locally

**Prerequisites:** Node.js 20+, pnpm

```bash
pnpm install

# Chrome
pnpm dev

# Firefox
pnpm dev:firefox
```

Load the extension:

- **Chrome:** go to `chrome://extensions`, enable Developer Mode, click "Load unpacked", select `.output/chrome-mv3`
- **Firefox:** go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on", select any file inside `.output/firefox-mv2`

**Build for production:**

```bash
pnpm build          # Chrome
pnpm build:firefox  # Firefox
```

## Tech stack

- [WXT](https://wxt.dev) — extension build framework
- Chrome DevTools Protocol (CDP) — device metrics, UA, touch, color scheme emulation
- Firefox Declarative Net Request (DNR) — header modification
- Shadow DOM — isolated extension UI with no style conflicts
- TypeScript, Biome

## License

MIT — see [LICENSE](LICENSE)
