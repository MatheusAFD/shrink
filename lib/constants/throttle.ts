export type ThrottlePreset = 'none' | 'fast-4g' | 'slow-4g' | 'slow-3g'

export interface ThrottleConditions {
  offline: boolean
  latency: number
  downloadThroughput: number
  uploadThroughput: number
}

export interface ThrottlePresetDef {
  id: ThrottlePreset
  label: string
  conditions: ThrottleConditions
}

export const THROTTLE_PRESETS: ThrottlePresetDef[] = [
  {
    id: 'none',
    label: 'No throttling',
    conditions: {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1
    }
  },
  // Values mirror Chrome DevTools (Chromium NetworkManager throttling presets).
  // Throughput divided by 0.9 to compensate TCP overhead (matches DevTools).
  {
    id: 'fast-4g',
    label: 'Fast 4G',
    conditions: {
      offline: false,
      latency: 20,
      downloadThroughput: (15000 * 1024) / 8 / 0.9,
      uploadThroughput: (7500 * 1024) / 8 / 0.9
    }
  },
  {
    id: 'slow-4g',
    label: 'Slow 4G',
    conditions: {
      offline: false,
      latency: 150,
      downloadThroughput: (1600 * 1024) / 8 / 0.9,
      uploadThroughput: (750 * 1024) / 8 / 0.9
    }
  },
  {
    id: 'slow-3g',
    label: 'Slow 3G',
    conditions: {
      offline: false,
      latency: 400,
      downloadThroughput: (400 * 1024) / 8 / 0.9,
      uploadThroughput: (400 * 1024) / 8 / 0.9
    }
  }
]

export const throttleById = new Map<ThrottlePreset, ThrottlePresetDef>(
  THROTTLE_PRESETS.map((p) => [p.id, p])
)
