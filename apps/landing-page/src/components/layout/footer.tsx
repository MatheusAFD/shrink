import { IconMark } from '@/components/ui/icon-mark'
import { links } from '@/data/links'

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border">
      <div className="container-app flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <IconMark size={22} />
          <span className="font-mono text-sm tracking-tight">shrink</span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fg-dim">
            mobile device simulator
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm text-fg-muted">
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            github
          </a>
          <a
            href={links.license}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-accent"
          >
            license · MIT
          </a>
          <span className="text-fg-dim">
            © {new Date().getFullYear()} matheusafd
          </span>
        </div>
      </div>
    </footer>
  )
}
