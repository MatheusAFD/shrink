import { BROWSER_MODES } from '@/lib/constants/ui'
import { isSafariUnsupported } from '@/lib/user-agent'
import type { ActiveState, BrowserMode } from '@/types'
import { ICON_CAMERA, ICON_DEVICES, ICON_ROTATE, ICON_STOP } from './icons'

export interface ToolbarCallbacks {
  onTogglePicker: () => void
  onSetBrowser: (mode: BrowserMode) => void
  onScreenshot: () => void
  onRotate: () => void
  onStop: () => void
}

export class Toolbar {
  readonly el: HTMLElement
  readonly pickerToggleBtn: HTMLButtonElement
  private readonly browserBtns: Record<BrowserMode, HTMLButtonElement>
  private readonly deviceLabel: HTMLElement

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

    const screenshotBtn = document.createElement('button')
    screenshotBtn.className = 'tool-btn'
    screenshotBtn.title = 'Screenshot'
    screenshotBtn.innerHTML = `${ICON_CAMERA}<span class="tool-btn-label">Shot</span>`
    screenshotBtn.addEventListener('click', callbacks.onScreenshot)
    toolbar.appendChild(screenshotBtn)

    const rotateBtn = document.createElement('button')
    rotateBtn.className = 'tool-btn'
    rotateBtn.title = 'Rotate'
    rotateBtn.innerHTML = `${ICON_ROTATE}<span class="tool-btn-label">Rotate</span>`
    rotateBtn.addEventListener('click', callbacks.onRotate)
    toolbar.appendChild(rotateBtn)

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
  }

  updateState(state: ActiveState | null): void {
    if (!state) {
      this.deviceLabel.textContent = ''
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
      if (mode === 'safari' && isSafariUnsupported(state.device)) {
        btn.title = 'Safari unavailable on Android'
        btn.disabled = true
      } else {
        btn.title = ''
        btn.disabled = false
      }
    }
  }

  setPickerOpen(open: boolean): void {
    this.pickerToggleBtn.classList.toggle('active', open)
  }
}

function createDivider(): HTMLElement {
  const div = document.createElement('div')
  div.className = 'tool-divider'
  return div
}
