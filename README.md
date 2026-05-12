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
- Network throttling presets (Slow 3G / Slow 4G / Fast 4G)
- Screenshot — capture the simulated viewport as a PNG
- Remembers your last device and settings
- Sidebar device picker with instant search

## Repository layout

This is a pnpm workspaces monorepo:

```
apps/
  extension/      # the browser extension (WXT, MV3)
  landing-page/   # marketing site (TanStack Start + Tailwind v4 + Nitro)
```

## Install

| Browser | Link |
|---------|------|
| Chrome | Chrome Web Store *(coming soon)* |
| Firefox | Firefox Add-ons *(coming soon)* |

## Develop locally

**Prerequisites:** Node.js 22+, pnpm 9+

```bash
pnpm install
```

### Extension

```bash
pnpm dev:ext             # Chrome (default)
pnpm dev:ext:firefox     # Firefox
pnpm build:ext           # production build → apps/extension/.output/chrome-mv3
pnpm build:ext:firefox   # production build → apps/extension/.output/firefox-mv2
pnpm test                # Playwright tests
```

Load the extension:

- **Chrome:** go to `chrome://extensions`, enable Developer Mode, click "Load unpacked", select `apps/extension/.output/chrome-mv3`
- **Firefox:** go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on", select any file inside `apps/extension/.output/firefox-mv2`

### Landing page

```bash
pnpm dev:lp        # http://localhost:3000
pnpm build:lp      # production build → apps/landing-page/.output (Nitro node-server)
```

Run the production build locally:

```bash
node apps/landing-page/.output/server/index.mjs
```

## Deploy (Coolify)

The landing page ships with a multi-stage `Dockerfile` (Node 24 alpine, Nitro node-server preset).

- **Build context:** repository root
- **Dockerfile:** `apps/landing-page/Dockerfile`
- **Exposed port:** `3000`

## Tech stack

**Extension:**
- [WXT](https://wxt.dev) — extension build framework
- Chrome DevTools Protocol (CDP) — device metrics, UA, touch, color scheme emulation, network throttling
- Firefox Declarative Net Request (DNR) — header modification
- Shadow DOM — isolated extension UI with no style conflicts
- TypeScript, Biome

**Landing page:**
- [TanStack Start](https://tanstack.com/start) — full-stack React framework
- [Nitro](https://nitro.build) — node-server preset
- Tailwind v4
- Motion (Framer Motion successor)

## License

MIT — see [LICENSE](LICENSE)
