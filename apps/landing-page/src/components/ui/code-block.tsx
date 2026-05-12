import { useState } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  code: string
  label?: string
  className?: string
}

export function CodeBlock({ code, label, className }: Props) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-md border border-border bg-bg-strip',
        className
      )}
    >
      {label && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-fg-dim">
          <span>{label}</span>
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-fg">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy"
        className={cn(
          'absolute right-2 top-2 rounded-md border border-border-strong bg-bg-elevated px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100',
          copied ? 'text-accent' : 'text-fg-muted'
        )}
      >
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  )
}
