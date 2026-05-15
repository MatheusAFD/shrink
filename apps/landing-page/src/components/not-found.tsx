import { Link } from '@tanstack/react-router'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@/components/ui/icons'

export function NotFound() {
  return (
    <main className="grain min-h-dvh">
      <Header />
      <section className="container-app flex max-w-2xl flex-col items-start py-24 md:py-32">
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
          404
        </p>
        <h1 className="mt-4 font-mono text-4xl leading-tight tracking-tight text-balance md:text-6xl">
          Page not found.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
          That route doesn't exist. Head back home or jump straight to the
          install guide.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            as="a"
            href="/"
            variant="primary"
            size="lg"
            trailingIcon={<ArrowRightIcon size={16} />}
          >
            Back home
          </Button>
          <Link
            to="/install"
            className="inline-flex h-12 items-center rounded-md border border-border-strong px-5 font-mono text-sm font-medium text-fg transition hover:border-accent hover:text-accent"
          >
            Install guide
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
