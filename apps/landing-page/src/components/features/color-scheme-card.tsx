import { FeatureCard } from './feature-card'

const modes = [
  { label: 'light', bg: 'oklch(0.98 0 0)', fg: 'oklch(0.13 0.012 240)' },
  { label: 'dark', bg: 'oklch(0.13 0.012 240)', fg: 'oklch(0.86 0.16 200)' },
  { label: 'auto', bg: 'oklch(0.55 0.012 240)', fg: 'oklch(0.98 0 0)' }
]

export function ColorSchemeCard() {
  return (
    <FeatureCard
      label="theme"
      title="Light, dark, auto."
      body={
        <>
          Force <code>prefers-color-scheme</code> on the page being tested,
          independent of your system.
        </>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {modes.map((m) => (
          <div
            key={m.label}
            className="flex h-16 flex-col items-center justify-center gap-1 rounded-md border border-border font-mono text-[10px] uppercase"
            style={{ backgroundColor: m.bg, color: m.fg }}
          >
            <div
              className="size-3 rounded-full opacity-85"
              style={{ backgroundColor: m.fg }}
            />
            {m.label}
          </div>
        ))}
      </div>
    </FeatureCard>
  )
}
