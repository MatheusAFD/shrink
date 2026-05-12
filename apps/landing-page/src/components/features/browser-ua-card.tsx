import { FeatureCard } from './feature-card'

const browsers = [
  { label: 'Chrome', shape: 'circle' as const },
  { label: 'Firefox', shape: 'ring' as const },
  { label: 'Safari', shape: 'compass' as const }
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

type Shape = 'circle' | 'ring' | 'compass'

function BrowserGlyph({ shape }: { shape: Shape }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {shape === 'circle' && (
        <>
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </>
      )}
      {shape === 'ring' && (
        <>
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M7 9C9 6 13 6 14 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      )}
      {shape === 'compass' && (
        <>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="9"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M12 3v6l4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}
