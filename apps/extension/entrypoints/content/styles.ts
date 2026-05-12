import { COLORS } from '@/lib/constants/colors'
import {
  Z_INDEX_BACKDROP,
  Z_INDEX_BRAND_LABEL,
  Z_INDEX_PICKER,
  Z_INDEX_SHOT_ACTIONS,
  Z_INDEX_SHOT_OVERLAY
} from '@/lib/constants/ui'

export const STYLE = `
  :host { all: initial; font-family: ui-sans-serif, system-ui, sans-serif; }
  * { box-sizing: border-box; }

  .shrink-root {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.88);
    z-index: ${Z_INDEX_BACKDROP};
    display: none;
    align-items: center;
    justify-content: center;
  }
  .shrink-root.visible { display: flex; }

  .picker {
    position: absolute; top: 0; right: 0; bottom: 0; width: 340px;
    background: ${COLORS.bg};
    border-left: 1px solid ${COLORS.bgSubtle};
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 220ms cubic-bezier(0.4,0,0.2,1);
    z-index: ${Z_INDEX_PICKER};
    pointer-events: all;
    overflow: hidden;
  }
  .picker.open { transform: translateX(0); }

  .picker-header {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 12px 12px;
    border-bottom: 1px solid ${COLORS.bgSubtle};
    flex-shrink: 0;
  }
  .picker-title {
    flex: 1; font-size: 13px; font-weight: 600;
    color: ${COLORS.textPrimary}; letter-spacing: -0.01em;
  }
  .icon-btn {
    all: unset; cursor: pointer; padding: 5px; border-radius: 6px;
    color: ${COLORS.textFaint}; line-height: 0; display: flex; align-items: center;
    transition: background 120ms, color 120ms;
  }
  .icon-btn:hover { background: ${COLORS.bgSubtle}; color: ${COLORS.textPrimary}; }

  .picker-search {
    padding: 10px 12px;
    border-bottom: 1px solid ${COLORS.bgSubtle};
    flex-shrink: 0; position: relative;
  }
  .picker-search input {
    all: unset; width: 100%; font-size: 12px; color: ${COLORS.textPrimary};
    background: ${COLORS.bgElevated}; border: 1px solid ${COLORS.border}; border-radius: 7px;
    padding: 7px 10px 7px 32px;
  }
  .picker-search input::placeholder { color: ${COLORS.textDisabled}; }
  .picker-search input:focus { border-color: #3f3f46; outline: none; }
  .search-icon {
    position: absolute; left: 22px; top: 50%; transform: translateY(-50%);
    color: ${COLORS.textDisabled}; pointer-events: none; line-height: 0;
  }

  .picker-list {
    flex: 1; overflow-y: auto; overflow-x: hidden;
  }
  .picker-list::-webkit-scrollbar { width: 4px; }
  .picker-list::-webkit-scrollbar-track { background: transparent; }
  .picker-list::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }

  .brand-label {
    position: sticky; top: 0;
    background: rgba(9,9,11,0.96); backdrop-filter: blur(4px);
    padding: 8px 12px 4px;
    font-size: 9px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: ${COLORS.textDisabled};
    border-bottom: 1px solid ${COLORS.bgElevated};
    z-index: ${Z_INDEX_BRAND_LABEL};
  }
  .device-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 5px; padding: 8px;
  }
  .device-card {
    all: unset; cursor: pointer;
    display: flex; flex-direction: column; align-items: center;
    gap: 5px; padding: 9px 6px 7px;
    border-radius: 9px; border: 1px solid transparent;
    text-align: center; transition: background 120ms, border-color 120ms;
  }
  .device-card:hover { background: ${COLORS.bgElevated}; }
  .device-card.active { background: ${COLORS.bgElevated}; border-color: ${COLORS.accent}; }
  .device-name {
    font-size: 10.5px; font-weight: 500; color: ${COLORS.textSecondary};
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 100%; line-height: 1.3;
  }
  .device-specs {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 9px; color: ${COLORS.textDisabled}; line-height: 1.2;
  }
  .no-results {
    padding: 32px 16px; text-align: center;
    font-size: 12px; color: ${COLORS.textDisabled};
  }

  .stage {
    display: flex; flex-direction: column; align-items: center;
    gap: 12px; pointer-events: none;
    max-width: calc(100vw - 40px);
    max-height: calc(100vh - 40px);
  }

  .toolbar {
    position: relative;
    display: flex; align-items: center; gap: 6px;
    background: rgba(24,24,27,0.92);
    backdrop-filter: blur(12px);
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 6px 8px;
    pointer-events: all;
    flex-shrink: 0;
    z-index: 40;
  }

  .tool-divider {
    width: 1px; height: 18px; background: ${COLORS.border}; flex-shrink: 0; margin: 0 2px;
  }

  .tool-btn {
    all: unset; cursor: pointer; display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 500; padding: 5px 9px;
    border-radius: 6px; color: ${COLORS.textMuted};
    transition: background 120ms, color 120ms;
    white-space: nowrap; line-height: 0;
    pointer-events: all;
  }
  .tool-btn:hover { background: ${COLORS.border}; color: ${COLORS.textPrimary}; }
  .tool-btn.active { background: ${COLORS.bgSubtle}; color: ${COLORS.textPrimary}; }
  .tool-btn.danger:hover { color: ${COLORS.danger}; background: ${COLORS.bgSubtle}; }
  .tool-btn-label { line-height: 1; font-size: 11px; font-weight: 500; }

  .throttle-dropdown {
    position: relative; display: flex; align-items: center;
  }
  .throttle-btn {
    all: unset; cursor: pointer;
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 500; padding: 5px 8px;
    border-radius: 6px; color: ${COLORS.textMuted};
    transition: background 120ms, color 120ms;
    white-space: nowrap; line-height: 0;
  }
  .throttle-btn:hover { background: ${COLORS.border}; color: ${COLORS.textPrimary}; }
  .throttle-btn.open { background: ${COLORS.bgSubtle}; color: ${COLORS.textPrimary}; }
  .throttle-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .throttle-btn:disabled:hover { background: transparent; color: ${COLORS.textMuted}; }
  .throttle-label { line-height: 1; font-size: 11px; font-weight: 500; }

  .throttle-menu {
    position: absolute; top: calc(100% + 6px); left: 0;
    min-width: 140px;
    background: rgba(24,24,27,0.98);
    backdrop-filter: blur(12px);
    border: 1px solid ${COLORS.border};
    border-radius: 8px; padding: 4px;
    display: none; flex-direction: column; gap: 2px;
    z-index: 30;
    pointer-events: all;
  }
  .throttle-menu.open { display: flex; }
  .throttle-option {
    all: unset; cursor: pointer;
    font-size: 11px; font-weight: 500;
    padding: 6px 9px; border-radius: 5px;
    color: ${COLORS.textFaint};
    transition: background 120ms, color 120ms;
    white-space: nowrap;
  }
  .throttle-option:hover { background: ${COLORS.border}; color: ${COLORS.textPrimary}; }
  .throttle-option.active { background: ${COLORS.border}; color: ${COLORS.textPrimary}; }

  .browser-group { display: flex; align-items: center; gap: 2px; }
  .browser-btn {
    all: unset; cursor: pointer;
    font-size: 11px; font-weight: 500; padding: 5px 10px;
    border-radius: 6px; color: ${COLORS.textFaint};
    transition: background 120ms, color 120ms;
    white-space: nowrap;
  }
  .browser-btn:hover { background: ${COLORS.border}; color: ${COLORS.textSecondary}; }
  .browser-btn.active { background: ${COLORS.border}; color: ${COLORS.textPrimary}; }
  .browser-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .browser-btn:disabled:hover { background: transparent; }

  .device-label {
    font-size: 11px; color: ${COLORS.textDisabled};
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    white-space: nowrap; padding: 0 4px;
  }

  .frame-wrap {
    position: relative; flex-shrink: 0; pointer-events: all;
    display: flex; align-items: center; justify-content: center;
  }

  .device-frame { position: relative; flex-shrink: 0; transition: transform 380ms cubic-bezier(0.4,0,0.2,1); }
  .device-frame.rotating { transform: rotate(90deg) scale(0.92); }

  .screen-inner {
    position: absolute; overflow: hidden;
    isolation: isolate;
    transform: translateZ(0);
  }
  .screen-inner iframe {
    display: block; border: 0; width: 100%; height: 100%;
  }

  .fallback {
    display: none; color: ${COLORS.textPrimary};
    background: ${COLORS.bgElevated}; border: 1px solid ${COLORS.border};
    border-radius: 10px; padding: 20px 24px;
    max-width: 320px; text-align: center;
    font-size: 13px; line-height: 1.6;
    pointer-events: all;
  }
  .fallback.visible { display: block; }

  .shrink-root.capturing-frame .toolbar,
  .shrink-root.capturing-frame .picker,
  .shrink-root.capturing-frame .shot-region,
  .shrink-root.capturing-frame .shot-dims,
  .shrink-root.capturing-frame .shot-mask,
  .shrink-root.capturing-frame .shot-actions,
  .shrink-root.capturing-region .shot-region,
  .shrink-root.capturing-region .shot-dims,
  .shrink-root.capturing-region .shot-mask,
  .shrink-root.capturing-region .shot-actions {
    visibility: hidden;
  }
  .shrink-root.capturing-frame .shot-overlay,
  .shrink-root.capturing-region .shot-overlay { cursor: default; }

  .shot-overlay {
    position: fixed; inset: 0;
    z-index: ${Z_INDEX_SHOT_OVERLAY};
    pointer-events: all; cursor: crosshair;
  }
  .shot-mask {
    position: absolute;
    background: rgba(0,0,0,0.45);
    pointer-events: none;
  }
  .shot-region {
    position: absolute;
    border: 1px solid ${COLORS.accent};
    box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
    pointer-events: none;
  }
  .shot-dims {
    position: absolute; bottom: -22px; right: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10px; color: ${COLORS.textPrimary};
    background: rgba(0,0,0,0.75);
    padding: 2px 6px; border-radius: 4px;
    white-space: nowrap;
  }
  .shot-actions {
    position: absolute;
    z-index: ${Z_INDEX_SHOT_ACTIONS};
    display: flex; align-items: center; gap: 4px;
    background: rgba(24,24,27,0.95);
    backdrop-filter: blur(12px);
    border: 1px solid ${COLORS.border};
    border-radius: 8px; padding: 4px;
    pointer-events: all;
  }
  .shot-actions .tool-btn:hover { background: ${COLORS.border}; color: ${COLORS.textPrimary}; }
`
