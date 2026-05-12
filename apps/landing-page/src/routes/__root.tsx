import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import appCss from '@/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover'
      },
      { name: 'theme-color', content: '#0a0e12' },
      { title: 'Shrink — preview any site as a phone' },
      {
        name: 'description',
        content:
          'Preview any website as a mobile device — directly in your browser, with zero setup. Free, open source, privacy-first.'
      },
      { property: 'og:title', content: 'Shrink — preview any site as a phone' },
      {
        property: 'og:description',
        content:
          'Mobile device simulator browser extension. 24+ devices, network throttling, screenshot capture. Free and open source.'
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ],
    links: [
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
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
