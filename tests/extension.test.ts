import { activateExtension, expect, test } from './fixtures'

const URL = 'https://google.com'

async function setup(
  context: import('@playwright/test').BrowserContext,
  page: import('@playwright/test').Page
) {
  await page.goto(URL)
  await page.waitForLoadState('domcontentloaded')
  await activateExtension(context, page)
  await page.waitForFunction(
    () => !!document.getElementById('__shrink_root__'),
    {
      timeout: 10_000
    }
  )
}

async function selectFirstDevice(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const host = document.getElementById('__shrink_root__')
    ;(
      host?.shadowRoot?.querySelector(
        '.device-card'
      ) as HTMLButtonElement | null
    )?.click()
  })
}

async function clickToolBtn(
  page: import('@playwright/test').Page,
  title: string
) {
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

test.describe('Shrink Extension', () => {
  test('overlay appears after icon click', async ({ context, page }) => {
    await setup(context, page)

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

    const visible = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.shrink-root')
          ?.classList.contains('visible') ?? false
      )
    })
    expect(visible).toBe(true)
  })

  test('devices button toggles picker panel', async ({ context, page }) => {
    await setup(context, page)

    const initiallyOpen = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.picker')
          ?.classList.contains('open') ?? false
      )
    })

    await clickToolBtn(page, 'Choose device')
    await page.waitForTimeout(300)

    const openAfterClick = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.picker')
          ?.classList.contains('open') ?? false
      )
    })

    expect(openAfterClick).toBe(!initiallyOpen || true)

    await clickToolBtn(page, 'Choose device')
    await page.waitForTimeout(300)

    const closedAfterToggle = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.picker')
          ?.classList.contains('open') ?? false
      )
    })

    expect(closedAfterToggle).toBe(false)
  })

  test('device selection updates toolbar label', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)

    await page.waitForFunction(
      () => {
        const host = document.getElementById('__shrink_root__')
        return (
          (host?.shadowRoot?.querySelector('.device-label')?.textContent
            ?.length ?? 0) > 0
        )
      },
      { timeout: 6_000 }
    )

    const label = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return host?.shadowRoot?.querySelector('.device-label')?.textContent ?? ''
    })
    expect(label).toMatch(/\d+×\d+/)
  })

  test('rotate swaps dimensions in toolbar label', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)

    await page.waitForFunction(
      () => {
        const host = document.getElementById('__shrink_root__')
        return (
          (host?.shadowRoot?.querySelector('.device-label')?.textContent
            ?.length ?? 0) > 0
        )
      },
      { timeout: 6_000 }
    )

    const before = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return host?.shadowRoot?.querySelector('.device-label')?.textContent ?? ''
    })

    await clickToolBtn(page, 'Rotate')
    await page.waitForTimeout(600)

    const after = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return host?.shadowRoot?.querySelector('.device-label')?.textContent ?? ''
    })

    expect(after).not.toBe(before)
  })

  test('firefox browser button activates', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)
    await page.waitForTimeout(400)

    await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      ;(
        host?.shadowRoot?.querySelector(
          '.browser-btn[data-mode="firefox"]'
        ) as HTMLButtonElement | null
      )?.click()
    })

    await page.waitForTimeout(400)

    const firefoxActive = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.browser-btn[data-mode="firefox"]')
          ?.classList.contains('active') ?? false
      )
    })
    expect(firefoxActive).toBe(true)
  })

  test('stop button hides overlay', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)
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

    const visible = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.shrink-root')
          ?.classList.contains('visible') ?? false
      )
    })
    expect(visible).toBe(false)
  })

  test('frame opens on first icon click without reload', async ({
    context,
    page
  }) => {
    await page.goto(URL)
    await page.waitForLoadState('domcontentloaded')
    await page.waitForFunction(
      () => !!document.getElementById('__shrink_root__'),
      { timeout: 10_000 }
    )

    await activateExtension(context, page)

    await selectFirstDevice(page)

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

    const visible = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.shrink-root')
          ?.classList.contains('visible') ?? false
      )
    })
    expect(visible).toBe(true)
  })

  test('frame persists across page reload', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)

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

    const labelBefore = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return host?.shadowRoot?.querySelector('.device-label')?.textContent ?? ''
    })
    expect(labelBefore).toMatch(/\d+×\d+/)

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

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

    const visible = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.shrink-root')
          ?.classList.contains('visible') ?? false
      )
    })
    expect(visible).toBe(true)

    const labelAfter = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return host?.shadowRoot?.querySelector('.device-label')?.textContent ?? ''
    })
    expect(labelAfter).toBe(labelBefore)
  })

  test('frame stays hidden after reload if user stopped it', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)
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

    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    await page.waitForTimeout(800)

    const visible = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.shrink-root')
          ?.classList.contains('visible') ?? false
      )
    })
    expect(visible).toBe(false)
  })

  test('second icon click deactivates extension', async ({ context, page }) => {
    await setup(context, page)
    await selectFirstDevice(page)

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

    await activateExtension(context, page)

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

    const visible = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.shrink-root')
          ?.classList.contains('visible') ?? false
      )
    })
    expect(visible).toBe(false)
  })

  test('picker open state persists across reload', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)

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

    await clickToolBtn(page, 'Choose device')
    await page.waitForTimeout(300)

    const openBefore = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.picker')
          ?.classList.contains('open') ?? false
      )
    })
    expect(openBefore).toBe(true)

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

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

    await page.waitForTimeout(300)

    const openAfter = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.picker')
          ?.classList.contains('open') ?? false
      )
    })
    expect(openAfter).toBe(true)
  })

  test('picker closed state persists across reload', async ({
    context,
    page
  }) => {
    await setup(context, page)
    await selectFirstDevice(page)

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

    const pickerOpen = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.picker')
          ?.classList.contains('open') ?? false
      )
    })
    if (pickerOpen) {
      await clickToolBtn(page, 'Choose device')
      await page.waitForTimeout(300)
    }

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

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

    await page.waitForTimeout(300)

    const closedAfter = await page.evaluate(() => {
      const host = document.getElementById('__shrink_root__')
      return (
        host?.shadowRoot
          ?.querySelector('.picker')
          ?.classList.contains('open') ?? false
      )
    })
    expect(closedAfter).toBe(false)
  })
})
