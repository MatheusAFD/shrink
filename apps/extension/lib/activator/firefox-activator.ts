import { buildUserAgent } from '@/lib/user-agent'
import type { ActiveState, ColorScheme } from '@/types'
import type { Activator } from './index'

const RULE_BASE = 1_000_000
const RULES_PER_TAB = 4

function ruleIdsFor(tabId: number): number[] {
  const start = RULE_BASE + tabId * RULES_PER_TAB
  return Array.from({ length: RULES_PER_TAB }, (_, i) => start + i)
}

type DnrRule = Parameters<
  typeof browser.declarativeNetRequest.updateDynamicRules
>[0] extends { addRules?: (infer R)[] | undefined }
  ? R
  : never

function buildRules(tabId: number, state: ActiveState): DnrRule[] {
  const [uaId, xfoId, cspId, frameOptId] = ruleIdsFor(tabId)
  const ua = buildUserAgent(state.device, state.browserMode)

  return [
    {
      id: uaId,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [{ header: 'User-Agent', operation: 'set', value: ua }]
      },
      condition: {
        tabIds: [tabId],
        resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest', 'script']
      }
    },
    {
      id: xfoId,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          { header: 'X-Frame-Options', operation: 'remove' },
          { header: 'Content-Security-Policy', operation: 'remove' }
        ]
      },
      condition: {
        tabIds: [tabId],
        resourceTypes: ['main_frame', 'sub_frame']
      }
    },
    {
      id: cspId,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          { header: 'Content-Security-Policy-Report-Only', operation: 'remove' }
        ]
      },
      condition: {
        tabIds: [tabId],
        resourceTypes: ['main_frame', 'sub_frame']
      }
    },
    {
      id: frameOptId,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [{ header: 'Permissions-Policy', operation: 'remove' }]
      },
      condition: {
        tabIds: [tabId],
        resourceTypes: ['main_frame', 'sub_frame']
      }
    }
  ]
}

// Network throttling: not supported on Firefox extensions
// (declarativeNetRequest can't shape throughput; no debugger API equivalent).
// state.throttle is intentionally ignored here.
export class FirefoxActivator implements Activator {
  async activate(tabId: number, state: ActiveState): Promise<void> {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsFor(tabId),
      addRules: buildRules(tabId, state)
    })
  }

  async deactivate(tabId: number): Promise<void> {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsFor(tabId),
      addRules: []
    })
  }

  async update(tabId: number, state: ActiveState): Promise<void> {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsFor(tabId),
      addRules: buildRules(tabId, state)
    })
  }

  async updateNetwork(): Promise<void> {
    // throttle: not supported on Firefox extensions
  }

  // color scheme emulation via CDP not available in Firefox extensions
  async updateColorScheme(
    _tabId: number,
    _scheme: ColorScheme
  ): Promise<void> {}

  onExternalDetach(_handler: (tabId: number) => void): void {}
}

export function clearTabRules(tabId: number): Promise<void> {
  return browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIdsFor(tabId),
    addRules: []
  })
}
