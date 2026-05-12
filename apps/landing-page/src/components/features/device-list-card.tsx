import { deviceChips } from '@/data/devices'
import { DeviceChip } from './device-chip'
import { FeatureCard } from './feature-card'

export function DeviceListCard() {
  return (
    <FeatureCard
      label="24 devices"
      title="iPhone, Galaxy, Pixel, iPad, OnePlus, Xiaomi."
      body="Real viewport sizes, DPR, and stock user agents. Switch in one click, rotate to landscape, or pick from the sidebar with instant search."
      spanCols={2}
      trailing={
        <span className="font-mono text-[11px] text-fg-dim">
          + updated yearly
        </span>
      }
    >
      <div className="-mx-6 flex flex-wrap gap-2 px-6 pb-1">
        {deviceChips.map((d) => (
          <DeviceChip key={d.name} device={d} />
        ))}
      </div>
    </FeatureCard>
  )
}
