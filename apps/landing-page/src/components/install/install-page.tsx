import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { ComingSoonBanner } from './coming-soon-banner'
import { InstallHero } from './install-hero'
import { InstallSteps } from './install-steps'
import { Troubleshooting } from './troubleshooting'

export function InstallPage() {
  return (
    <main className="grain min-h-dvh">
      <Header />

      <section className="container-app max-w-3xl pt-10">
        <ComingSoonBanner />
      </section>

      <section className="container-app max-w-3xl pb-16 pt-10 md:pb-24 md:pt-12">
        <InstallHero />
      </section>

      <section className="container-app max-w-3xl pb-24">
        <InstallSteps />
      </section>

      <section className="container-app max-w-3xl pb-24">
        <Troubleshooting />
      </section>

      <Footer />
    </main>
  )
}
