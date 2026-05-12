import type { Msg, MsgResponse } from '@/lib/messaging'
import type { ActiveState } from '@/types'
import {
  type ActionsMenu,
  applyRegion,
  createActionsMenu,
  createOverlay,
  type OverlayElements,
  positionActionsMenu,
  type Rect,
  showFullMask,
  updateMasks
} from './screenshot-overlay'

export type CaptureKind = 'frame' | 'region' | null

export interface ScreenshotControllerOptions {
  shrinkRoot: HTMLElement
  getFrameEl: () => HTMLElement | null
  getState: () => ActiveState | null
  setCapturing: (kind: CaptureKind) => void
}

type Mode = 'idle' | 'selecting' | 'menu'

export class ScreenshotController {
  private readonly shrinkRoot: HTMLElement
  private readonly getFrameEl: () => HTMLElement | null
  private readonly getState: () => ActiveState | null
  private readonly setCapturing: (kind: CaptureKind) => void

  private mode: Mode = 'idle'
  private currentKind: CaptureKind = null
  private overlayEls: OverlayElements | null = null
  private actions: ActionsMenu | null = null
  private dragStart: { x: number; y: number } | null = null
  private currentRect: Rect | null = null
  private currentBlob: Blob | null = null
  private resetLabelTimeout: number | undefined

  private readonly onMouseDown = (e: MouseEvent) => this.handleMouseDown(e)
  private readonly onMouseMove = (e: MouseEvent) => this.handleMouseMove(e)
  private readonly onMouseUp = (e: MouseEvent) => this.handleMouseUp(e)
  private readonly onKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e)

  constructor(opts: ScreenshotControllerOptions) {
    this.shrinkRoot = opts.shrinkRoot
    this.getFrameEl = opts.getFrameEl
    this.getState = opts.getState
    this.setCapturing = opts.setCapturing
  }

  startRegion(): void {
    if (this.mode !== 'idle') {
      return
    }
    if (!this.getState()) {
      return
    }

    this.mode = 'selecting'
    this.currentKind = 'region'
    this.mountOverlay()
    if (!this.overlayEls) {
      return
    }

    const vw = window.innerWidth
    const vh = window.innerHeight
    showFullMask(this.overlayEls.masks, vw, vh)

    this.overlayEls.overlay.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('keydown', this.onKeyDown)
  }

  async startFrame(): Promise<void> {
    if (this.mode !== 'idle') {
      return
    }
    const frameEl = this.getFrameEl()
    if (!frameEl || !this.getState()) {
      return
    }

    const rect = rectFromDom(frameEl.getBoundingClientRect())
    if (rect.width < 4 || rect.height < 4) {
      return
    }

    this.mode = 'selecting'
    this.currentKind = 'frame'
    this.mountOverlay()
    if (!this.overlayEls) {
      return
    }
    window.addEventListener('keydown', this.onKeyDown)

    applyRegion(this.overlayEls.region, rect)
    updateMasks(
      this.overlayEls.masks,
      rect,
      window.innerWidth,
      window.innerHeight
    )

    await this.captureAndShow(rect)
  }

  dispose(): void {
    window.clearTimeout(this.resetLabelTimeout)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('keydown', this.onKeyDown)
    if (this.overlayEls) {
      this.overlayEls.overlay.removeEventListener('mousedown', this.onMouseDown)
      this.overlayEls.overlay.remove()
      this.overlayEls = null
    }
    if (this.actions) {
      this.actions.el.remove()
      this.actions = null
    }
    this.dragStart = null
    this.currentRect = null
    this.currentBlob = null
    this.currentKind = null
    this.mode = 'idle'
  }

  private mountOverlay(): void {
    const els = createOverlay()
    this.shrinkRoot.appendChild(els.overlay)
    this.overlayEls = els
  }

  private handleMouseDown(e: MouseEvent): void {
    if (this.mode !== 'selecting' || !this.overlayEls) {
      return
    }
    e.preventDefault()
    this.dragStart = { x: e.clientX, y: e.clientY }
    const rect = { x: e.clientX, y: e.clientY, width: 0, height: 0 }
    this.currentRect = rect
    applyRegion(this.overlayEls.region, rect)
    this.overlayEls.dims.style.display = 'block'
    this.overlayEls.dims.textContent = '0 × 0'
    updateMasks(
      this.overlayEls.masks,
      rect,
      window.innerWidth,
      window.innerHeight
    )
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.dragStart || !this.overlayEls) {
      return
    }
    const rect = computeRect(this.dragStart, { x: e.clientX, y: e.clientY })
    this.currentRect = rect
    applyRegion(this.overlayEls.region, rect)
    this.overlayEls.dims.style.display = 'block'
    this.overlayEls.dims.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`
    updateMasks(
      this.overlayEls.masks,
      rect,
      window.innerWidth,
      window.innerHeight
    )
  }

  private async handleMouseUp(_e: MouseEvent): Promise<void> {
    if (!this.dragStart) {
      return
    }
    this.dragStart = null
    const rect = this.currentRect
    if (!rect || rect.width < 4 || rect.height < 4) {
      this.dispose()
      return
    }
    if (this.overlayEls) {
      this.overlayEls.dims.style.display = 'none'
    }
    await this.captureAndShow(rect)
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.dispose()
    }
  }

  private async captureAndShow(rect: Rect): Promise<void> {
    this.setCapturing(this.currentKind)
    await waitTwoFrames()

    let res: MsgResponse | undefined
    try {
      res = (await browser.runtime.sendMessage({
        type: 'CONTENT_CAPTURE_TAB'
      } satisfies Msg)) as MsgResponse
    } finally {
      this.setCapturing(null)
    }

    if (!res?.ok || !('dataUrl' in res)) {
      this.dispose()
      return
    }

    const blob = await cropDataUrl(res.dataUrl, rect)
    if (!blob) {
      this.dispose()
      return
    }

    this.currentBlob = blob
    this.currentRect = rect
    this.mode = 'menu'
    this.showActions(rect)
  }

  private showActions(rect: Rect): void {
    if (!this.overlayEls) {
      return
    }
    const menu = createActionsMenu()
    this.actions = menu
    this.shrinkRoot.appendChild(menu.el)
    positionActionsMenu(menu.el, rect, window.innerWidth, window.innerHeight)

    menu.copyBtn.addEventListener('click', () => void this.copyToClipboard())
    menu.saveBtn.addEventListener('click', () => this.downloadPng())
    menu.closeBtn.addEventListener('click', () => this.dispose())
  }

  private async copyToClipboard(): Promise<void> {
    if (!this.currentBlob || !this.actions) {
      return
    }
    const label = this.actions.copyBtn.querySelector('.tool-btn-label')
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': this.currentBlob })
      ])
      if (label) {
        label.textContent = 'Copied'
        window.clearTimeout(this.resetLabelTimeout)
        this.resetLabelTimeout = window.setTimeout(() => {
          if (label) {
            label.textContent = 'Copy'
          }
        }, 1500)
      }
    } catch {
      this.downloadPng()
      if (label) {
        label.textContent = 'Saved instead'
        window.clearTimeout(this.resetLabelTimeout)
        this.resetLabelTimeout = window.setTimeout(() => {
          if (label) {
            label.textContent = 'Copy'
          }
        }, 1800)
      }
    }
  }

  private downloadPng(): void {
    if (!this.currentBlob) {
      return
    }
    const state = this.getState()
    const deviceId = state?.device.id ?? 'shot'
    const url = URL.createObjectURL(this.currentBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shrink-${deviceId}-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }
}

function rectFromDom(domRect: DOMRect): Rect {
  return {
    x: domRect.left,
    y: domRect.top,
    width: domRect.width,
    height: domRect.height
  }
}

function computeRect(
  start: { x: number; y: number },
  end: { x: number; y: number }
): Rect {
  const x = Math.min(start.x, end.x)
  const y = Math.min(start.y, end.y)
  const width = Math.abs(end.x - start.x)
  const height = Math.abs(end.y - start.y)
  return { x, y, width, height }
}

function waitTwoFrames(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

async function cropDataUrl(dataUrl: string, rect: Rect): Promise<Blob | null> {
  const img = new Image()
  img.src = dataUrl
  try {
    await img.decode()
  } catch {
    return null
  }

  const scaleX = img.naturalWidth / window.innerWidth
  const scaleY = img.naturalHeight / window.innerHeight

  const sx = Math.max(0, Math.round(rect.x * scaleX))
  const sy = Math.max(0, Math.round(rect.y * scaleY))
  const sw = Math.max(
    1,
    Math.min(img.naturalWidth - sx, Math.round(rect.width * scaleX))
  )
  const sh = Math.max(
    1,
    Math.min(img.naturalHeight - sy, Math.round(rect.height * scaleY))
  )

  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return null
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)

  return await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}
