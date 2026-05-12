import { FloatingChip } from './floating-chip'
import { PhoneFrame } from './phone-frame'

export function PhoneMockup() {
  return (
    <div className="relative" aria-hidden="true">
      <div
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, oklch(0.86 0.16 200 / 0.35), transparent 60%)',
          animation: 'glow-pulse 4s ease-in-out infinite'
        }}
      />

      <div className="relative overflow-hidden rounded-xl border border-border-strong bg-bg-elevated shadow-(--shadow-glow-soft)">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-[oklch(0.55_0.14_30)]" />
          <span className="size-2.5 rounded-full bg-[oklch(0.78_0.14_80)]" />
          <span className="size-2.5 rounded-full bg-[oklch(0.70_0.16_140)]" />
          <div className="ml-3 flex-1 rounded-md border border-border bg-bg px-3 py-1 font-mono text-[11px] text-fg-dim">
            shrink://preview/iphone-15-pro
          </div>
        </div>

        <div className="relative flex aspect-4/3 items-center justify-center px-6 py-8">
          <PhoneFrame />

          <FloatingChip
            tone="accent"
            delay={0.7}
            floatDelay={0}
            className="left-4 top-6"
          >
            iPhone 15 Pro
          </FloatingChip>
          <FloatingChip
            delay={0.85}
            floatDelay={1.5}
            className="right-6 top-12"
          >
            Dark mode
          </FloatingChip>
          <FloatingChip delay={1} floatDelay={3} className="bottom-4 left-12">
            Portrait · 393×852
          </FloatingChip>
          <FloatingChip
            delay={1.15}
            floatDelay={4.5}
            className="bottom-16 right-4"
          >
            Throttle · Slow 4G
          </FloatingChip>
        </div>
      </div>
    </div>
  )
}
