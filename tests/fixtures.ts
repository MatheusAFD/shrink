import path from 'node:path'
import { type BrowserContext, type Page, chromium, test as base } from '@playwright/test'

const EXTENSION_PATH = path.resolve(import.meta.dirname, '../.output/chrome-mv3')

type ExtensionFixtures = {
  context: BrowserContext
  extensionId: string
}

export const test = base.extend<ExtensionFixtures>({
  // biome-ignore lint/correctness/noEmptyPattern: Playwright fixture signature requires destructuring
  context: async ({}, use) => {
    const ctx = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
        '--no-sandbox'
      ]
    })
    await use(ctx)
    await ctx.close()
  },

  extensionId: async ({ context }, use) => {
    const sw =
      context.serviceWorkers()[0] ??
      (await context.waitForEvent('serviceworker'))
    await use(sw.url().split('/')[2])
  }
})

export { expect } from '@playwright/test'

export async function activateExtension(
  context: BrowserContext,
  _page: Page
): Promise<void> {
  const sw =
    context.serviceWorkers()[0] ??
    (await context.waitForEvent('serviceworker'))

  const tabId = await sw.evaluate(async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    return tabs[0]?.id ?? null
  })

  if (tabId == null) throw new Error('Could not find active tab id')

  await sw.evaluate(async (id) => {
    const tab = await chrome.tabs.get(id)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // biome-ignore lint/suspicious/noExplicitAny: dispatch not in types
    ;(chrome.action.onClicked as any).dispatch(tab)
  }, tabId)
}

export async function shadowVisible(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel) => {
    const host = document.getElementById('__shrink_root__')
    const el = host?.shadowRoot?.querySelector(sel) as HTMLElement | null
    if (!el) return false
    const style = window.getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden'
  }, selector)
}
