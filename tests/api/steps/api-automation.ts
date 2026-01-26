import { expect } from '@playwright/test'
import { ERRORS } from '../../../data/api/static/error-texts'
import type { MinimalProduct } from '../../../types/api/index'
import { Given, Then, When } from './fixtures'

When(
  'I send a GET request to {string} with params {string} {int} and {string} {string}',
  async ({ request, ctx }, endpoint: string, param1: string, val1: number, param2: string, val2: string) => {
    const params = { [param1]: val1, [param2]: val2 }
    ctx.response = await request.get(endpoint, { params })
  }
)

Then('the response status should be {int}', async ({ ctx }, statusCode: number) => {
  expect(ctx.response.status()).toEqual(statusCode)
})

Then('the total number of products in response should be {int}', async ({ ctx }, amount: number) => {
  const productsList = (await ctx.response.json()).products
  expect(productsList.length).toEqual(amount)
})

Then('I extract from response and attach titles of products with odd IDs to the test report', async ({ ctx, $test }) => {
  const productsList: MinimalProduct[] = (await ctx.response.json()).products
  const filteredTitles = productsList.filter(p => (p.id as number) % 2 !== 0).map(p => `id=${p.id}: title=${p.title}`)
  await $test.info().attach('filtered_odd_titles', { body: JSON.stringify(filteredTitles) })
})

When(
  'I send a POST request to {string} with a new valid minimal product payload',
  async ({ request, ctx, minimalProduct }, endpoint: string) => {
    ctx.usedProduct = minimalProduct
    ctx.response = await request.post(endpoint, { data: ctx.usedProduct })
  }
)

Then('the created product should match the payload with a generated ID', async ({ ctx }) => {
  const product = await ctx.response.json()
  expect(product.id).toBeDefined()
  expect(product).toEqual({ ...ctx.usedProduct, id: product.id })
})

Given('an existing product with ID {int}', async ({ request, ctx }, productId: number) => {
  ctx.response = await request.get(`/products/${productId}`)
  expect(ctx.response.status()).toEqual(200)
  ctx.originalProduct = await ctx.response.json()
  expect(ctx.originalProduct.id).toEqual(productId)
  expect(ctx.originalProduct).toEqual(
    expect.objectContaining({
      title: expect.any(String),
      price: expect.any(Number),
      description: expect.any(String),
      brand: expect.any(String)
    })
  )
})

When(
  'I send a PATCH request to update product with ID {int} with a partial payload',
  async ({ request, ctx, minimalProduct }, productId: number) => {
    ctx.usedProduct = minimalProduct
    ctx.response = await request.patch(`/products/${productId}`, { data: minimalProduct })
  }
)

Then('the updated product should preserve unchanged fields', async ({ ctx }) => {
  const updatedProduct = await ctx.response.json()
  const expectedProduct = {
    ...ctx.usedProduct,
    id: ctx.originalProduct.id,
    category: ctx.originalProduct.category,
    discountPercentage: ctx.originalProduct.discountPercentage,
    stock: ctx.originalProduct.stock,
    thumbnail: ctx.originalProduct.thumbnail,
    rating: ctx.originalProduct.rating,
    images: ctx.originalProduct.images
  }
  expect(updatedProduct).toEqual(expectedProduct)
})

When('I send a GET request to {string} with delay {int}', async ({ request, ctx }, endpoint: string, delayMs: number) => {
  const start = Date.now()
  ctx.response = await request.get(endpoint, { params: { delay: delayMs } })
  const stop = Date.now()
  ctx.elapsedMs = stop - start
})

Then(
  'the response time should meet the dynamic threshold for delay {int} plus {int} ms',
  async ({ ctx }, delayMs: number, thresholdMs: number) => {
    expect(ctx.elapsedMs).toBeLessThanOrEqual(delayMs + thresholdMs)
  }
)

Then('the response time should be less than or equal to {int} ms', async ({ ctx }, expectedElapsedMs: number) => {
  expect(ctx.elapsedMs).toBeLessThanOrEqual(expectedElapsedMs)
})

When('I send a GET request to {string} with invalid delay {string}', async ({ request, ctx }, endpoint: string, delayMs: string) => {
  ctx.response = await request.get(endpoint, { params: { delay: delayMs } })
})

Then('the error message {string} should be correct for delay {string}', async ({ ctx }, errorKey: string, delayMs: string) => {
  const message = (await ctx.response.json()).message
  expect(message).toEqual(ERRORS[errorKey as keyof typeof ERRORS])
})
