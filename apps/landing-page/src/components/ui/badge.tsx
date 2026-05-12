import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'default' | 'accent'

type BadgeProps = ComponentPropsWithoutRef<'span'> & {
  tone?: Tone
}

const tones: Record<Tone, string> = {
  default: 'bg-bg-elevated text-fg-muted border-border',
  accent: 'bg-accent/10 text-accent border-accent/25'
}

export function Badge({ tone = 'default', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest',
        tones[tone],
        className
      )}
      {...rest}
    />
  )
}
