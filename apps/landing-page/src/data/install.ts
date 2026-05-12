export type Browser = 'chrome' | 'firefox'
export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export const cloneCmd =
  'git clone https://github.com/matheusafd/shrink.git\ncd shrink'

export const installCmd: Record<PackageManager, string> = {
  pnpm: 'pnpm install',
  npm: 'npm install',
  yarn: 'yarn install',
  bun: 'bun install'
}

export const buildCmd: Record<PackageManager, Record<Browser, string>> = {
  pnpm: {
    chrome: 'pnpm build:ext',
    firefox: 'pnpm build:ext:firefox'
  },
  npm: {
    chrome: 'npm run build:ext',
    firefox: 'npm run build:ext:firefox'
  },
  yarn: {
    chrome: 'yarn build:ext',
    firefox: 'yarn build:ext:firefox'
  },
  bun: {
    chrome: 'bun run build:ext',
    firefox: 'bun run build:ext:firefox'
  }
}

export const outputPath: Record<Browser, string> = {
  chrome: 'apps/extension/.output/chrome-mv3',
  firefox: 'apps/extension/.output/firefox-mv2'
}

export const loadInstructions: Record<
  Browser,
  { url: string; steps: string[] }
> = {
  chrome: {
    url: 'chrome://extensions',
    steps: [
      'Open chrome://extensions in a new tab',
      'Toggle "Developer mode" on (top right)',
      'Click "Load unpacked"',
      `Select the folder ${outputPath.chrome}`
    ]
  },
  firefox: {
    url: 'about:debugging#/runtime/this-firefox',
    steps: [
      'Open about:debugging in a new tab',
      'Click "This Firefox" in the sidebar',
      'Click "Load Temporary Add-on"',
      `Select any file inside ${outputPath.firefox}`
    ]
  }
}

export const packageManagers: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun']
