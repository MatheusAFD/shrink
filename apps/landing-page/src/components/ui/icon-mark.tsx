import { cn } from '@/lib/cn'

type Props = {
  size?: number
  className?: string
}

export function IconMark({ size = 28, className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn(className)}
      aria-hidden="true"
    >
      <rect
        x="6"
        y="2"
        width="20"
        height="28"
        rx="4"
        fill="oklch(0.10 0.012 240)"
        stroke="oklch(0.30 0.014 240)"
        strokeWidth="1"
      />
      <rect
        x="12"
        y="5"
        width="8"
        height="1.6"
        rx="0.8"
        fill="oklch(0.30 0.014 240)"
      />
      <circle cx="16" cy="27" r="1" fill="oklch(0.30 0.014 240)" />
      <text
        x="16"
        y="20"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fontSize="12"
        fill="oklch(0.86 0.16 200)"
      >
        S
      </text>
    </svg>
  )
}
