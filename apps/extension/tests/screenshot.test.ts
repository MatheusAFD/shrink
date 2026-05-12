import type { BrowserContext, Page } from '@playwright/test'
import { activateExtension, expect, test } from './fixtures'

const URL = 'https://google.com'

async function setup(context: BrowserContext, page: Page) {
  await page.goto(URL)
  await page.waitForLoadState('domcontentloaded')
  await activateExtension(context, page)
  await page.waitForFunction(
    () => !!document.getElementById('__shrink_root__'),
    { timeout: 10_000 }
  )
}

async function selectFirstDevice(page: Page) {
  await page.evaluate(() => {
    const host = document.getElementById('__shrink_root__')
    ;(
      host?.shadowRoot?.querySelector(
        '.device-card'
      ) as HTMLButtonElement | null
    )?.click()
  })
}

async function clickToolBtn(page: Page, title: string) {
  await page.evaluate((t) => {
    const host = document.getElementById('__shrink_root__')
    for (const btn of host?.shadowRoot?.querySelectorAll('.tool-btn') ?? []) {
      if (btn.getAttribute('title') === t) {
        ;(btn as HTMLButtonElement).click()
        return
      }
    }
  }, title)
}

async function waitForFrameVisible(page: Page) {
  await page.waitForFunction(
    () => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.shrink-root')
          ?.classList.contains('visible') ?? false
      )
    },
    { timeout: 6_000 }
  )
}

test.describe('Screenshot feature', () => {
  test('Frame and Region buttons render in toolbar', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    const titles = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return Array.from(
        host?.shadowRoot?.querySelectorAll('.tool-btn') ?? []
      ).map((b) => b.getAttribute('title'))
    })

    expect(titles).toContain('Screenshot device')
    expect(titles).toContain('Screenshot custom area')
  })

  test('screenshot buttons disabled after Stop', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickToolBtn(page, 'Stop simulation')
    await page.waitForTimeout(300)

    const states = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      const btns = Array.from(
        host?.shadowRoot?.querySelectorAll('.tool-btn') ?? []
      )
      return btns
        .filter((b) => {
          const t = b.getAttribute('title')
          return t === 'Screenshot device' || t === 'Screenshot custom area'
        })
        .map((b) => (b as HTMLButtonElement).disabled)
    })

    expect(states.length).toBe(2)
    expect(states.every((d) => d === true)).toBe(true)
  })

  test('Region click mounts overlay with crosshair cursor', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickToolBtn(page, 'Screenshot custom area')
    await page.waitForTimeout(150)

    const overlayInfo = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      const overlay = host?.shadowRoot?.querySelector(
        '.shot-overlay'
      ) as HTMLElement | null
      if (!overlay) return null
      const style = window.getComputedStyle(overlay)
      return { exists: true, cursor: style.cursor }
    })

    expect(overlayInfo).not.toBeNull()
    expect(overlayInfo?.exists).toBe(true)
    expect(overlayInfo?.cursor).toBe('crosshair')
  })

  test('Esc key dismisses Region overlay', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickToolBtn(page, 'Screenshot custom area')
    await page.waitForTimeout(150)

    const before = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return !!host?.shadowRoot?.querySelector('.shot-overlay')
    })
    expect(before).toBe(true)

    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })
    await page.waitForTimeout(150)

    const after = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return !!host?.shadowRoot?.querySelector('.shot-overlay')
    })
    expect(after).toBe(false)
  })

  test('Region click after dispose re-opens overlay', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickToolBtn(page, 'Screenshot custom area')
    await page.waitForTimeout(150)
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })
    await page.waitForTimeout(150)

    await clickToolBtn(page, 'Screenshot custom area')
    await page.waitForTimeout(150)

    const reopened = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return !!host?.shadowRoot?.querySelector('.shot-overlay')
    })
    expect(reopened).toBe(true)
  })

  test('Region click after a completed selection re-opens overlay', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickToolBtn(page, 'Screenshot custom area')
    await page.waitForTimeout(150)

    await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      const overlay = host?.shadowRoot?.querySelector(
        '.shot-overlay'
      ) as HTMLElement | null
      if (!overlay) return
      const fire = (type: string, x: number, y: number) => {
        const ev = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          button: 0
        })
        overlay.dispatchEvent(ev)
        window.dispatchEvent(ev)
      }
      fire('mousedown', 100, 100)
      fire('mousemove', 300, 300)
      fire('mouseup', 300, 300)
    })
    await page.waitForTimeout(800)

    await clickToolBtn(page, 'Screenshot custom area')
    await page.waitForTimeout(200)

    const reopened = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      const overlay = host?.shadowRoot?.querySelector(
        '.shot-overlay'
      ) as HTMLElement | null
      const actions = host?.shadowRoot?.querySelector(
        '.shot-actions'
      ) as HTMLElement | null
      return { overlay: !!overlay, actions: !!actions }
    })
    expect(reopened.overlay).toBe(true)
    expect(reopened.actions).toBe(false)
  })
})
