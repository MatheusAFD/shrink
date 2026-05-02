import {
  BEZEL_H,
  BEZEL_V_BOTTOM_PHONE,
  BEZEL_V_BOTTOM_TABLET,
  BEZEL_V_TOP,
  BORDER_RADIUS_PHONE,
  BORDER_RADIUS_TABLET
} from '@/lib/constants/frame'
import type { Device, NotchType, Orientation } from '@/types'

export interface FrameDimensions {
  frameWidth: number
  frameHeight: number
  screenTop: number
  screenBottom: number
  screenLeft: number
  screenRight: number
  borderRadius: number
  notchType: NotchType
  isTablet: boolean
}

export function getFrameDimensions(
  device: Device,
  orientation: Orientation
): FrameDimensions {
  const isTablet = device.category === 'tablet'
  const w = orientation === 'portrait' ? device.width : device.height
  const h = orientation === 'portrait' ? device.height : device.width
  const bezelBottom = isTablet ? BEZEL_V_BOTTOM_TABLET : BEZEL_V_BOTTOM_PHONE

  return {
    frameWidth: w + BEZEL_H * 2,
    frameHeight: h + BEZEL_V_TOP + bezelBottom,
    screenTop: BEZEL_V_TOP,
    screenBottom: bezelBottom,
    screenLeft: BEZEL_H,
    screenRight: BEZEL_H,
    borderRadius: isTablet ? BORDER_RADIUS_TABLET : BORDER_RADIUS_PHONE,
    notchType: orientation === 'landscape' ? 'none' : device.notchType,
    isTablet
  }
}

export interface ScaledFrame {
  dims: FrameDimensions
  scale: number
  outerWidth: number
  outerHeight: number
}

export function scaleFrameTo(
  device: Device,
  orientation: Orientation,
  targetWidth: number,
  targetHeight: number
): ScaledFrame {
  const dims = getFrameDimensions(device, orientation)
  const scale = Math.min(
    targetWidth / dims.frameWidth,
    targetHeight / dims.frameHeight
  )
  return {
    dims,
    scale,
    outerWidth: dims.frameWidth * scale,
    outerHeight: dims.frameHeight * scale
  }
}

export function buildFrameStyles(dims: FrameDimensions, scale = 1) {
  const r = dims.borderRadius * scale
  const bezelH = BEZEL_H * scale
  const bezelTop = dims.screenTop * scale
  const bezelBottom = dims.screenBottom * scale
  const fw = dims.frameWidth * scale
  const fh = dims.frameHeight * scale

  const frame: Record<string, string> = {
    position: 'relative',
    width: `${fw}px`,
    height: `${fh}px`,
    background: 'linear-gradient(160deg, #3a3a3c 0%, #1c1c1e 40%, #2a2a2c 100%)',
    borderRadius: `${r}px`,
    boxShadow: `0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 64px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.5)`,
    overflow: 'hidden',
    flexShrink: '0'
  }

  const screenR = Math.max(r - bezelH * 1.2, 6)
  const screen: Record<string, string> = {
    position: 'absolute',
    top: `${bezelTop}px`,
    left: `${bezelH}px`,
    right: `${bezelH}px`,
    bottom: `${bezelBottom}px`,
    background: '#000',
    borderRadius: `${screenR}px`,
    overflow: 'hidden',
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)'
  }

  const topBar: Record<string, string> = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: `${bezelTop}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const camera = buildCameraStyles(dims.notchType, scale)

  const homeIndicator: Record<string, string> | null =
    !dims.isTablet && dims.notchType !== 'none'
      ? {
          position: 'absolute',
          bottom: `${bezelBottom * 0.35 * 1}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${28 * scale}px`,
          height: `${3 * scale}px`,
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '9999px'
        }
      : null

  return { frame, screen, topBar, camera, homeIndicator }
}

function buildCameraStyles(
  notchType: NotchType,
  scale: number
): Record<string, string> | null {
  if (notchType === 'none') return null

  const base: Record<string, string> = {
    background: '#18181b',
    flexShrink: '0'
  }

  if (notchType === 'island') {
    return {
      ...base,
      width: `${52 * scale}px`,
      height: `${13 * scale}px`,
      borderRadius: '9999px'
    }
  }

  if (notchType === 'notch') {
    return {
      ...base,
      width: `${80 * scale}px`,
      height: `${18 * scale}px`,
      borderRadius: `0 0 ${8 * scale}px ${8 * scale}px`
    }
  }

  return {
    ...base,
    width: `${10 * scale}px`,
    height: `${10 * scale}px`,
    borderRadius: '50%'
  }
}

export function stylesToString(styles: Record<string, string>): string {
  return Object.entries(styles)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
    .join(';')
}
