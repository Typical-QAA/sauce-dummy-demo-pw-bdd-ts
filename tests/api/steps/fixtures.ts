import type { APIResponse } from '@playwright/test'
import { test as base, createBdd } from 'playwright-bdd'
import { createMinimalProduct } from '../../../data/api/factories'

type ProductData = ReturnType<typeof createMinimalProduct> & Record<string, unknown>

export type Fixtures = {
  minimalProduct: ReturnType<typeof createMinimalProduct>
  ctx: {
    response: APIResponse
    usedProduct: ReturnType<typeof createMinimalProduct>
    originalProduct: ProductData
    elapsedMs: number | undefined
  }
}

export const test = base.extend<Fixtures>({
  ctx: async ({}, use) => {
    const ctx = {
      response: {} as APIResponse,
      usedProduct: {} as ReturnType<typeof createMinimalProduct>,
      originalProduct: {} as ProductData,
      elapsedMs: undefined
    }
    await use(ctx)
  },

  minimalProduct: async ({}, use) => {
    const product = createMinimalProduct()
    await use(product)
  }
})

export const { Given, When, Then } = createBdd(test)
