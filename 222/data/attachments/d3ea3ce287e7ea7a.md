# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ../../.features-gen/api/features/api-automation.feature.spec.js >> Products API >> Scenario_4 - Fixed response time validation >> Example #2
- Location: .features-gen/api/features/api-automation.feature.spec.js:34:9

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 1000
Received:    5184
```

# Test source

```ts
  1   | import { expect } from '@playwright/test'
  2   | import { ERRORS } from '../../../data/api/static/error-texts'
  3   | import type { MinimalProduct } from '../../../types/api/index'
  4   | import { Given, Then, When } from './fixtures'
  5   | 
  6   | When(
  7   |   'I send a GET request to {string} with params {string} {int} and {string} {string}',
  8   |   async ({ request, ctx }, endpoint: string, param1: string, val1: number, param2: string, val2: string) => {
  9   |     const params = { [param1]: val1, [param2]: val2 }
  10  |     ctx.response = await request.get(endpoint, { params })
  11  |   }
  12  | )
  13  | 
  14  | Then('the response status should be {int}', async ({ ctx }, statusCode: number) => {
  15  |   expect(ctx.response.status()).toEqual(statusCode)
  16  | })
  17  | 
  18  | Then('the total number of products in response should be {int}', async ({ ctx }, amount: number) => {
  19  |   const productsList = (await ctx.response.json()).products
  20  |   expect(productsList.length).toEqual(amount)
  21  | })
  22  | 
  23  | Then('I extract from response and attach titles of products with odd IDs to the test report', async ({ ctx, $test }) => {
  24  |   const productsList: MinimalProduct[] = (await ctx.response.json()).products
  25  |   const filteredTitles = productsList.filter(p => (p.id as number) % 2 !== 0).map(p => `id=${p.id}: title=${p.title}`)
  26  |   await $test.info().attach('filtered_odd_titles', { body: JSON.stringify(filteredTitles) })
  27  | })
  28  | 
  29  | When(
  30  |   'I send a POST request to {string} with a new valid minimal product payload',
  31  |   async ({ request, ctx, minimalProduct }, endpoint: string) => {
  32  |     ctx.usedProduct = minimalProduct
  33  |     ctx.response = await request.post(endpoint, { data: ctx.usedProduct })
  34  |   }
  35  | )
  36  | 
  37  | Then('the created product should match the payload with a generated ID', async ({ ctx }) => {
  38  |   const product = await ctx.response.json()
  39  |   expect(product.id).toBeDefined()
  40  |   expect(product).toEqual({ ...ctx.usedProduct, id: product.id })
  41  | })
  42  | 
  43  | Given('an existing product with ID {int}', async ({ request, ctx }, productId: number) => {
  44  |   ctx.response = await request.get(`/products/${productId}`)
  45  |   expect(ctx.response.status()).toEqual(200)
  46  |   ctx.originalProduct = await ctx.response.json()
  47  |   expect(ctx.originalProduct.id).toEqual(productId)
  48  |   expect(ctx.originalProduct).toEqual(
  49  |     expect.objectContaining({
  50  |       title: expect.any(String),
  51  |       price: expect.any(Number),
  52  |       description: expect.any(String),
  53  |       brand: expect.any(String)
  54  |     })
  55  |   )
  56  | })
  57  | 
  58  | When(
  59  |   'I send a PATCH request to update product with ID {int} with a partial payload',
  60  |   async ({ request, ctx, minimalProduct }, productId: number) => {
  61  |     ctx.usedProduct = minimalProduct
  62  |     ctx.response = await request.patch(`/products/${productId}`, { data: minimalProduct })
  63  |   }
  64  | )
  65  | 
  66  | Then('the updated product should preserve unchanged fields', async ({ ctx }) => {
  67  |   const updatedProduct = await ctx.response.json()
  68  |   const expectedProduct = {
  69  |     ...ctx.usedProduct,
  70  |     id: ctx.originalProduct.id,
  71  |     category: ctx.originalProduct.category,
  72  |     discountPercentage: ctx.originalProduct.discountPercentage,
  73  |     stock: ctx.originalProduct.stock,
  74  |     thumbnail: ctx.originalProduct.thumbnail,
  75  |     rating: ctx.originalProduct.rating,
  76  |     images: ctx.originalProduct.images
  77  |   }
  78  |   expect(updatedProduct).toEqual(expectedProduct)
  79  | })
  80  | 
  81  | When('I send a GET request to {string} with delay {int}', async ({ request, ctx }, endpoint: string, delayMs: number) => {
  82  |   const start = Date.now()
  83  |   ctx.response = await request.get(endpoint, { params: { delay: delayMs } })
  84  |   const stop = Date.now()
  85  |   ctx.elapsedMs = stop - start
  86  | })
  87  | 
  88  | Then(
  89  |   'the response time should meet the dynamic threshold for delay {int} plus {int} ms',
  90  |   async ({ ctx }, delayMs: number, thresholdMs: number) => {
  91  |     expect(ctx.elapsedMs).toBeLessThanOrEqual(delayMs + thresholdMs)
  92  |   }
  93  | )
  94  | 
  95  | Then('the response time should be less than or equal to {int} ms', async ({ ctx }, expectedElapsedMs: number) => {
> 96  |   expect(ctx.elapsedMs).toBeLessThanOrEqual(expectedElapsedMs)
      |                         ^ Error: expect(received).toBeLessThanOrEqual(expected)
  97  | })
  98  | 
  99  | When('I send a GET request to {string} with invalid delay {string}', async ({ request, ctx }, endpoint: string, delayMs: string) => {
  100 |   ctx.response = await request.get(endpoint, { params: { delay: delayMs } })
  101 | })
  102 | 
  103 | Then('the error message {string} should be correct for delay {string}', async ({ ctx }, errorKey: string, delayMs: string) => {
  104 |   const message = (await ctx.response.json()).message
  105 |   expect(message).toEqual(ERRORS[errorKey as keyof typeof ERRORS])
  106 | })
  107 | 
```