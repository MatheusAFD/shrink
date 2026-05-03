import { getActivator } from '@/lib/activator'
import {
  DEFAULT_DEVICE_ID,
  STORAGE_ACTIVE_TABS,
  STORAGE_BROWSER_MODE,
  STORAGE_DEVICE_ID,
  STORAGE_ORIENTATION
} from '@/lib/constants/storage'
import { devicesById } from '@/lib/devices'
import type { Msg, MsgResponse } from '@/lib/messaging'
import type { ActiveState, BrowserMode, Orientation } from '@/types'

interface PersistedActiveState {
  deviceId: string
  orientation: Orientation
  browserMode: BrowserMode
}

const activeByTab = new Map<number, ActiveState>()
let rehydrated: Promise<void> | null = null

async function persistActiveTabs(): Promise<void> {
  const serialized: Record<string, PersistedActiveState> = {}
  for (const [tabId, state] of activeByTab) {
    serialized[String(tabId)] = {
      deviceId: state.device.id,
      orientation: state.orientation,
      browserMode: state.browserMode
    }
  }
  await browser.storage.session.set({ [STORAGE_ACTIVE_TABS]: serialized })
}

async function loadActiveTabs(): Promise<void> {
  const stored = await browser.storage.session.get(STORAGE_ACTIVE_TABS)
  const raw = stored[STORAGE_ACTIVE_TABS] as
    | Record<string, PersistedActiveState>
    | undefined
  if (!raw) return
  for (const [tabIdStr, persisted] of Object.entries(raw)) {
    const tabId = Number(tabIdStr)
    if (!Number.isFinite(tabId)) continue
    const device = devicesById.get(persisted.deviceId)
    if (!device) continue
    activeByTab.set(tabId, {
      device,
      orientation: persisted.orientation,
      browserMode: persisted.browserMode
    })
  }
}

async function sendToTab(tabId: number, msg: Msg): Promise<void> {
  try {
    await browser.tabs.sendMessage(tabId, msg)
  } catch {}
}

async function broadcastState(tabId: number) {
  const state = activeByTab.get(tabId) ?? null
  await sendToTab(tabId, {
    type: 'STATE_CHANGED',
    tabId,
    active: !!state,
    state: state ?? undefined
  })
}

async function persistLast(state: ActiveState) {
  await browser.storage.local.set({
    [STORAGE_DEVICE_ID]: state.device.id,
    [STORAGE_ORIENTATION]: state.orientation,
    [STORAGE_BROWSER_MODE]: state.browserMode
  })
}

async function loadLastState(): Promise<ActiveState> {
  const prefs = await browser.storage.local.get([
    STORAGE_DEVICE_ID,
    STORAGE_ORIENTATION,
    STORAGE_BROWSER_MODE
  ])
  const deviceId = prefs[STORAGE_DEVICE_ID] as string | undefined
  const orientation =
    (prefs[STORAGE_ORIENTATION] as Orientation | undefined) ?? 'portrait'
  const browserMode =
    (prefs[STORAGE_BROWSER_MODE] as BrowserMode | undefined) ?? 'chrome'
  const device =
    (deviceId ? devicesById.get(deviceId) : undefined) ??
    devicesById.get(DEFAULT_DEVICE_ID)
  if (!device) throw new Error('Default device not found')
  return { device, orientation, browserMode }
}

async function getTabUrl(tabId: number): Promise<string | null> {
  try {
    const tab = await browser.tabs.get(tabId)
    return tab.url ?? null
  } catch {
    return null
  }
}

async function activate(tabId: number, state: ActiveState): Promise<void> {
  const activator = await getActivator()
  if (activeByTab.has(tabId)) {
    await activator.update(tabId, state)
  } else {
    await activator.activate(tabId, state)
  }
  activeByTab.set(tabId, state)
  await persistLast(state)
  await persistActiveTabs()

  const url = await getTabUrl(tabId)
  if (url) await sendToTab(tabId, { type: 'SHOW_FRAME', url, state })

  await broadcastState(tabId)
}

async function deactivate(tabId: number): Promise<void> {
  const activator = await getActivator()
  await activator.deactivate(tabId)
  activeByTab.delete(tabId)
  await persistActiveTabs()
  await sendToTab(tabId, { type: 'HIDE_FRAME' })
  await broadcastState(tabId)
}

async function handle(
  msg: Msg,
  sender: Browser.runtime.MessageSender
): Promise<MsgResponse> {
  if (rehydrated) await rehydrated
  switch (msg.type) {
    case 'CONTENT_ACTIVATE': {
      const tabId = sender.tab?.id
      if (tabId == null) return { ok: false, error: 'no sender tab' }
      const device = devicesById.get(msg.deviceId)
      if (!device) return { ok: false, error: 'unknown device' }
      await activate(tabId, {
        device,
        orientation: msg.orientation,
        browserMode: msg.browserMode
      })
      return { ok: true }
    }

    case 'CONTENT_DEACTIVATE': {
      const tabId = sender.tab?.id
      if (tabId == null) return { ok: false, error: 'no sender tab' }
      await deactivate(tabId)
      return { ok: true }
    }

    case 'CONTENT_TOGGLE_ORIENTATION': {
      const tabId = sender.tab?.id
      if (tabId == null) return { ok: false, error: 'no sender tab' }
      const current = activeByTab.get(tabId)
      if (!current) return { ok: false, error: 'tab not active' }
      await activate(tabId, {
        ...current,
        orientation:
          current.orientation === 'portrait' ? 'landscape' : 'portrait'
      })
      return { ok: true }
    }

    case 'CONTENT_SET_BROWSER': {
      const tabId = sender.tab?.id
      if (tabId == null) return { ok: false, error: 'no sender tab' }
      const current = activeByTab.get(tabId)
      if (!current) return { ok: false, error: 'tab not active' }
      await activate(tabId, { ...current, browserMode: msg.browserMode })
      return { ok: true }
    }

    case 'CONTENT_GET_STATE': {
      const tabId = sender.tab?.id
      if (tabId == null) return { ok: false, error: 'no sender tab' }
      const state = activeByTab.get(tabId) ?? null
      return { ok: true, state }
    }

    case 'CONTENT_READY': {
      const tabId = sender.tab?.id
      if (tabId == null) return { ok: true }
      const state = activeByTab.get(tabId)
      if (!state) return { ok: true }
      const url = await getTabUrl(tabId)
      if (url) await sendToTab(tabId, { type: 'SHOW_FRAME', url, state })
      await sendToTab(tabId, { type: 'OPEN_SIDEBAR', state })
      return { ok: true }
    }

    default:
      return { ok: false, error: `Unhandled message: ${(msg as Msg).type}` }
  }
}

export default defineBackground(() => {
  rehydrated = loadActiveTabs()

  void getActivator().then((activator) => {
    activator.onExternalDetach((tabId) => {
      activeByTab.delete(tabId)
      void persistActiveTabs()
      void sendToTab(tabId, { type: 'HIDE_FRAME' })
      void broadcastState(tabId)
    })
  })

  browser.action.onClicked.addListener(async (tab) => {
    const tabId = tab.id
    if (tabId == null) return
    if (rehydrated) await rehydrated

    const current = activeByTab.get(tabId)
    if (current) {
      await sendToTab(tabId, { type: 'OPEN_SIDEBAR', state: current })
      return
    }

    const state = await loadLastState()
    await activate(tabId, state)
    await sendToTab(tabId, {
      type: 'OPEN_SIDEBAR',
      state: activeByTab.get(tabId) ?? state
    })
  })

  browser.runtime.onMessage.addListener((msg: Msg, sender, sendResponse) => {
    handle(msg, sender).then(sendResponse, (err: Error) => {
      sendResponse({ ok: false, error: err.message } satisfies MsgResponse)
    })
    return true
  })

  browser.tabs.onRemoved.addListener((tabId) => {
    if (!activeByTab.has(tabId)) return
    activeByTab.delete(tabId)
    void persistActiveTabs()
    void getActivator().then((a) => a.deactivate(tabId).catch(() => {}))
  })
})
