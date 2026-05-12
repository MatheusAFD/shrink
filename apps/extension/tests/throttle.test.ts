import type { BrowserContext, Page } from '@playwright/test'
import { activateExtension, expect, test } from './fixtures'

const URL = 'https://shrink.mathlab.cc'

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

async function clickThrottleToggle(page: Page) {
  await page.evaluate(() => {
    const host = document.getElementById('__shrink_root__')
    ;(
      host?.shadowRoot?.querySelector(
        '.throttle-btn'
      ) as HTMLButtonElement | null
    )?.click()
  })
}

async function clickThrottleOption(page: Page, presetId: string) {
  await page.evaluate((id) => {
    const host = document.getElementById('__shrink_root__')
    ;(
      host?.shadowRoot?.querySelector(
        `.throttle-option[data-id="${id}"]`
      ) as HTMLButtonElement | null
    )?.click()
  }, presetId)
}

async function readThrottleLabel(page: Page): Promise<string> {
  return page.evaluate(() => {
    const host = document.getElementById('__shrink_root__')
    return host?.shadowRoot?.querySelector('.throttle-label')?.textContent ?? ''
  })
}

async function readActiveOptionId(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const host = document.getElementById('__shrink_root__')
    const active = host?.shadowRoot?.querySelector(
      '.throttle-option.active'
    ) as HTMLElement | null
    return active?.dataset.id ?? null
  })
}

test.describe('Network throttling', () => {
  test('throttle dropdown renders with default label', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    const exists = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return !!host?.shadowRoot?.querySelector('.throttle-dropdown')
    })
    expect(exists).toBe(true)

    expect(await readThrottleLabel(page)).toBe('No throttling')
  })

  test('clicking dropdown opens menu with all 4 presets', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickThrottleToggle(page)
    await page.waitForTimeout(150)

    const info = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      const menu = host?.shadowRoot?.querySelector('.throttle-menu')
      const options = Array.from(
        host?.shadowRoot?.querySelectorAll('.throttle-option') ?? []
      ).map((o) => ({
        id: (o as HTMLElement).dataset.id,
        label: o.textContent
      }))
      return { open: menu?.classList.contains('open') ?? false, options }
    })

    expect(info.open).toBe(true)
    expect(info.options).toHaveLength(4)
    expect(info.options.map((o) => o.id)).toEqual([
      'none',
      'fast-4g',
      'slow-4g',
      'slow-3g'
    ])
    expect(info.options.map((o) => o.label)).toEqual([
      'No throttling',
      'Fast 4G',
      'Slow 4G',
      'Slow 3G'
    ])
  })

  test('selecting preset updates label and active state', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickThrottleToggle(page)
    await page.waitForTimeout(100)
    await clickThrottleOption(page, 'slow-3g')
    await page.waitForTimeout(300)

    expect(await readThrottleLabel(page)).toBe('Slow 3G')
    expect(await readActiveOptionId(page)).toBe('slow-3g')

    const menuOpen = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.throttle-menu')
          ?.classList.contains('open') ?? false
      )
    })
    expect(menuOpen).toBe(false)
  })

  test('click outside closes menu', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickThrottleToggle(page)
    await page.waitForTimeout(100)

    const beforeOpen = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.throttle-menu')
          ?.classList.contains('open') ?? false
      )
    })
    expect(beforeOpen).toBe(true)

    await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      const root = host?.shadowRoot?.querySelector(
        '.shrink-root'
      ) as HTMLElement | null
      root?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    await page.waitForTimeout(150)

    const afterOpen = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.throttle-menu')
          ?.classList.contains('open') ?? false
      )
    })
    expect(afterOpen).toBe(false)
  })

  test('throttle persists across page reload', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickThrottleToggle(page)
    await page.waitForTimeout(100)
    await clickThrottleOption(page, 'slow-4g')
    await page.waitForTimeout(400)

    expect(await readThrottleLabel(page)).toBe('Slow 4G')

    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    await waitForFrameVisible(page)
    await page.waitForTimeout(300)

    expect(await readThrottleLabel(page)).toBe('Slow 4G')
    expect(await readActiveOptionId(page)).toBe('slow-4g')
  })

  test('throttle persists across stop and reactivate', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickThrottleToggle(page)
    await page.waitForTimeout(100)
    await clickThrottleOption(page, 'slow-3g')
    await page.waitForTimeout(400)

    await clickToolBtn(page, 'Stop simulation')
    await page.waitForFunction(
      () => {
        const host = document.getElementById('__shrink_root__')
        return !(
          host?.shadowRoot
            ?.querySelector('.shrink-root')
            ?.classList.contains('visible') ?? true
        )
      },
      { timeout: 6_000 }
    )

    await activateExtension(context, page)
    await page.waitForTimeout(400)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)
    await page.waitForTimeout(300)

    expect(await readThrottleLabel(page)).toBe('Slow 3G')
    expect(await readActiveOptionId(page)).toBe('slow-3g')
  })

  test('switching device preserves throttle', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickThrottleToggle(page)
    await page.waitForTimeout(100)
    await clickThrottleOption(page, 'fast-4g')
    await page.waitForTimeout(400)

    await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      const cards = host?.shadowRoot?.querySelectorAll('.device-card')
      const second = cards?.[1] as HTMLButtonElement | undefined
      second?.click()
    })
    await page.waitForTimeout(500)

    expect(await readThrottleLabel(page)).toBe('Fast 4G')
    expect(await readActiveOptionId(page)).toBe('fast-4g')
  })

  test('selecting throttle keeps picker open', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    await clickToolBtn(page, 'Choose device')
    await page.waitForTimeout(250)

    const beforeOpen = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.picker')
          ?.classList.contains('open') ?? false
      )
    })
    expect(beforeOpen).toBe(true)

    await clickThrottleToggle(page)
    await page.waitForTimeout(100)
    await clickThrottleOption(page, 'slow-3g')
    await page.waitForTimeout(500)

    const afterOpen = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.picker')
          ?.classList.contains('open') ?? false
      )
    })
    expect(afterOpen).toBe(true)
  })

  test('selecting throttle reloads iframe content only', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await waitForFrameVisible(page)

    const srcBefore = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      const iframe = host?.shadowRoot?.querySelector(
        'iframe'
      ) as HTMLIFrameElement | null
      return iframe?.src ?? ''
    })
    expect(srcBefore).toBeTruthy()

    await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      const iframe = host?.shadowRoot?.querySelector(
        'iframe'
      ) as HTMLIFrameElement | null
      ;(window as unknown as { __reloadCount: number }).__reloadCount = 0
      iframe?.addEventListener('load', () => {
        ;(window as unknown as { __reloadCount: number }).__reloadCount++
      })
    })

    await clickThrottleToggle(page)
    await page.waitForTimeout(100)
    await clickThrottleOption(page, 'slow-3g')
    await page.waitForTimeout(1200)

    const count = await page.evaluate(
      () => (window as unknown as { __reloadCount: number }).__reloadCount
    )
    expect(count).toBeGreaterThanOrEqual(1)

    const toolbarVisible = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return !!host?.shadowRoot?.querySelector('.toolbar')
    })
    expect(toolbarVisible).toBe(true)

    const frameVisible = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.shrink-root')
          ?.classList.contains('visible') ?? false
      )
    })
    expect(frameVisible).toBe(true)
  })
})
