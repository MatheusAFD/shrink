import { motion } from 'motion/react'

export function PhoneFrame() {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.92, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewBox="0 0 220 460"
      width="180"
      height="380"
      className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
    >
      <rect
        x="2"
        y="2"
        width="216"
        height="456"
        rx="36"
        fill="oklch(0.10 0.012 240)"
        stroke="oklch(0.30 0.014 240)"
        strokeWidth="2"
      />
      <rect
        x="10"
        y="10"
        width="200"
        height="440"
        rx="28"
        fill="oklch(0.16 0.014 240)"
      />
      <rect
        x="84"
        y="18"
        width="52"
        height="14"
        rx="7"
        fill="oklch(0.06 0.01 240)"
      />
      <g opacity="0.95">
        <rect
          x="22"
          y="48"
          width="176"
          height="36"
          rx="6"
          fill="oklch(0.20 0.014 240)"
        />
        <rect
          x="30"
          y="56"
          width="60"
          height="6"
          rx="3"
          fill="oklch(0.86 0.16 200)"
        />
        <rect
          x="30"
          y="68"
          width="120"
          height="4"
          rx="2"
          fill="oklch(0.50 0.014 240)"
        />

        <rect
          x="22"
          y="96"
          width="176"
          height="120"
          rx="8"
          fill="oklch(0.22 0.016 240)"
        />
        <circle
          cx="48"
          cy="156"
          r="14"
          fill="oklch(0.86 0.16 200 / 0.3)"
          stroke="oklch(0.86 0.16 200)"
          strokeWidth="1.5"
        />
        <rect
          x="74"
          y="142"
          width="100"
          height="6"
          rx="3"
          fill="oklch(0.75 0.012 240)"
        />
        <rect
          x="74"
          y="156"
          width="80"
          height="4"
          rx="2"
          fill="oklch(0.50 0.014 240)"
        />
        <rect
          x="74"
          y="168"
          width="68"
          height="4"
          rx="2"
          fill="oklch(0.50 0.014 240)"
        />

        <rect
          x="22"
          y="228"
          width="84"
          height="84"
          rx="8"
          fill="oklch(0.20 0.014 240)"
        />
        <rect
          x="30"
          y="236"
          width="50"
          height="6"
          rx="3"
          fill="oklch(0.86 0.16 200)"
        />
        <rect
          x="30"
          y="252"
          width="60"
          height="4"
          rx="2"
          fill="oklch(0.50 0.014 240)"
        />
        <rect
          x="30"
          y="296"
          width="20"
          height="8"
          rx="2"
          fill="oklch(0.86 0.16 200)"
        />

        <rect
          x="114"
          y="228"
          width="84"
          height="84"
          rx="8"
          fill="oklch(0.20 0.014 240)"
        />
        <rect
          x="122"
          y="236"
          width="50"
          height="6"
          rx="3"
          fill="oklch(0.75 0.012 240)"
        />
        <rect
          x="122"
          y="252"
          width="40"
          height="4"
          rx="2"
          fill="oklch(0.50 0.014 240)"
        />
        <rect
          x="122"
          y="296"
          width="20"
          height="8"
          rx="2"
          fill="oklch(0.75 0.012 240)"
        />

        <rect
          x="22"
          y="324"
          width="176"
          height="50"
          rx="8"
          fill="oklch(0.20 0.014 240)"
        />
        <rect
          x="30"
          y="336"
          width="80"
          height="6"
          rx="3"
          fill="oklch(0.75 0.012 240)"
        />
        <rect
          x="30"
          y="350"
          width="120"
          height="4"
          rx="2"
          fill="oklch(0.50 0.014 240)"
        />

        <rect
          x="22"
          y="386"
          width="176"
          height="50"
          rx="8"
          fill="oklch(0.20 0.014 240)"
        />
        <rect
          x="30"
          y="398"
          width="60"
          height="6"
          rx="3"
          fill="oklch(0.75 0.012 240)"
        />
        <rect
          x="30"
          y="412"
          width="110"
          height="4"
          rx="2"
          fill="oklch(0.50 0.014 240)"
        />
      </g>
    </motion.svg>
  )
}
