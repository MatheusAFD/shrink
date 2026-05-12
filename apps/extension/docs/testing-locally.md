# Testing DevFrame Locally

This guide walks you through loading and testing the extension in Chrome and Firefox during development.

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) 8+
- A Chromium-based browser (Chrome, Arc, Brave, Edge) for the full-fidelity path
- Firefox 121+ for the iframe path

## Setup

```bash
pnpm install
```

---

## Option A — Dev mode (recommended)

Dev mode gives you hot reload: the extension updates automatically when you save a file.

### Chrome

```bash
pnpm dev
```

WXT opens a new Chrome window with the extension already loaded.

### Arc (or other Chromium browsers without Chrome installed)

If you don't have Google Chrome but have Arc, Brave, or another Chromium-based browser,
point `CHROME_PATH` to its executable:

```bash
# Arc
pnpm dev:arc

# Or manually for any Chromium binary
CHROME_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" pnpm dev
```

### Firefox

```bash
pnpm dev:firefox
```

WXT opens a new Firefox window with the extension already loaded.

> **Note:** Firefox will show a warning about unsigned extensions. This is expected in dev mode.

---

## Option B — Load a production build

Use this to test the exact build that will be shipped.

### 1. Build

```bash
# Chrome / Arc / Chromium
pnpm build

# Firefox
pnpm build:firefox
```

Output goes to:
- Chromium → `.output/chrome-mv3/`
- Firefox → `.output/firefox-mv3/`

### 2. Load in Chrome / Arc

1. Open `chrome://extensions` (Arc supports the same URL)
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `.output/chrome-mv3/` folder

### 3. Load in Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Navigate into `.output/firefox-mv3/` and select `manifest.json`

> Temporary add-ons are removed when Firefox restarts. Use `pnpm dev:firefox` for persistent dev sessions.

---

## Testing the extension

### Chrome / Arc — full fidelity mode

1. Navigate to any site (e.g. `https://tailwindcss.com`)
2. Click the DevFrame icon in the toolbar
3. Select a device — e.g. **iPhone 16 Pro**
4. The browser shows a yellow **"DevFrame is debugging this browser"** banner. This is expected — it's the cost of using the CDP emulation API.
5. Open DevTools console (`⌘⌥J`) and verify:
   ```js
   window.innerWidth        // → 402
   window.devicePixelRatio  // → 3
   navigator.userAgent      // → contains iPhone string
   'ontouchstart' in window // → true
   ```
6. The floating toolbar appears in the top-right corner of the page
7. Click **Rotate** (↻) in the toolbar — width and height should swap
8. Navigate to another URL in the same tab — overrides persist
9. Click **✕** in the toolbar — banner disappears, page returns to desktop layout

### Firefox — iframe mode

1. Navigate to any site (e.g. `https://tailwindcss.com`)
2. Click the DevFrame icon and select a device
3. A dark overlay appears with the site rendered inside an iframe at the selected dimensions
4. The floating toolbar works the same way — rotate and close
5. Try a site with strict CSP (e.g. `https://github.com`) — a fallback message appears: _"This site blocks embedding. Open it in a new tab to inspect responsively."_
6. Click **✕** — overlay disappears, the original page is restored

---

## Lint and type checking

```bash
# Type check
pnpm compile

# Lint + format check
pnpm lint

# Auto-fix formatting
pnpm format
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `No Chrome installations found` | Chrome not installed | Use `pnpm dev:arc` or set `CHROME_PATH` to your browser binary |
| Popup opens but clicking a device does nothing | Background service worker crashed | Open `chrome://extensions`, click the **Service Worker** link and check for errors |
| Yellow banner stays after clicking ✕ | Debugger detach failed silently | Reload the extension from `chrome://extensions` |
| Firefox overlay appears blank | Site blocked iframe despite header removal | Expected — see fallback message above |
| `pnpm dev:firefox` fails to open browser | Firefox not in PATH | Set `FIREFOX_BIN` env var: `FIREFOX_BIN=/path/to/firefox pnpm dev:firefox` |
| TypeScript errors after `pnpm install` | WXT types not generated | Run `pnpm wxt prepare` then retry |
