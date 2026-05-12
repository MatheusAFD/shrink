import { Link } from '@tanstack/react-router'
import { Reveal } from '@/components/motion/reveal'
import { links } from '@/data/links'
import { CtaButtons } from './cta-buttons'

export function InstallCta() {
  return (
    <section id="install" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-app">
        <Reveal>
          <div className="relative overflow-hidden rounded-card border border-border-strong bg-bg-elevated px-8 py-14 text-center md:px-16 md:py-20">
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                background:
                  'radial-gradient(ellipse at top, oklch(0.86 0.16 200 / 0.2), transparent 60%)'
              }}
            />
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                Install
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl font-mono text-3xl tracking-tight text-balance md:text-5xl">
                Free, forever. Two clicks away.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-fg-muted md:text-lg">
                Available soon on the Chrome Web Store and Firefox Add-ons.
                Until then, build it from source — it's a one-liner.
              </p>
              <div className="mt-8 flex justify-center">
                <CtaButtons align="center" />
              </div>
              <div className="mt-6 flex items-center justify-center gap-4 font-mono text-sm">
                <Link
                  to="/install"
                  className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
                >
                  step-by-step guide
                  <span aria-hidden="true">→</span>
                </Link>
                <span className="text-fg-dim">·</span>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
                >
                  github
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
