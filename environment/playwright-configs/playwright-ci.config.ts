// @ts-check
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'
import { defineBddConfig } from 'playwright-bdd'

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true })

export default defineConfig({
  fullyParallel: true,
  retries: 0, // NOTE: disable retries for immediate feedback on CI failures
  workers: 2, // NOTE: only two workers to avoid possible rate limiting
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.resolve(__dirname, '../../playwright-report/html/ci') }],
    ['junit', { outputFile: path.resolve(__dirname, '../../playwright-report/junit/results.xml') }],
    ['json', { outputFile: path.resolve(__dirname, '../../playwright-report/json/results.json') }],
    ['allure-playwright']
  ],
  use: {
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    acceptDownloads: true
  },
  expect: { timeout: 10_000 },

  projects: [
    {
      name: 'api',
      testDir: defineBddConfig({
        outputDir: path.resolve(__dirname, '../../.features-gen/api/'),
        featuresRoot: path.resolve(__dirname, '../../tests/api/')
      }),
      use: { baseURL: process.env.PW_BASE_API_URL || 'https://dummyjson.com' }
    },
    {
      name: 'web-chrome',
      testDir: defineBddConfig({
        outputDir: path.resolve(__dirname, '../../.features-gen/web/'),
        featuresRoot: path.resolve(__dirname, '../../tests/web/')
      }),
      use: { ...devices['Desktop Chrome'], baseURL: process.env.PW_BASE_WEB_URL || 'https://www.saucedemo.com' }
    }
  ]
})
