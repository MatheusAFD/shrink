import { CheckIcon } from '@/components/ui/icons'
import { FeatureCard } from './feature-card'

const items = ['No tracking', 'No accounts', 'No ads', 'MIT licensed']

export function PrivacyCard() {
  return (
    <FeatureCard
      label="privacy"
      title="Stays in your browser."
      body="No analytics, no telemetry, no remote config. Source code is on GitHub — audit it yourself."
    >
      <ul className="space-y-2 font-mono text-[12px] text-fg-muted">
        {items.map((i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckIcon size={12} className="text-accent" />
            {i}
          </li>
        ))}
      </ul>
    </FeatureCard>
  )
}
