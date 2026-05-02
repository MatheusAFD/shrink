import type { Device } from '@/types'

const UA_IOS_17 =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
const UA_IPADOS_17 =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
const UA_ANDROID_14 = (model: string) =>
  `Mozilla/5.0 (Linux; Android 14; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36`
const UA_ANDROID_TABLET = (model: string) =>
  `Mozilla/5.0 (Linux; Android 14; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36`

export const devices: Device[] = [
  {
    id: 'iphone-se-3',
    name: 'iPhone SE (3rd gen)',
    brand: 'Apple',
    category: 'smartphone',
    width: 375,
    height: 667,
    dpr: 2,
    userAgent: UA_IOS_17,
    year: 2022,
    notchType: 'none'
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    brand: 'Apple',
    category: 'smartphone',
    width: 390,
    height: 844,
    dpr: 3,
    userAgent: UA_IOS_17,
    year: 2022,
    notchType: 'notch'
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'smartphone',
    width: 393,
    height: 852,
    dpr: 3,
    userAgent: UA_IOS_17,
    year: 2023,
    notchType: 'island'
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'smartphone',
    width: 393,
    height: 852,
    dpr: 3,
    userAgent: UA_IOS_17,
    year: 2023,
    notchType: 'island'
  },
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'smartphone',
    width: 430,
    height: 932,
    dpr: 3,
    userAgent: UA_IOS_17,
    year: 2023,
    notchType: 'island'
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    brand: 'Apple',
    category: 'smartphone',
    width: 393,
    height: 852,
    dpr: 3,
    userAgent: UA_IOS_17,
    year: 2024,
    notchType: 'island'
  },
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    category: 'smartphone',
    width: 402,
    height: 874,
    dpr: 3,
    userAgent: UA_IOS_17,
    year: 2024,
    notchType: 'island'
  },
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'smartphone',
    width: 440,
    height: 956,
    dpr: 3,
    userAgent: UA_IOS_17,
    year: 2024,
    notchType: 'island'
  },

  {
    id: 'galaxy-s23',
    name: 'Galaxy S23',
    brand: 'Samsung',
    category: 'smartphone',
    width: 360,
    height: 780,
    dpr: 3,
    userAgent: UA_ANDROID_14('SM-S911B'),
    year: 2023,
    notchType: 'punch'
  },
  {
    id: 'galaxy-s24',
    name: 'Galaxy S24',
    brand: 'Samsung',
    category: 'smartphone',
    width: 360,
    height: 780,
    dpr: 3,
    userAgent: UA_ANDROID_14('SM-S921B'),
    year: 2024,
    notchType: 'punch'
  },
  {
    id: 'galaxy-s24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphone',
    width: 412,
    height: 915,
    dpr: 3.5,
    userAgent: UA_ANDROID_14('SM-S928B'),
    year: 2024,
    notchType: 'punch'
  },
  {
    id: 'galaxy-a54',
    name: 'Galaxy A54',
    brand: 'Samsung',
    category: 'smartphone',
    width: 360,
    height: 800,
    dpr: 2.625,
    userAgent: UA_ANDROID_14('SM-A546B'),
    year: 2023,
    notchType: 'punch'
  },

  {
    id: 'pixel-7',
    name: 'Pixel 7',
    brand: 'Google',
    category: 'smartphone',
    width: 412,
    height: 915,
    dpr: 2.625,
    userAgent: UA_ANDROID_14('Pixel 7'),
    year: 2022,
    notchType: 'punch'
  },
  {
    id: 'pixel-8',
    name: 'Pixel 8',
    brand: 'Google',
    category: 'smartphone',
    width: 412,
    height: 915,
    dpr: 2.625,
    userAgent: UA_ANDROID_14('Pixel 8'),
    year: 2023,
    notchType: 'punch'
  },
  {
    id: 'pixel-8-pro',
    name: 'Pixel 8 Pro',
    brand: 'Google',
    category: 'smartphone',
    width: 448,
    height: 998,
    dpr: 3,
    userAgent: UA_ANDROID_14('Pixel 8 Pro'),
    year: 2023,
    notchType: 'punch'
  },
  {
    id: 'pixel-9',
    name: 'Pixel 9',
    brand: 'Google',
    category: 'smartphone',
    width: 412,
    height: 917,
    dpr: 2.625,
    userAgent: UA_ANDROID_14('Pixel 9'),
    year: 2024,
    notchType: 'punch'
  },

  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    category: 'smartphone',
    width: 412,
    height: 915,
    dpr: 3,
    userAgent: UA_ANDROID_14('CPH2581'),
    year: 2024,
    notchType: 'punch'
  },

  {
    id: 'xiaomi-14',
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    category: 'smartphone',
    width: 393,
    height: 852,
    dpr: 3,
    userAgent: UA_ANDROID_14('2401029NC'),
    year: 2024,
    notchType: 'punch'
  },

  {
    id: 'ipad-mini-6',
    name: 'iPad mini (6th gen)',
    brand: 'Apple',
    category: 'tablet',
    width: 744,
    height: 1133,
    dpr: 2,
    userAgent: UA_IPADOS_17,
    year: 2021,
    notchType: 'none'
  },
  {
    id: 'ipad-10',
    name: 'iPad (10th gen)',
    brand: 'Apple',
    category: 'tablet',
    width: 820,
    height: 1180,
    dpr: 2,
    userAgent: UA_IPADOS_17,
    year: 2022,
    notchType: 'none'
  },
  {
    id: 'ipad-air-m2',
    name: 'iPad Air (M2)',
    brand: 'Apple',
    category: 'tablet',
    width: 820,
    height: 1180,
    dpr: 2,
    userAgent: UA_IPADOS_17,
    year: 2024,
    notchType: 'none'
  },
  {
    id: 'ipad-pro-11-m4',
    name: 'iPad Pro 11" (M4)',
    brand: 'Apple',
    category: 'tablet',
    width: 834,
    height: 1194,
    dpr: 2,
    userAgent: UA_IPADOS_17,
    year: 2024,
    notchType: 'none'
  },
  {
    id: 'ipad-pro-13-m4',
    name: 'iPad Pro 13" (M4)',
    brand: 'Apple',
    category: 'tablet',
    width: 1024,
    height: 1366,
    dpr: 2,
    userAgent: UA_IPADOS_17,
    year: 2024,
    notchType: 'none'
  },

  {
    id: 'galaxy-tab-s9',
    name: 'Galaxy Tab S9',
    brand: 'Samsung',
    category: 'tablet',
    width: 800,
    height: 1280,
    dpr: 2,
    userAgent: UA_ANDROID_TABLET('SM-X710'),
    year: 2023,
    notchType: 'none'
  }
]

export const devicesById = new Map(devices.map((d) => [d.id, d]))

export function getDevice(id: string): Device | undefined {
  return devicesById.get(id)
}
