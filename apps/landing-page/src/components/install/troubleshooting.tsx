import { Card } from '@/components/ui/card'

const items = [
  {
    title: 'Firefox add-on disappears after restart:',
    body: 'temporary add-ons are unloaded on browser restart. Re-run the "Load Temporary Add-on" step after every Firefox restart.'
  },
  {
    title: 'Wrong manifest version on Firefox:',
    body: 'use the :firefox build script (not the Chrome one) — the Firefox build emits MV2 with DNR.'
  },
  {
    title: 'Icon does not appear after install:',
    body: 'pin Shrink from the puzzle-piece menu next to your address bar.'
  },
  {
    title: 'Build script fails:',
    body: 'make sure Node.js is at least 22.x. The repo .nvmrc pins the recommended version.'
  }
]

export function Troubleshooting() {
  return (
    <Card className="p-6 md:p-8">
      <p className="font-mono text-[11px] uppercase tracking-widest text-fg-dim">
        troubleshooting
      </p>
      <h3 className="mt-2 font-mono text-xl tracking-tight md:text-2xl">
        Common gotchas
      </h3>
      <ul className="mt-5 space-y-3 text-[14px] leading-relaxed text-fg-muted">
        {items.map((i) => (
          <li key={i.title}>
            <strong className="text-fg">{i.title}</strong> {i.body}
          </li>
        ))}
      </ul>
    </Card>
  )
}
