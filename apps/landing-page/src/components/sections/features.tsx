import { BrowserUaCard } from '@/components/features/browser-ua-card'
import { ColorSchemeCard } from '@/components/features/color-scheme-card'
import { DeviceListCard } from '@/components/features/device-list-card'
import { PrivacyCard } from '@/components/features/privacy-card'
import { ScreenshotCard } from '@/components/features/screenshot-card'
import { ThrottleCard } from '@/components/features/throttle-card'
import { Section } from '@/components/layout/section'

export function Features() {
  return (
    <Section
      id="features"
      eyebrow="features"
      title="Everything you need to test mobile."
      description="Built on Chrome DevTools Protocol. No external tools, no fake user agents — real device emulation in any tab."
    >
      <div className="grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
        <DeviceListCard />
        <ThrottleCard />
        <ScreenshotCard />
        <ColorSchemeCard />
        <BrowserUaCard />
        <PrivacyCard />
      </div>
    </Section>
  )
}
