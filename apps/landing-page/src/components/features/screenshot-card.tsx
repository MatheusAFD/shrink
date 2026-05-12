import { FeatureCard } from './feature-card'

export function ScreenshotCard() {
  return (
    <FeatureCard
      label="capture"
      title="One-click screenshots."
      body="Grab the simulated viewport as a PNG, at the device's actual pixel ratio."
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex items-end justify-center gap-3">
          <div className="h-24 w-14 rounded-md border border-border-strong bg-bg-strip shadow-(--shadow-glow-soft)" />
          <div className="h-32 w-16 rounded-md border border-accent/50 bg-bg-strip shadow-[0_0_30px_-5px_oklch(0.86_0.16_200/0.4)]" />
          <div className="h-20 w-12 rounded-md border border-border-strong bg-bg-strip" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-accent">
          <DownloadGlyph />
          export · PNG
        </div>
      </div>
    </FeatureCard>
  )
}

function DownloadGlyph() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
