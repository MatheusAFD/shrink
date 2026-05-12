import type { ThrottlePreset } from '@/lib/constants/throttle'
import type { ActiveState, ColorScheme } from '@/types'

export interface Activator {
  activate(tabId: number, state: ActiveState): Promise<void>
  deactivate(tabId: number): Promise<void>
  update(tabId: number, state: ActiveState): Promise<void>
  updateNetwork(tabId: number, throttle: ThrottlePreset): Promise<void>
  updateColorScheme(tabId: number, scheme: ColorScheme): Promise<void>
  onExternalDetach(handler: (tabId: number) => void): void
}

let cached: Activator | null = null

export async function getActivator(): Promise<Activator> {
  if (cached) {
    return cached
  }

  const browser = import.meta.env.BROWSER
  if (browser === 'firefox') {
    const { FirefoxActivator } = await import('./firefox-activator')
    cached = new FirefoxActivator()
    return cached
  }

  const { ChromeActivator } = await import('./chrome-activator')
  cached = new ChromeActivator()
  return cached
}
