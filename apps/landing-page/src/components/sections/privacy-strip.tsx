import { Reveal } from '@/components/motion/reveal'

const pillars = [
  { label: 'No tracking', sub: 'Zero analytics, zero telemetry' },
  { label: 'No accounts', sub: 'Install and use, no sign-up' },
  { label: 'MIT open source', sub: 'Audit the source, fork the code' }
]

export function PrivacyStrip() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-bg-strip py-16 md:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent 0%, oklch(0.86 0.16 200 / 0.08) 50%, transparent 100%)'
        }}
      />
      <div className="container-app relative grid gap-8 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal
            key={p.label}
            delay={i * 0.08}
            className="flex flex-col gap-2"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
              0{i + 1}
            </span>
            <h3 className="font-mono text-2xl tracking-tight md:text-3xl">
              {p.label}
            </h3>
            <p className="text-fg-muted">{p.sub}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
