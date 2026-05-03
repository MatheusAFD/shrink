import { ROOT_ID, Z_INDEX_ROOT } from '@/lib/constants/ui'
import type { Msg } from '@/lib/messaging'
import { ShrinkApp } from './app'

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  async main() {
    const root = document.createElement('div')
    root.id = ROOT_ID
    root.style.cssText = `all:initial;position:fixed;inset:0;z-index:${Z_INDEX_ROOT};pointer-events:none;`
    const shadow = root.attachShadow({ mode: 'open' })
    document.documentElement.appendChild(root)

    const app = new ShrinkApp(shadow)

    browser.runtime.onMessage.addListener((msg: Msg) => {
      app.handleMessage(msg)
    })

    await browser.runtime.sendMessage({ type: 'CONTENT_READY' } satisfies Msg)
  }
})
