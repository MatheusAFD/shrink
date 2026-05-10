import type { Msg } from '@/lib/messaging'
import type { ActiveState } from '@/types'
import { FrameView } from './frame'
import { DevicePicker } from './picker'
import { ScreenshotController } from './screenshot'
import { STYLE } from './styles'
import { Toolbar } from './toolbar'

export class ShrinkApp {
  private readonly shrinkRoot: HTMLElement
  private readonly picker: DevicePicker
  private readonly toolbar: Toolbar
  private readonly frame: FrameView
  private readonly screenshot: ScreenshotController
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
      onRotate: () => {
        void browser.runtime.sendMessage({
          type: 'CONTENT_TOGGLE_ORIENTATION'
        } satisfies Msg)
      },
      onStop: () => {
        void browser.runtime.sendMessage({
          type: 'CONTENT_DEACTIVATE'
        } satisfies Msg)
      },
      onScreenshotFrame: () => {
        this.screenshot.dispose()
        void this.screenshot.startFrame()
      },
      onScreenshotRegion: () => {
        this.closePicker()
        this.screenshot.dispose()
        this.screenshot.startRegion()
      }
    })

    this.frame = new FrameView(stage)

    shrinkRoot.appendChild(stage)
    shadow.appendChild(shrinkRoot)

    this.shrinkRoot = shrinkRoot

    this.screenshot = new ScreenshotController({
      shrinkRoot,
      getFrameEl: () => this.frame.el,
      getState: () => this.activeState,
      setCapturing: (kind) => {
        this.shrinkRoot.classList.toggle('capturing-frame', kind === 'frame')
        this.shrinkRoot.classList.toggle('capturing-region', kind === 'region')
      }
    })
  }

  handleMessage(msg: Msg): void {
    switch (msg.type) {
      case 'OPEN_SIDEBAR': {
        this.updateState(msg.state)
        if (msg.pickerOpen) {
          this.openPicker()
        } else if (!this.activeState) {
          this.openPicker()
        }
        break
      }
      case 'STATE_CHANGED': {
        this.updateState(msg.active && msg.state ? msg.state : null)
        if (!msg.active) {
          this.hideFrame()
        }
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

  private showFrame(url: string, state: ActiveState): void {
    this.updateState(state)
    this.frame.show(url, state)
    this.shrinkRoot.classList.add('visible')
  }

  private hideFrame(): void {
    this.shrinkRoot.classList.remove('visible')
    this.frame.hide()
    this.closePicker()
    this.screenshot.dispose()
  }

  private updateState(state: ActiveState | null): void {
    this.activeState = state
    this.picker.highlightActive(state?.device.id ?? null)
    this.toolbar.updateState(state)
  }

  private openPicker(): void {
    this.picker.open()
    this.toolbar.setPickerOpen(true)
    void browser.runtime.sendMessage({
      type: 'CONTENT_PICKER_STATE',
      open: true
    } satisfies Msg)
  }

  private closePicker(): void {
    this.picker.close()
    this.toolbar.setPickerOpen(false)
    void browser.runtime.sendMessage({
      type: 'CONTENT_PICKER_STATE',
      open: false
    } satisfies Msg)
  }

  private togglePicker(): void {
    if (this.picker.opened) {
      this.closePicker()
      return
    }
    this.openPicker()
  }
}
