import { motion } from 'motion/react'
import { PhoneMockup } from '@/components/mockup/phone-mockup'
import { CtaButtons } from './cta-buttons'

export function Hero() {
  return (
    <section className="relative scroll-mt-24 overflow-hidden pb-24 pt-16 md:pb-32 md:pt-24">
      <div className="container-app grid items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-8">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Eyebrow />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="font-mono text-5xl leading-[1.02] tracking-tight text-balance md:text-7xl"
          >
            Preview any site
            <br />
            <span className="text-accent">as a phone.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-fg-muted md:text-xl"
          >
            A browser extension that simulates 24+ mobile devices in any tab.
            Real user agents, touch events, color schemes, and network
            throttling — zero setup, zero tracking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-8"
          >
            <CtaButtons />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-fg-dim"
          >
            <MetaItem>Chrome · Firefox</MetaItem>
            <MetaItem>MIT open source</MetaItem>
            <MetaItem>No tracking</MetaItem>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  )
}

function Eyebrow() {
  return (
    <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.08] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
      <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
      v0.2 — now with network throttling
    </span>
  )
}

function MetaItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </span>
  )
}
