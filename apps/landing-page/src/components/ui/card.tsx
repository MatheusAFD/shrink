import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

type CardProps = ComponentPropsWithoutRef<'div'> & {
  interactive?: boolean
}

export function Card({ className, interactive, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-card border border-border bg-bg-elevated',
        interactive &&
          'transition hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-(--shadow-glow-soft)',
        className
      )}
      {...rest}
    />
  )
}
