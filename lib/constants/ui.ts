import type { Brand, BrowserMode } from '@/types'

export const BRAND_ORDER: Brand[] = [
  'Apple',
  'Samsung',
  'Google',
  'OnePlus',
  'Xiaomi',
  'Other'
]

export const BROWSER_MODES: BrowserMode[] = ['chrome', 'firefox', 'safari']

export const ROOT_ID = '__shrink_root__'
export const BLANK_URL = 'about:blank'

export const Z_INDEX_ROOT = 2147483647
export const Z_INDEX_BACKDROP = 2147483640
export const Z_INDEX_PICKER = 10
export const Z_INDEX_BRAND_LABEL = 1
export const Z_INDEX_SHOT_OVERLAY = 20
export const Z_INDEX_SHOT_ACTIONS = 50
