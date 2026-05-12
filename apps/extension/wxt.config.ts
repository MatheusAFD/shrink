import { existsSync } from 'node:fs'
import { defineConfig } from 'wxt'

const CHROMIUM_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Arc.app/Contents/MacOS/Arc',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
]

function findChromiumBinary(): string | undefined {
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH
  }

  return CHROMIUM_CANDIDATES.find(existsSync)
}

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifestVersion: 3,
  runner: {
    binaries: {
      ...(findChromiumBinary() && { chrome: findChromiumBinary() as string }),
    },
  },
  manifest: ({ browser }) => ({
    name: 'Shrink - Mobile Device Simulator',
    description:
      'Preview any website as a mobile device. Free and open source.',
    permissions: [
      'storage',
      'activeTab',
      'tabs',
      ...(browser === 'chrome' ? ['debugger'] : []),
      ...(browser === 'firefox'
        ? ['declarativeNetRequest', 'declarativeNetRequestWithHostAccess']
        : []),
    ],
    action: {},
    host_permissions: ['<all_urls>'],
    browser_specific_settings:
      browser === 'firefox'
        ? {
            gecko: {
              id: 'shrink@matheusafd.dev',
              strict_min_version: '121.0',
            },
          }
        : undefined,
  }),
})
