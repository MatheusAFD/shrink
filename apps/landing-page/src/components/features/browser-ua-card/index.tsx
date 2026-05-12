import { FeatureCard } from '../feature-card'
import { BrowserGlyph, type Shape } from './browser-glyph'

const browsers: { label: string; shape: Shape }[] = [
  { label: 'Chrome', shape: 'circle' },
  { label: 'Firefox', shape: 'ring' },
  { label: 'Safari', shape: 'compass' }
]

export function BrowserUaCard() {
  return (
    <FeatureCard
      label="user agent"
      title="Spoof the browser too."
      body="Render as mobile Chrome, Firefox, or Safari — sites that gate on UA can't tell the difference."
    >
      <div className="flex items-center gap-3">
        {browsers.map((b) => (
          <div
            key={b.label}
            className="flex flex-1 flex-col items-center gap-2 rounded-md border border-border bg-bg-strip py-3 font-mono text-[11px] text-fg-muted"
          >
            <BrowserGlyph shape={b.shape} />
            {b.label}
          </div>
        ))}
      </div>
    </FeatureCard>
  )
}
