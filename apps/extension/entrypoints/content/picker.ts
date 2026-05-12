import { MINI_H, MINI_W } from '@/lib/constants/frame'
import { BRAND_ORDER } from '@/lib/constants/ui'
import { devices } from '@/lib/devices'
import { buildFrameStyles, scaleFrameTo, stylesToString } from '@/lib/frame-css'
import type { Device, Orientation } from '@/types'
import { ICON_CLOSE, ICON_SEARCH } from './icons'

interface CardEntry {
  el: HTMLElement
  device: Device
  nameLC: string
  brandLC: string
}

interface BrandSection {
  section: HTMLElement
  cards: CardEntry[]
}

export type DevicePickerActivate = (device: Device) => void

export class DevicePicker {
  readonly el: HTMLElement
  private readonly listEl: HTMLElement
  private readonly noResultsEl: HTMLElement
  private readonly cards: CardEntry[] = []
  private readonly brandSections: BrandSection[] = []
  private readonly onActivate: DevicePickerActivate
  private isOpen = false

  constructor(container: HTMLElement, onActivate: DevicePickerActivate) {
    this.onActivate = onActivate

    const picker = document.createElement('div')
    picker.className = 'picker'

    const header = document.createElement('div')
    header.className = 'picker-header'

    const title = document.createElement('span')
    title.className = 'picker-title'
    title.textContent = 'Devices'
    header.appendChild(title)

    const closeBtn = document.createElement('button')
    closeBtn.className = 'icon-btn'
    closeBtn.title = 'Close panel'
    closeBtn.innerHTML = ICON_CLOSE
    closeBtn.addEventListener('click', () => this.close())
    header.appendChild(closeBtn)

    picker.appendChild(header)

    const searchWrap = document.createElement('div')
    searchWrap.className = 'picker-search'

    const searchIcon = document.createElement('span')
    searchIcon.className = 'search-icon'
    searchIcon.innerHTML = ICON_SEARCH
    searchWrap.appendChild(searchIcon)

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Search device...'
    let debounceId = 0
    input.addEventListener('input', () => {
      clearTimeout(debounceId)
      debounceId = window.setTimeout(() => this.filter(input.value), 16)
    })
    searchWrap.appendChild(input)
    picker.appendChild(searchWrap)

    const list = document.createElement('div')
    list.className = 'picker-list'

    const noResults = document.createElement('div')
    noResults.className = 'no-results'
    noResults.style.display = 'none'
    noResults.textContent = 'No devices found'
    list.appendChild(noResults)

    this.el = picker
    this.listEl = list
    this.noResultsEl = noResults

    this.buildList()
    picker.appendChild(list)
    container.appendChild(picker)
  }

  open(): void {
    this.isOpen = true
    this.el.classList.add('open')
  }

  close(): void {
    this.isOpen = false
    this.el.classList.remove('open')
  }

  toggle(): void {
    if (this.isOpen) {
      this.close()
      return
    }
    this.open()
  }

  get opened(): boolean {
    return this.isOpen
  }

  highlightActive(deviceId: string | null): void {
    for (const entry of this.cards) {
      entry.el.classList.toggle('active', entry.device.id === deviceId)
    }
  }

  private filter(query: string): void {
    const q = query.trim().toLowerCase()
    let anyVisible = false

    for (const { section, cards } of this.brandSections) {
      let brandVisible = false
      for (const entry of cards) {
        const match =
          !q || entry.nameLC.includes(q) || entry.brandLC.includes(q)
        entry.el.style.display = match ? '' : 'none'
        if (match) {
          brandVisible = true
        }
      }
      section.style.display = brandVisible ? '' : 'none'
      if (brandVisible) {
        anyVisible = true
      }
    }

    this.noResultsEl.style.display = anyVisible ? 'none' : ''
  }

  private buildList(): void {
    const grouped = new Map<string, Device[]>()
    for (const d of devices) {
      const arr = grouped.get(d.brand) ?? []
      arr.push(d)
      grouped.set(d.brand, arr)
    }

    for (const brand of BRAND_ORDER) {
      const list = grouped.get(brand)
      if (!list || list.length === 0) {
        continue
      }

      const section = document.createElement('div')

      const label = document.createElement('div')
      label.className = 'brand-label'
      label.textContent = brand
      section.appendChild(label)

      const grid = document.createElement('div')
      grid.className = 'device-grid'

      const sectionCards: CardEntry[] = []

      for (const device of list) {
        const card = this.createCard(device)
        grid.appendChild(card)

        const entry: CardEntry = {
          el: card,
          device,
          nameLC: device.name.toLowerCase(),
          brandLC: device.brand.toLowerCase()
        }
        sectionCards.push(entry)
        this.cards.push(entry)
      }

      section.appendChild(grid)
      this.listEl.appendChild(section)
      this.brandSections.push({ section, cards: sectionCards })
    }
  }

  private createCard(device: Device): HTMLButtonElement {
    const card = document.createElement('button')
    card.className = 'device-card'
    card.type = 'button'
    card.appendChild(renderMiniFrame(device))

    const name = document.createElement('div')
    name.className = 'device-name'
    name.textContent = device.name
    card.appendChild(name)

    const specs = document.createElement('div')
    specs.className = 'device-specs'
    specs.textContent = `${device.width}×${device.height} @${device.dpr}x`
    card.appendChild(specs)

    card.addEventListener('click', () => this.onActivate(device))
    return card
  }
}

function renderMiniFrame(device: Device): HTMLElement {
  const orientation: Orientation = 'portrait'
  const { dims, scale } = scaleFrameTo(device, orientation, MINI_W, MINI_H)
  const { frame, screen, topBar, camera, homeIndicator } = buildFrameStyles(
    dims,
    scale
  )

  const el = document.createElement('div')
  el.style.cssText = stylesToString(frame)

  const topEl = document.createElement('div')
  topEl.style.cssText = stylesToString(topBar)
  if (camera) {
    const camEl = document.createElement('div')
    camEl.style.cssText = stylesToString(camera)
    topEl.appendChild(camEl)
  }
  el.appendChild(topEl)

  const screenEl = document.createElement('div')
  screenEl.style.cssText = stylesToString(screen)
  el.appendChild(screenEl)

  if (homeIndicator) {
    const hiEl = document.createElement('div')
    hiEl.style.cssText = stylesToString(homeIndicator)
    el.appendChild(hiEl)
  }

  return el
}
