import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Features } from './features'
import { Hero } from './hero'
import { InstallCta } from './install-cta'
import { PrivacyStrip } from './privacy-strip'

export function HomeSections() {
  return (
    <main className="grain min-h-dvh">
      <Header />
      <Hero />
      <Features />
      <PrivacyStrip />
      <InstallCta />
      <Footer />
    </main>
  )
}
