import { spawn } from 'node:child_process'
import path from 'node:path'
import { chromium } from 'playwright'

const PORT = 4173
const URL = `http://localhost:${PORT}`
const OUT = path.resolve(import.meta.dirname, '../public/og-image.png')

async function waitForServer(url: string, timeout = 10000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      await fetch(url)
      return
    } catch {
      await new Promise((r) => setTimeout(r, 300))
    }
  }
  throw new Error(`Server at ${url} did not respond in ${timeout}ms`)
}

async function main() {
  const server = spawn('pnpm', ['preview', '--port', String(PORT)], {
    stdio: 'ignore',
    detached: true
  })

  try {
    await waitForServer(URL)

    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1200, height: 630 })
    await page.goto(URL, { waitUntil: 'networkidle' })
    await page.addStyleTag({
      content:
        '*, *::before, *::after { animation: none !important; transition: none !important; }'
    })
    // wait for fonts to load and layout to settle
    await page.evaluate(() => document.fonts.ready)
    await new Promise((r) => setTimeout(r, 1500))
    await page.screenshot({ path: OUT, type: 'png' })
    await browser.close()
    console.log(`og-image saved → ${OUT}`)
  } finally {
    server.kill()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
