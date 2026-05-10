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
  | { type: 'OPEN_SIDEBAR'; state: ActiveState | null; pickerOpen?: boolean }
  | { type: 'CONTENT_PICKER_STATE'; open: boolean }
  | {
      type: 'STATE_CHANGED'
      tabId: number
      active: boolean
      state?: ActiveState
    }
  | { type: 'SHOW_FRAME'; url: string; state: ActiveState }
  | { type: 'HIDE_FRAME' }
  | { type: 'UPDATE_FRAME'; state: ActiveState }
  | { type: 'CONTENT_CAPTURE_TAB' }

export type MsgResponse =
  | { ok: true }
  | { ok: false; error: string }
  | { ok: true; state: ActiveState | null }
  | { ok: true; dataUrl: string }
