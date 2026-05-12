import { cn } from '@/lib/cn'

type TabsProps<T extends string> = {
  options: ReadonlyArray<T>
  value: T
  onChange: (v: T) => void
}

export function Tabs<T extends string>({
  options,
  value,
  onChange
}: TabsProps<T>) {
  return (
    <div className="inline-flex rounded-md border border-border bg-bg-strip p-1 font-mono text-sm">
      {options.map((o) => {
        const active = value === o
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              'rounded-sm px-3 py-1.5 transition-colors',
              active
                ? 'bg-accent text-bg'
                : 'bg-transparent text-fg-muted hover:text-fg'
            )}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}
