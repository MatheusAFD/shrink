import type { Msg } from '@/lib/messaging'
import type { ActiveState } from '@/types'
import { FrameView } from './frame'
import { DevicePicker } from './picker'
import { STYLE } from './styles'
import { Toolbar } from './toolbar'

export class ShrinkApp {
  private readonly shrinkRoot: HTMLElement
  private readonly picker: DevicePicker
  private readonly toolbar: Toolbar
  private readonly frame: FrameView
  private activeState: ActiveState | null = null

  constructor(shadow: ShadowRoot) {
    const style = document.createElement('style')
    style.textContent = STYLE
    shadow.appendChild(style)

    const shrinkRoot = document.createElement('div')
    shrinkRoot.className = 'shrink-root'

    this.picker = new DevicePicker(shrinkRoot, (device) => {
      const orientation = this.activeState?.orientation ?? 'portrait'
      const browserMode = this.activeState?.browserMode ?? 'chrome'
      void browser.runtime.sendMessage({
        type: 'CONTENT_ACTIVATE',
        deviceId: device.id,
        orientation,
        browserMode
      } satisfies Msg)
    })

    const stage = document.createElement('div')
    stage.className = 'stage'

    this.toolbar = new Toolbar(stage, {
      onTogglePicker: () => this.togglePicker(),
      onSetBrowser: (browserMode) => {
        void browser.runtime.sendMessage({
          type: 'CONTENT_SET_BROWSER',
          browserMode
        } satisfies Msg)
      },
      onScreenshot: () => this.takeScreenshot(),
      onRotate: () => {
        void browser.runtime.sendMessage({
          type: 'CONTENT_TOGGLE_ORIENTATION'
        } satisfies Msg)
      },
      onStop: () => {
        void browser.runtime.sendMessage({
          type: 'CONTENT_DEACTIVATE'
        } satisfies Msg)
      }
    })

    this.frame = new FrameView(stage)

    shrinkRoot.appendChild(stage)
    shadow.appendChild(shrinkRoot)

    this.shrinkRoot = shrinkRoot
  }

  handleMessage(msg: Msg): void {
    switch (msg.type) {
      case 'OPEN_SIDEBAR': {
        this.updateState(msg.state)
        if (!this.activeState) this.openPicker()
        break
      }
      case 'STATE_CHANGED': {
        this.updateState(msg.active && msg.state ? msg.state : null)
        if (!msg.active) this.hideFrame()
        break
      }
      case 'SHOW_FRAME':
        this.showFrame(msg.url, msg.state)
        break
      case 'HIDE_FRAME':
        this.hideFrame()
        this.updateState(null)
        break
      case 'UPDATE_FRAME':
        this.updateState(msg.state)
        this.frame.update(msg.state)
        break
    }
  }

  private takeScreenshot(): void {
    void browser.runtime.sendMessage({
      type: 'CONTENT_SCREENSHOT'
    } satisfies Msg).then((res) => {
      if (!res?.ok || !('data' in res)) return
      this.showScreenshotPopup(res.data as string)
    })
  }

  private showScreenshotPopup(base64: string): void {
    const existing = this.shrinkRoot.querySelector('.screenshot-popup')
    if (existing) existing.remove()

    const overlay = document.createElement('div')
    overlay.className = 'screenshot-popup'

    const dismiss = () => overlay.remove()
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) dismiss()
    })

    const box = document.createElement('div')
    box.className = 'screenshot-box'

    const preview = document.createElement('img')
    preview.src = `data:image/png;base64,${base64}`
    preview.className = 'screenshot-preview'
    box.appendChild(preview)

    const actions = document.createElement('div')
    actions.className = 'screenshot-actions'

    const copyBtn = document.createElement('button')
    copyBtn.className = 'screenshot-btn'
    copyBtn.textContent = 'Copy'
    copyBtn.addEventListener('click', async () => {
      try {
        const blob = await fetch(`data:image/png;base64,${base64}`).then((r) =>
          r.blob()
        )
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        copyBtn.textContent = 'Copied!'
        setTimeout(() => {
          copyBtn.textContent = 'Copy'
        }, 1500)
      } catch {
        copyBtn.textContent = 'Failed'
      }
    })
    actions.appendChild(copyBtn)

    const saveBtn = document.createElement('button')
    saveBtn.className = 'screenshot-btn primary'
    saveBtn.textContent = 'Save'
    saveBtn.addEventListener('click', () => {
      const a = document.createElement('a')
      a.href = `data:image/png;base64,${base64}`
      a.download = `shrink-${Date.now()}.png`
      a.click()
      dismiss()
    })
    actions.appendChild(saveBtn)

    box.appendChild(actions)
    overlay.appendChild(box)
    this.shrinkRoot.appendChild(overlay)
  }

  private showFrame(url: string, state: ActiveState): void {
    this.updateState(state)
    this.frame.show(url, state)
    this.shrinkRoot.classList.add('visible')
  }

  private hideFrame(): void {
    this.shrinkRoot.classList.remove('visible')
    this.frame.hide()
    this.closePicker()
  }

  private updateState(state: ActiveState | null): void {
    this.activeState = state
    this.picker.highlightActive(state?.device.id ?? null)
    this.toolbar.updateState(state)
  }

  private openPicker(): void {
    this.picker.open()
    this.toolbar.setPickerOpen(true)
  }

  private closePicker(): void {
    this.picker.close()
    this.toolbar.setPickerOpen(false)
  }

  private togglePicker(): void {
    if (this.picker.opened) this.closePicker()
    else this.openPicker()
  }
}
