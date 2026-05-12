import { throttlePresets } from '@/data/devices'
import { FeatureCard } from './feature-card'

export function ThrottleCard() {
  return (
    <FeatureCard
      label="network"
      title="Throttle the connection."
      body="Simulate Slow 3G, 4G, or no network at all. CDP-backed, no proxy required."
    >
      <ul className="space-y-2">
        {throttlePresets.map((p) => (
          <li
            key={p.label}
            className="flex items-center justify-between rounded-md border border-border bg-bg-strip px-3 py-2 font-mono text-[11px]"
          >
            <span className="text-fg">{p.label}</span>
            <span className="tabular-nums text-fg-dim">
              {p.ms}ms · {p.mbps}
            </span>
          </li>
        ))}
      </ul>
    </FeatureCard>
  )
}
