import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  children: ReactNode
  delay?: number
  floatDelay?: number
  className?: string
  tone?: 'default' | 'accent'
}

const tones = {
  default: 'border-border-strong text-fg-muted',
  accent: 'border-accent/35 text-accent'
}

export function FloatingChip({
  children,
  delay = 0,
  floatDelay = 0,
  className,
  tone = 'default'
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        animation: `float 6s ease-in-out ${floatDelay}s infinite`
      }}
      className={cn(
        'absolute rounded-md border bg-bg-elevated/85 px-3 py-1.5 font-mono text-[11px] backdrop-blur',
        tones[tone],
        className
      )}
    >
      {children}
    </motion.div>
  )
}
