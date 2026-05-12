import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { GithubIcon } from '@/components/ui/icons'
import { links } from '@/data/links'

export function InstallHero() {
  return (
    <div>
      <Badge tone="accent">
        <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
        manual install
      </Badge>

      <h1 className="mt-5 font-mono text-4xl leading-tight tracking-tight text-balance md:text-6xl">
        Install Shrink
        <br />
        <span className="text-accent">from source.</span>
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
        The Chrome Web Store and Firefox Add-ons listings are{' '}
        <em>coming soon</em>. Until then, building from source takes about a
        minute — all you need is git, Node.js 22+ and your favourite package
        manager.
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href={links.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-mono text-sm text-fg-muted transition-colors hover:text-accent"
        >
          <GithubIcon size={14} />
          view on github
        </a>
        <Link
          to="/"
          className="inline-flex items-center gap-1 font-mono text-sm text-fg-muted transition-colors hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          back home
        </Link>
      </div>
    </div>
  )
}
