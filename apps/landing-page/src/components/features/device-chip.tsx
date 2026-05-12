import type { DeviceChipData } from '@/data/devices'

const brandDot: Record<DeviceChipData['brand'], string> = {
  Apple: 'bg-[oklch(0.78_0.05_60)]',
  Samsung: 'bg-[oklch(0.65_0.18_260)]',
  Google: 'bg-[oklch(0.78_0.18_140)]',
  OnePlus: 'bg-accent',
  Xiaomi: 'bg-accent'
}

export function DeviceChip({ device }: { device: DeviceChipData }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-bg-strip px-3 py-1 font-mono text-[11px] text-fg-muted">
      <span className={`size-1 rounded-full ${brandDot[device.brand]}`} />
      {device.name}
    </span>
  )
}
