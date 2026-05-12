import type { ThrottlePreset } from '@/lib/constants/throttle'

export type Brand =
  | 'Apple'
  | 'Samsung'
  | 'Google'
  | 'Xiaomi'
  | 'OnePlus'
  | 'Other'

export type Category = 'smartphone' | 'tablet'

export type Orientation = 'portrait' | 'landscape'

export type NotchType = 'island' | 'notch' | 'punch' | 'none'

export type BrowserMode = 'chrome' | 'firefox' | 'safari'

export interface Device {
  id: string
  name: string
  brand: Brand
  category: Category
  width: number
  height: number
  dpr: number
  userAgent: string
  year: number
  notchType: NotchType
}

export interface ActiveState {
  device: Device
  orientation: Orientation
  browserMode: BrowserMode
  throttle: ThrottlePreset
}
