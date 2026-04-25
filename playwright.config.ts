import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Pixel 5'] },
    },
    // A11y monitoring (monthly check)
    {
      name: 'a11y',
      testMatch: '**/*.a11y.ts',
      use: { ...devices['Pixel 5'] },
    },
    // Visual regression testing (Chromatic の代替)
    {
      name: 'visual',
      testMatch: '**/visual.spec.ts',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
  webServer: {
    command: 'pnpm local',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env['CI'],
  },
})
