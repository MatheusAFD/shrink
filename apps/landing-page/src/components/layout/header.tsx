import { Link } from '@tanstack/react-router'
import { IconMark } from '@/components/ui/icon-mark'
import { GithubIcon } from '@/components/ui/icons'
import { links } from '@/data/links'
import { extensionVersionShort } from '@/data/version'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-accent/15 bg-bg/60 backdrop-blur-md">
      <div className="container-app flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <IconMark size={24} />
          <span className="font-mono text-base font-medium tracking-tight">
            shrink
          </span>
          <span className="ml-1 hidden font-mono text-[10px] uppercase tracking-widest text-fg-dim sm:inline">
            v{extensionVersionShort}
          </span>
        </Link>
        <nav className="flex items-center gap-7 font-mono text-sm">
          <Link
            to="/"
            hash="features"
            className="hidden text-fg-muted transition-colors hover:text-accent md:inline"
          >
            features
          </Link>
          <Link
            to="/install"
            className="hidden text-fg-muted transition-colors hover:text-accent md:inline"
          >
            install
          </Link>
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-accent"
          >
            <GithubIcon size={14} />
            <span>github</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
