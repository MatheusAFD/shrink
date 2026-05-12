export function ComingSoonBanner() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-(--radius-card) border border-accent/25 bg-accent/[0.06] px-5 py-4 md:flex-row md:items-center">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/[0.12] text-accent">
          <ClockGlyph />
        </span>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-accent">
            coming soon to the stores
          </div>
          <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-fg-muted">
            Shrink will land on the{' '}
            <strong className="text-fg">Chrome Web Store</strong> and{' '}
            <strong className="text-fg">Firefox Add-ons</strong> soon. Until
            then, the steps below get you running in about a minute.
          </p>
        </div>
      </div>
    </div>
  )
}

function ClockGlyph() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
