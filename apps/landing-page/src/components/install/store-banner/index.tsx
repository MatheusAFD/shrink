import { ArrowRightIcon } from '@/components/ui/icons'
import { links } from '@/data/links'
import { ChromeGlyph } from './chrome-glyph'

export function StoreBanner() {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-card border border-accent/25 bg-accent/6 px-5 py-4 md:flex-row md:items-center">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
          <ChromeGlyph />
        </span>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-accent">
            now on the chrome web store
          </div>
          <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-fg-muted">
            Shrink is{' '}
            <strong className="text-fg">live on the Chrome Web Store</strong> —
            one-click install. Firefox Add-ons is coming soon; the manual steps
            below still work for both browsers.
          </p>
        </div>
      </div>
      <a
        href={links.chromeWebStore}
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-[12px] uppercase tracking-widest text-accent transition-colors hover:bg-accent/20"
      >
        add to chrome
        <ArrowRightIcon size={12} />
      </a>
    </div>
  )
}
