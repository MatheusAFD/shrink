import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  projects: [
    {
      name: 'shrink-extension',
      testMatch: '**/*.test.ts',
      use: {
        browserName: 'chromium',
        headless: false,
        viewport: { width: 1280, height: 800 }
      }
    }
  ]
})
