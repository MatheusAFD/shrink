type Props = {
  steps: string[]
}

export function LoadSteps({ steps }: Props) {
  return (
    <ol className="space-y-2.5 pl-0 font-mono text-[14px] text-fg-muted">
      {steps.map((s, i) => (
        <li key={s} className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg-strip font-mono text-[11px] text-accent">
            {i + 1}
          </span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  )
}
