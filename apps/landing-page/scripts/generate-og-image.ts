import { execSync, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'

const PORT = 4173
const URL = `http://localhost:${PORT}`
const OUT = new URL('../public/og-image.png', import.meta.url).pathname

async function main() {
  // start preview server (requires prior build)
  const server = spawn('pnpm', ['preview', '--port', String(PORT)], {
    stdio: 'ignore',
    detached: true
  })

  // wait for server ready
  await new Promise<void>((resolve) => setTimeout(resolve, 3000))

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1200, height: 630 })
  await page.goto(URL, { waitUntil: 'networkidle' })

  // hide animated elements to avoid motion blur in screenshot
  await page.addStyleTag({
    content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
  })

  await page.screenshot({ path: OUT, type: 'png' })
  await browser.close()

  server.kill()
  console.log(`og-image saved → ${OUT}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
