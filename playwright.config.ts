// @ts-check
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'
import { defineBddConfig } from 'playwright-bdd'

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true })

export default defineConfig({
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: './playwright-report/html/local' }]],
  use: { testIdAttribute: 'data-test', trace: 'on-first-retry', video: 'retain-on-failure', acceptDownloads: true },
  expect: { timeout: 10_000 },

  projects: [
    {
      name: 'api',
      testDir: defineBddConfig({ outputDir: '.features-gen/api', featuresRoot: 'tests/api/' }),
      use: { baseURL: process.env.PW_BASE_API_URL || 'https://dummyjson.com' }
    },
    {
      name: 'web-chrome',
      testDir: defineBddConfig({ outputDir: '.features-gen/web', featuresRoot: 'tests/web/' }),
      use: { ...devices['Desktop Chrome'], baseURL: process.env.PW_BASE_WEB_URL || 'https://www.saucedemo.com' }
    }
  ]
})
