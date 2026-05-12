import { createFileRoute } from '@tanstack/react-router'
import { InstallPage } from '@/components/install/install-page'

export const Route = createFileRoute('/install')({
  component: InstallPage,
  head: () => ({
    meta: [
      { title: 'Install Shrink — build from source' },
      {
        name: 'description',
        content:
          'Step-by-step guide to build Shrink from source and load it as an unpacked extension in Chrome or Firefox.'
      }
    ]
  })
})
