import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/cn'

type FeatureCardProps = {
  label: string
  title: string
  body: ReactNode
  children?: ReactNode
  spanCols?: 1 | 2
  className?: string
  trailing?: ReactNode
}

export function FeatureCard({
  label,
  title,
  body,
  children,
  spanCols = 1,
  className,
  trailing
}: FeatureCardProps) {
  return (
    <Card
      interactive
      className={cn(
        'flex flex-col p-6',
        spanCols === 2 && 'md:col-span-2',
        className
      )}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-fg-dim">
          {label}
        </span>
        {trailing}
      </div>
      <h3 className="mt-2 font-mono text-xl tracking-tight md:text-2xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{body}</p>
      {children && <div className="mt-6 flex-1">{children}</div>}
    </Card>
  )
}
