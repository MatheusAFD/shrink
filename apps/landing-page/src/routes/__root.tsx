import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import appCss from '@/styles/app.css?url'

const SITE_URL = 'https://shrink.mathlab.cc'
const OG_IMAGE = `${SITE_URL}/og-image.png`

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Shrink',
      url: SITE_URL,
      logo: `${SITE_URL}/icon/128.png`
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Shrink',
      applicationCategory: 'BrowserApplication',
      operatingSystem: 'Chrome, Firefox',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Mobile device simulator browser extension. 24+ devices, network throttling, screenshot capture.',
      url: SITE_URL
    }
  ]
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover'
      },
      { name: 'theme-color', content: '#0a0e12' },
      { name: 'robots', content: 'index, follow' },
      { title: 'Shrink — preview any site as a phone' },
      {
        name: 'description',
        content:
          'Preview any website as a mobile device — directly in your browser, with zero setup. Free, open source, privacy-first.'
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${SITE_URL}/` },
      { property: 'og:title', content: 'Shrink — preview any site as a phone' },
      {
        property: 'og:description',
        content:
          'Mobile device simulator browser extension. 24+ devices, network throttling, screenshot capture. Free and open source.'
      },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Shrink — preview any site as a phone'
      },
      {
        name: 'twitter:description',
        content:
          'Mobile device simulator browser extension. 24+ devices, network throttling, screenshot capture. Free and open source.'
      },
      { name: 'twitter:image', content: OG_IMAGE }
    ],
    links: [
      { rel: 'canonical', href: `${SITE_URL}/` },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icon/32.png' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '128x128',
        href: '/icon/128.png'
      },
      { rel: 'apple-touch-icon', href: '/icon/128.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;500;600;700&display=swap'
      }
    ]
  }),
  component: RootDocument
})

function RootDocument(): ReactNode {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD schema markup requires innerHTML
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body style={{ background: '#0a0e12' }}>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
