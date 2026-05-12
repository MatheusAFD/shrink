import type { ReactNode } from 'react'

type Props = {
  n: number
  title: string
  body?: ReactNode
  children: ReactNode
}

export function Step({ n, title, body, children }: Props) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="flex size-9 items-center justify-center rounded-full border border-accent bg-bg-elevated font-mono text-sm text-accent">
          {n}
        </div>
        <div className="my-2 w-px flex-1 bg-border" />
      </div>
      <div className="flex-1 pb-2">
        <h3 className="font-mono text-xl tracking-tight md:text-2xl">
          {title}
        </h3>
        {body && (
          <p className="mt-1.5 text-[14px] leading-relaxed text-fg-muted">
            {body}
          </p>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
