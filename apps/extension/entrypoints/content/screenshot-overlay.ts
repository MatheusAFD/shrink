import { ICON_CLOSE, ICON_COPY, ICON_DOWNLOAD } from './icons'

export interface OverlayElements {
  overlay: HTMLElement
  region: HTMLElement
  dims: HTMLElement
  masks: {
    top: HTMLElement
    right: HTMLElement
    bottom: HTMLElement
    left: HTMLElement
  }
}

export function createOverlay(): OverlayElements {
  const overlay = document.createElement('div')
  overlay.className = 'shot-overlay'

  const top = document.createElement('div')
  top.className = 'shot-mask'
  const right = document.createElement('div')
  right.className = 'shot-mask'
  const bottom = document.createElement('div')
  bottom.className = 'shot-mask'
  const left = document.createElement('div')
  left.className = 'shot-mask'

  const region = document.createElement('div')
  region.className = 'shot-region'
  region.style.display = 'none'

  const dims = document.createElement('div')
  dims.className = 'shot-dims'
  dims.style.display = 'none'
  region.appendChild(dims)

  overlay.append(top, right, bottom, left, region)

  return { overlay, region, dims, masks: { top, right, bottom, left } }
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export function updateMasks(
  masks: OverlayElements['masks'],
  rect: Rect,
  vw: number,
  vh: number
): void {
  masks.top.style.cssText = `left:0;top:0;width:${vw}px;height:${rect.y}px;`
  masks.bottom.style.cssText = `left:0;top:${rect.y + rect.height}px;width:${vw}px;height:${Math.max(0, vh - rect.y - rect.height)}px;`
  masks.left.style.cssText = `left:0;top:${rect.y}px;width:${rect.x}px;height:${rect.height}px;`
  masks.right.style.cssText = `left:${rect.x + rect.width}px;top:${rect.y}px;width:${Math.max(0, vw - rect.x - rect.width)}px;height:${rect.height}px;`
}

export function showFullMask(
  masks: OverlayElements['masks'],
  vw: number,
  vh: number
): void {
  masks.top.style.cssText = `left:0;top:0;width:${vw}px;height:${vh}px;`
  masks.right.style.cssText = 'display:none;'
  masks.bottom.style.cssText = 'display:none;'
  masks.left.style.cssText = 'display:none;'
}

export function applyRegion(region: HTMLElement, rect: Rect): void {
  region.style.display = 'block'
  region.style.left = `${rect.x}px`
  region.style.top = `${rect.y}px`
  region.style.width = `${rect.width}px`
  region.style.height = `${rect.height}px`
}

export interface ActionsMenu {
  el: HTMLElement
  copyBtn: HTMLButtonElement
  saveBtn: HTMLButtonElement
  closeBtn: HTMLButtonElement
}

export function createActionsMenu(): ActionsMenu {
  const el = document.createElement('div')
  el.className = 'shot-actions'

  const copyBtn = document.createElement('button')
  copyBtn.type = 'button'
  copyBtn.className = 'tool-btn'
  copyBtn.title = 'Copy to clipboard'
  copyBtn.innerHTML = `${ICON_COPY}<span class="tool-btn-label">Copy</span>`

  const saveBtn = document.createElement('button')
  saveBtn.type = 'button'
  saveBtn.className = 'tool-btn'
  saveBtn.title = 'Save as PNG'
  saveBtn.innerHTML = `${ICON_DOWNLOAD}<span class="tool-btn-label">Save</span>`

  const closeBtn = document.createElement('button')
  closeBtn.type = 'button'
  closeBtn.className = 'icon-btn'
  closeBtn.title = 'Close'
  closeBtn.innerHTML = ICON_CLOSE

  el.append(copyBtn, saveBtn, closeBtn)

  return { el, copyBtn, saveBtn, closeBtn }
}

export function positionActionsMenu(
  menu: HTMLElement,
  rect: Rect,
  vw: number,
  vh: number
): void {
  const menuW = menu.offsetWidth || 180
  const menuH = menu.offsetHeight || 36
  const gap = 8

  let left = rect.x + rect.width - menuW
  let top = rect.y + rect.height + gap

  if (top + menuH > vh - 8) {
    top = rect.y - menuH - gap
  }
  if (top < 8) {
    top = Math.max(8, rect.y + rect.height - menuH - gap)
  }
  if (left < 8) {
    left = 8
  }
  if (left + menuW > vw - 8) {
    left = vw - menuW - 8
  }

  menu.style.left = `${left}px`
  menu.style.top = `${top}px`
}
