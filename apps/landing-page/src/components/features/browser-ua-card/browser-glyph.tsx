export type Shape = 'circle' | 'ring' | 'compass'

export function BrowserGlyph({ shape }: { shape: Shape }) {
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
