export type DeviceChipData = {
  name: string
  brand: 'Apple' | 'Samsung' | 'Google' | 'OnePlus' | 'Xiaomi'
  category: 'phone' | 'tablet'
}

export const deviceChips: DeviceChipData[] = [
  { name: 'iPhone SE (3rd gen)', brand: 'Apple', category: 'phone' },
  { name: 'iPhone 14', brand: 'Apple', category: 'phone' },
  { name: 'iPhone 15', brand: 'Apple', category: 'phone' },
  { name: 'iPhone 15 Pro', brand: 'Apple', category: 'phone' },
  { name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'phone' },
  { name: 'iPhone 16', brand: 'Apple', category: 'phone' },
  { name: 'iPhone 16 Pro', brand: 'Apple', category: 'phone' },
  { name: 'iPhone 16 Pro Max', brand: 'Apple', category: 'phone' },
  { name: 'Galaxy S23', brand: 'Samsung', category: 'phone' },
  { name: 'Galaxy S24', brand: 'Samsung', category: 'phone' },
  { name: 'Galaxy S24 Ultra', brand: 'Samsung', category: 'phone' },
  { name: 'Galaxy A54', brand: 'Samsung', category: 'phone' },
  { name: 'Pixel 7', brand: 'Google', category: 'phone' },
  { name: 'Pixel 8', brand: 'Google', category: 'phone' },
  { name: 'Pixel 8 Pro', brand: 'Google', category: 'phone' },
  { name: 'Pixel 9', brand: 'Google', category: 'phone' },
  { name: 'OnePlus 12', brand: 'OnePlus', category: 'phone' },
  { name: 'Xiaomi 14', brand: 'Xiaomi', category: 'phone' },
  { name: 'iPad mini (6th gen)', brand: 'Apple', category: 'tablet' },
  { name: 'iPad (10th gen)', brand: 'Apple', category: 'tablet' },
  { name: 'iPad Air (M2)', brand: 'Apple', category: 'tablet' },
  { name: 'iPad Pro 11" (M4)', brand: 'Apple', category: 'tablet' },
  { name: 'iPad Pro 13" (M4)', brand: 'Apple', category: 'tablet' },
  { name: 'Galaxy Tab S9', brand: 'Samsung', category: 'tablet' }
]

export const throttlePresets = [
  { label: 'No throttling', ms: 0, mbps: '—' },
  { label: 'Fast 4G', ms: 20, mbps: '15 / 7.5' },
  { label: 'Slow 4G', ms: 150, mbps: '1.6 / 0.75' },
  { label: 'Slow 3G', ms: 400, mbps: '0.4 / 0.4' }
]
