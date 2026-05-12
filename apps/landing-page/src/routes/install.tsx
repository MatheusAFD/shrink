import { createFileRoute } from '@tanstack/react-router'
import { InstallPage } from '@/components/install/install-page'

const SITE_URL = 'https://shrink.mathlab.cc'
const OG_IMAGE = `${SITE_URL}/og-image.png`
const TITLE = 'Install Shrink — build from source'
const DESCRIPTION =
  'Step-by-step guide to build Shrink from source and load it as an unpacked extension in Chrome or Firefox.'

export const Route = createFileRoute('/install')({
  component: InstallPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:url', content: `${SITE_URL}/install` },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE }
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/install` }]
  })
})
