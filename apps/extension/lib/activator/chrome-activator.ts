import { type ThrottlePreset, throttleById } from '@/lib/constants/throttle'
import { buildUserAgent } from '@/lib/user-agent'
import type { ActiveState } from '@/types'
import type { Activator } from './index'

const NO_THROTTLE_CONDITIONS = {
  offline: false,
  latency: 0,
  downloadThroughput: -1,
  uploadThroughput: -1
} as const

const PROTOCOL_VERSION = '1.3'

export class ChromeActivator implements Activator {
  private readonly attached = new Set<number>()
  private readonly stateByTab = new Map<number, ActiveState>()
  private detachHandler: ((tabId: number) => void) | null = null
  private listenersInstalled = false

  private async send<T = unknown>(
    tabId: number,
    method: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      browser.debugger.sendCommand(
        { tabId },
        method,
        params ?? {},
        (result) => {
          const err = browser.runtime.lastError
          if (err) {
            reject(new Error(`${method}: ${err.message}`))
            return
          }
          resolve(result as T)
        }
      )
    })
  }

  private async attach(tabId: number): Promise<void> {
    if (this.attached.has(tabId)) return
    await new Promise<void>((resolve, reject) => {
      browser.debugger.attach({ tabId }, PROTOCOL_VERSION, () => {
        const err = browser.runtime.lastError
        if (err) {
          reject(new Error(err.message))
          return
        }
        resolve()
      })
    })
    this.attached.add(tabId)
    await this.send(tabId, 'Page.enable')
    await this.send(tabId, 'Network.enable')
  }

  private async applyOverrides(
    tabId: number,
    state: ActiveState
  ): Promise<void> {
    const { device, orientation, browserMode } = state

    await this.send(tabId, 'Emulation.setDeviceMetricsOverride', {
      width: 0,
      height: 0,
      deviceScaleFactor: device.dpr,
      mobile: device.category === 'smartphone',
      screenOrientation: {
        type:
          orientation === 'landscape' ? 'landscapePrimary' : 'portraitPrimary',
        angle: orientation === 'landscape' ? 90 : 0
      }
    })

    await this.send(tabId, 'Emulation.setUserAgentOverride', {
      userAgent: buildUserAgent(device, browserMode)
    })

    await this.send(tabId, 'Emulation.setTouchEmulationEnabled', {
      enabled: true,
      maxTouchPoints: 5
    })

    const preset = throttleById.get(state.throttle) ?? throttleById.get('none')
    if (preset) {
      await this.send(
        tabId,
        'Network.emulateNetworkConditions',
        preset.conditions as unknown as Record<string, unknown>
      )
    }
    await this.send(tabId, 'Network.setCacheDisabled', {
      cacheDisabled: state.throttle !== 'none'
    })
  }

  private async clearOverrides(tabId: number): Promise<void> {
    try {
      await this.send(tabId, 'Emulation.clearDeviceMetricsOverride')
      await this.send(tabId, 'Emulation.setUserAgentOverride', {
        userAgent: ''
      })
      await this.send(tabId, 'Emulation.setTouchEmulationEnabled', {
        enabled: false
      })
      await this.send(
        tabId,
        'Network.emulateNetworkConditions',
        NO_THROTTLE_CONDITIONS as unknown as Record<string, unknown>
      )
      await this.send(tabId, 'Network.setCacheDisabled', {
        cacheDisabled: false
      })
    } catch {}
  }

  private installGlobalListeners(): void {
    if (this.listenersInstalled) return
    this.listenersInstalled = true

    browser.debugger.onDetach.addListener((source) => {
      const tabId = source.tabId
      if (tabId == null) return
      this.attached.delete(tabId)
      this.stateByTab.delete(tabId)
      this.detachHandler?.(tabId)
    })

    browser.debugger.onEvent.addListener(async (source, method) => {
      if (method !== 'Page.frameNavigated') return
      const tabId = source.tabId
      if (tabId == null) return
      const state = this.stateByTab.get(tabId)
      if (!state) return
      try {
        await this.applyOverrides(tabId, state)
      } catch {}
    })

    browser.tabs.onRemoved.addListener((tabId) => {
      if (!this.attached.has(tabId)) return
      this.attached.delete(tabId)
      this.stateByTab.delete(tabId)
    })
  }

  async activate(tabId: number, state: ActiveState): Promise<void> {
    this.installGlobalListeners()
    await this.attach(tabId)
    this.stateByTab.set(tabId, state)
    await this.applyOverrides(tabId, state)
  }

  async deactivate(tabId: number): Promise<void> {
    if (!this.attached.has(tabId)) return
    await this.clearOverrides(tabId)
    await new Promise<void>((resolve) => {
      browser.debugger.detach({ tabId }, () => {
        void browser.runtime.lastError
        resolve()
      })
    })
    this.attached.delete(tabId)
    this.stateByTab.delete(tabId)
  }

  async update(tabId: number, state: ActiveState): Promise<void> {
    if (!this.attached.has(tabId)) {
      this.installGlobalListeners()
      await this.attach(tabId)
    }
    this.stateByTab.set(tabId, state)
    await this.applyOverrides(tabId, state)
  }

  async updateNetwork(tabId: number, throttle: ThrottlePreset): Promise<void> {
    const current = this.stateByTab.get(tabId)
    if (current) {
      this.stateByTab.set(tabId, { ...current, throttle })
    }
    if (!this.attached.has(tabId)) return
    const preset = throttleById.get(throttle) ?? throttleById.get('none')
    if (!preset) return
    await this.send(
      tabId,
      'Network.emulateNetworkConditions',
      preset.conditions as unknown as Record<string, unknown>
    )
    await this.send(tabId, 'Network.setCacheDisabled', {
      cacheDisabled: throttle !== 'none'
    })
  }

  onExternalDetach(handler: (tabId: number) => void): void {
    this.detachHandler = handler
  }
}
