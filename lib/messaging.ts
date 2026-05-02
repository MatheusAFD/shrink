import type { ActiveState, BrowserMode, Orientation } from '@/types'

export type Msg =
  | {
      type: 'CONTENT_ACTIVATE'
      deviceId: string
      orientation: Orientation
      browserMode: BrowserMode
    }
  | { type: 'CONTENT_DEACTIVATE' }
  | { type: 'CONTENT_TOGGLE_ORIENTATION' }
  | { type: 'CONTENT_SET_BROWSER'; browserMode: BrowserMode }
  | { type: 'CONTENT_GET_STATE' }
  | { type: 'CONTENT_READY' }
  | { type: 'OPEN_SIDEBAR'; state: ActiveState | null }
  | {
      type: 'STATE_CHANGED'
      tabId: number
      active: boolean
      state?: ActiveState
    }
  | { type: 'SHOW_FRAME'; url: string; state: ActiveState }
  | { type: 'HIDE_FRAME' }
  | { type: 'UPDATE_FRAME'; state: ActiveState }

export type MsgResponse =
  | { ok: true }
  | { ok: false; error: string }
  | { ok: true; state: ActiveState | null }
