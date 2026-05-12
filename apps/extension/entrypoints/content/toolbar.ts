import { THROTTLE_PRESETS, type ThrottlePreset } from '@/lib/constants/throttle'
import { BROWSER_MODES } from '@/lib/constants/ui'
import { isSafariUnsupported } from '@/lib/user-agent'
import type { ActiveState, BrowserMode } from '@/types'
import {
  ICON_CAMERA,
  ICON_CHEVRON_DOWN,
  ICON_DEVICES,
  ICON_NETWORK,
  ICON_REGION,
  ICON_ROTATE,
  ICON_STOP
} from './icons'

export interface ToolbarCallbacks {
  onTogglePicker: () => void
  onSetBrowser: (mode: BrowserMode) => void
  onSetThrottle: (preset: ThrottlePreset) => void
  onRotate: () => void
  onStop: () => void
  onScreenshotFrame: () => void
  onScreenshotRegion: () => void
}

export class Toolbar {
  readonly el: HTMLElement
  readonly pickerToggleBtn: HTMLButtonElement
  private readonly browserBtns: Record<BrowserMode, HTMLButtonElement>
  private readonly deviceLabel: HTMLElement
  private readonly frameShotBtn: HTMLButtonElement
  private readonly regionShotBtn: HTMLButtonElement
  private readonly throttleDropdown: HTMLElement
  private readonly throttleBtn: HTMLButtonElement
  private readonly throttleLabel: HTMLElement
  private readonly throttleOptions: Record<ThrottlePreset, HTMLButtonElement>
  private readonly outsideClickHandler: (ev: Event) => void

  constructor(container: HTMLElement, callbacks: ToolbarCallbacks) {
    const toolbar = document.createElement('div')
    toolbar.className = 'toolbar'

    const deviceLabel = document.createElement('span')
    deviceLabel.className = 'device-label'
    toolbar.appendChild(deviceLabel)

    const browserGroup = document.createElement('div')
    browserGroup.className = 'browser-group'

    const browserBtns = {} as Record<BrowserMode, HTMLButtonElement>
    for (const mode of BROWSER_MODES) {
      const btn = document.createElement('button')
      btn.className = 'browser-btn'
      btn.type = 'button'
      btn.textContent = mode.charAt(0).toUpperCase() + mode.slice(1)
      btn.dataset.mode = mode
      btn.addEventListener('click', () => callbacks.onSetBrowser(mode))
      browserBtns[mode] = btn
      browserGroup.appendChild(btn)
    }
    toolbar.appendChild(browserGroup)

    toolbar.appendChild(createDivider())

    const throttleDropdown = document.createElement('div')
    throttleDropdown.className = 'throttle-dropdown'

    const throttleBtn = document.createElement('button')
    throttleBtn.className = 'throttle-btn'
    throttleBtn.type = 'button'
    throttleBtn.title = 'Network throttling'
    const throttleLabel = document.createElement('span')
    throttleLabel.className = 'throttle-label'
    throttleLabel.textContent = 'No throttling'
    throttleBtn.innerHTML = `${ICON_NETWORK}`
    throttleBtn.appendChild(throttleLabel)
    throttleBtn.insertAdjacentHTML('beforeend', ICON_CHEVRON_DOWN)
    throttleDropdown.appendChild(throttleBtn)

    const throttleMenu = document.createElement('div')
    throttleMenu.className = 'throttle-menu'

    const throttleOptions = {} as Record<ThrottlePreset, HTMLButtonElement>
    for (const preset of THROTTLE_PRESETS) {
      const opt = document.createElement('button')
      opt.className = 'throttle-option'
      opt.type = 'button'
      opt.dataset.id = preset.id
      opt.textContent = preset.label
      opt.addEventListener('click', (ev) => {
        ev.stopPropagation()
        closeThrottleMenu()
        callbacks.onSetThrottle(preset.id)
      })
      throttleOptions[preset.id] = opt
      throttleMenu.appendChild(opt)
    }
    throttleDropdown.appendChild(throttleMenu)
    toolbar.appendChild(throttleDropdown)

    const closeThrottleMenu = () => {
      throttleMenu.classList.remove('open')
      throttleBtn.classList.remove('open')
    }

    throttleBtn.addEventListener('click', (ev) => {
      ev.stopPropagation()
      const willOpen = !throttleMenu.classList.contains('open')
      throttleMenu.classList.toggle('open', willOpen)
      throttleBtn.classList.toggle('open', willOpen)
    })

    const outsideClickHandler = (ev: Event) => {
      const path =
        typeof (ev as Event & { composedPath?: () => EventTarget[] })
          .composedPath === 'function'
          ? (ev as Event & { composedPath: () => EventTarget[] }).composedPath()
          : []
      if (path.includes(throttleDropdown)) return
      const target = ev.target as Node | null
      if (target && throttleDropdown.contains(target)) return
      closeThrottleMenu()
    }
    queueMicrotask(() => {
      const root = container.getRootNode() as ShadowRoot | Document
      root.addEventListener('click', outsideClickHandler)
    })

    toolbar.appendChild(createDivider())

    const rotateBtn = document.createElement('button')
    rotateBtn.className = 'tool-btn'
    rotateBtn.title = 'Rotate'
    rotateBtn.innerHTML = `${ICON_ROTATE}<span class="tool-btn-label">Rotate</span>`
    rotateBtn.addEventListener('click', callbacks.onRotate)
    toolbar.appendChild(rotateBtn)

    const frameShotBtn = document.createElement('button')
    frameShotBtn.className = 'tool-btn'
    frameShotBtn.type = 'button'
    frameShotBtn.title = 'Screenshot device'
    frameShotBtn.innerHTML = `${ICON_CAMERA}<span class="tool-btn-label">Frame</span>`
    frameShotBtn.addEventListener('click', callbacks.onScreenshotFrame)
    toolbar.appendChild(frameShotBtn)

    const regionShotBtn = document.createElement('button')
    regionShotBtn.className = 'tool-btn'
    regionShotBtn.type = 'button'
    regionShotBtn.title = 'Screenshot custom area'
    regionShotBtn.innerHTML = `${ICON_REGION}<span class="tool-btn-label">Region</span>`
    regionShotBtn.addEventListener('click', callbacks.onScreenshotRegion)
    toolbar.appendChild(regionShotBtn)

    const stopBtn = document.createElement('button')
    stopBtn.className = 'tool-btn danger'
    stopBtn.title = 'Stop simulation'
    stopBtn.innerHTML = `${ICON_STOP}<span class="tool-btn-label">Stop</span>`
    stopBtn.addEventListener('click', callbacks.onStop)
    toolbar.appendChild(stopBtn)

    toolbar.appendChild(createDivider())

    const pickerToggleBtn = document.createElement('button')
    pickerToggleBtn.className = 'tool-btn'
    pickerToggleBtn.title = 'Choose device'
    pickerToggleBtn.innerHTML = `${ICON_DEVICES}<span class="tool-btn-label">Devices</span>`
    pickerToggleBtn.addEventListener('click', callbacks.onTogglePicker)
    toolbar.appendChild(pickerToggleBtn)

    container.appendChild(toolbar)

    this.el = toolbar
    this.pickerToggleBtn = pickerToggleBtn
    this.browserBtns = browserBtns
    this.deviceLabel = deviceLabel
    this.frameShotBtn = frameShotBtn
    this.regionShotBtn = regionShotBtn
    this.throttleDropdown = throttleDropdown
    this.throttleBtn = throttleBtn
    this.throttleLabel = throttleLabel
    this.throttleOptions = throttleOptions
    this.outsideClickHandler = outsideClickHandler
  }

  updateState(state: ActiveState | null): void {
    const hasState = !!state
    this.frameShotBtn.disabled = !hasState
    this.regionShotBtn.disabled = !hasState
    this.throttleBtn.disabled = !hasState

    if (!state) {
      this.deviceLabel.textContent = ''
      this.throttleLabel.textContent = 'No throttling'
      for (const opt of Object.values(this.throttleOptions)) {
        opt.classList.remove('active')
      }
      return
    }

    const w =
      state.orientation === 'landscape'
        ? state.device.height
        : state.device.width
    const h =
      state.orientation === 'landscape'
        ? state.device.width
        : state.device.height
    this.deviceLabel.textContent = `${state.device.name} · ${w}×${h}`

    for (const mode of BROWSER_MODES) {
      const btn = this.browserBtns[mode]
      btn.classList.toggle('active', mode === state.browserMode)
      const safariUnsupported =
        mode === 'safari' && isSafariUnsupported(state.device)
      btn.title = safariUnsupported ? 'Safari unavailable on Android' : ''
      btn.disabled = safariUnsupported
    }

    const activePreset =
      THROTTLE_PRESETS.find((p) => p.id === state.throttle) ??
      THROTTLE_PRESETS[0]
    this.throttleLabel.textContent = activePreset.label
    for (const preset of THROTTLE_PRESETS) {
      this.throttleOptions[preset.id].classList.toggle(
        'active',
        preset.id === state.throttle
      )
    }
  }

  setPickerOpen(open: boolean): void {
    this.pickerToggleBtn.classList.toggle('active', open)
  }

  dispose(): void {
    const root = this.throttleDropdown.getRootNode() as ShadowRoot | Document
    root.removeEventListener('click', this.outsideClickHandler)
  }
}

function createDivider(): HTMLElement {
  const div = document.createElement('div')
  div.className = 'tool-divider'
  return div
}
