import { extensionVersionShort } from '@/data/version'

export function Eyebrow() {
  return (
    <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
      <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
      v{extensionVersionShort} — now with color scheme emulation
    </span>
  )
}
