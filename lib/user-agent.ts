import type { BrowserMode, Device } from '@/types'

const USER_AGENT_IOS_CHROME =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.0.0 Mobile/15E148 Safari/604.1'

const USER_AGENT_IOS_FIREFOX =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/124.0 Mobile/15E148 Safari/605.1.15'

const USER_AGENT_IOS_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

const USER_AGENT_IPADOS_CHROME =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.0.0 Mobile/15E148 Safari/604.1'

const USER_AGENT_IPADOS_FIREFOX =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/124.0 Mobile/15E148 Safari/605.1.15'

const USER_AGENT_IPADOS_SAFARI =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

const USER_AGENT_ANDROID_FIREFOX =
  'Mozilla/5.0 (Android 14; Mobile; rv:124.0) Gecko/124.0 Firefox/124.0'

export function buildUserAgent(device: Device, mode: BrowserMode): string {
  if (device.brand === 'Apple' && device.category === 'smartphone') {
    if (mode === 'chrome') return USER_AGENT_IOS_CHROME
    if (mode === 'firefox') return USER_AGENT_IOS_FIREFOX
    return USER_AGENT_IOS_SAFARI
  }

  if (device.brand === 'Apple' && device.category === 'tablet') {
    if (mode === 'chrome') return USER_AGENT_IPADOS_CHROME
    if (mode === 'firefox') return USER_AGENT_IPADOS_FIREFOX
    return USER_AGENT_IPADOS_SAFARI
  }

  if (mode === 'firefox') return USER_AGENT_ANDROID_FIREFOX
  return device.userAgent
}

export function isSafariUnsupported(device: Device): boolean {
  return device.brand !== 'Apple'
}
