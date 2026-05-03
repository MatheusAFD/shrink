import {
  buildFrameStyles,
  getFrameDimensions,
  stylesToString
} from '@/lib/frame-css'
import type { ActiveState } from '@/types'

export class FrameView {
  readonly el: HTMLElement
  private readonly deviceFrame: HTMLElement
  private readonly topBar: HTMLElement
  private readonly camera: HTMLElement
  private readonly screenInner: HTMLElement
  private readonly homeIndicator: HTMLElement
  private readonly iframe: HTMLIFrameElement
  private readonly fallback: HTMLElement
  private fallbackTimeoutId: number | undefined

  private currentState: ActiveState | null = null
  private lastDimsKey = ''
  private lastOrientation: 'portrait' | 'landscape' | null = null
  private rotateTimeoutId: number | undefined
  private readonly resizeHandler: () => void

  constructor(container: HTMLElement) {
    const frameWrap = document.createElement('div')
    frameWrap.className = 'frame-wrap'

    const deviceFrame = document.createElement('div')
    deviceFrame.className = 'device-frame'

    const topBar = document.createElement('div')
    const camera = document.createElement('div')
    topBar.appendChild(camera)
    deviceFrame.appendChild(topBar)

    const screenInner = document.createElement('div')
    screenInner.className = 'screen-inner'
    const iframe = document.createElement('iframe')
    screenInner.appendChild(iframe)
    deviceFrame.appendChild(screenInner)

    const homeIndicator = document.createElement('div')
    deviceFrame.appendChild(homeIndicator)

    frameWrap.appendChild(deviceFrame)

    const fallback = document.createElement('div')
    fallback.className = 'fallback'
    frameWrap.appendChild(fallback)

    container.appendChild(frameWrap)

    this.el = frameWrap
    this.deviceFrame = deviceFrame
    this.topBar = topBar
    this.camera = camera
    this.screenInner = screenInner
    this.homeIndicator = homeIndicator
    this.iframe = iframe
    this.fallback = fallback

    this.resizeHandler = () => {
      if (this.currentState) {
        this.applyDimensions(this.currentState)
      }
    }
    window.addEventListener('resize', this.resizeHandler)
  }

  show(url: string, state: ActiveState): void {
    this.currentState = state
    this.lastOrientation = state.orientation
    this.applyDimensions(state)
    this.fallback.classList.remove('visible')

    const onLoad = () => {
      window.clearTimeout(this.fallbackTimeoutId)
      this.iframe.removeEventListener('load', onLoad)
    }
    this.iframe.addEventListener('load', onLoad)
    this.iframe.src = url

    this.fallbackTimeoutId = window.setTimeout(() => {
      if (!this.iframe.contentWindow || this.iframe.contentDocument === null) {
        this.fallback.textContent =
          'This site blocks embedding. Its mobile layout is already active — inspect via DevTools.'
        this.fallback.classList.add('visible')
      }
    }, 4000)
  }

  hide(): void {
    this.currentState = null
    this.lastOrientation = null
    window.clearTimeout(this.fallbackTimeoutId)
    window.clearTimeout(this.rotateTimeoutId)
    this.deviceFrame.classList.remove('rotating')
    this.iframe.src = 'about:blank'
    this.fallback.classList.remove('visible')
  }

  update(state: ActiveState): void {
    const orientationChanged =
      this.lastOrientation !== null &&
      this.lastOrientation !== state.orientation
    this.currentState = state

    if (!orientationChanged) {
      this.applyDimensions(state)
      this.lastOrientation = state.orientation
      const src = this.iframe.src
      if (src && src !== 'about:blank') {
        this.iframe.src = src
      }
      return
    }

    window.clearTimeout(this.rotateTimeoutId)
    this.deviceFrame.classList.add('rotating')
    this.rotateTimeoutId = window.setTimeout(() => {
      this.lastDimsKey = ''
      this.applyDimensions(state)
      this.deviceFrame.classList.remove('rotating')
    }, 190)

    this.lastOrientation = state.orientation
    const src = this.iframe.src
    if (src && src !== 'about:blank') {
      this.iframe.src = src
    }
  }

  private applyDimensions(state: ActiveState): void {
    const { device, orientation } = state
    const w = orientation === 'landscape' ? device.height : device.width
    const h = orientation === 'landscape' ? device.width : device.height

    const { maxW, maxH } = computeMaxFrameSize()
    const dimsKey = `${device.id}:${orientation}:${maxW}:${maxH}`
    if (dimsKey === this.lastDimsKey) {
      return
    }
    this.lastDimsKey = dimsKey

    const dims = getFrameDimensions(device, orientation)

    const scale = Math.min(1, maxW / dims.frameWidth, maxH / dims.frameHeight)
    const { frame, screen, topBar, camera, homeIndicator } = buildFrameStyles(
      dims,
      scale
    )

    this.deviceFrame.style.cssText = stylesToString(frame)
    this.screenInner.style.cssText = `${stylesToString(screen)};`
    this.topBar.style.cssText = stylesToString(topBar)

    applyOptionalStyle(this.camera, camera)
    applyOptionalStyle(this.homeIndicator, homeIndicator)

    this.iframe.style.cssText = `display:block;border:0;width:${w}px;height:${h}px;transform:scale(${scale});transform-origin:top left;`
  }
}

function computeMaxFrameSize(): { maxW: number; maxH: number } {
  return {
    maxW: window.innerWidth - 40,
    maxH: window.innerHeight * 0.88
  }
}

function applyOptionalStyle(
  el: HTMLElement,
  style: Record<string, string> | null | undefined
): void {
  if (!style) {
    el.style.display = 'none'
    return
  }
  el.style.cssText = stylesToString(style)
  el.style.display = ''
}
