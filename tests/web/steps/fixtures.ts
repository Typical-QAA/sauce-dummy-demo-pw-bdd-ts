import { test as base, createBdd } from 'playwright-bdd'
import type { ListItemDetails } from '../../..//types/web'
import { createShippingData } from '../../../data/web/factories'
import { CHECKOUT, ERRORS, SORTING, USERS } from '../../../data/web/static'
import {
  CartPage,
  CheckoutCompletePage,
  CheckoutOnePage,
  CheckoutTwoPage,
  InventoryItemPage,
  InventoryPage,
  LoginPage
} from '../../../pages'

export type Fixtures = {
  pages: {
    login: LoginPage
    inventory: InventoryPage
    inventoryItem: InventoryItemPage
    cart: CartPage
    checkoutOne: CheckoutOnePage
    checkoutTwo: CheckoutTwoPage
    checkoutComplete: CheckoutCompletePage
  }
  users: typeof USERS
  testData: { errors: typeof ERRORS; sorting: typeof SORTING; createShipping: typeof createShippingData; checkout: typeof CHECKOUT }

  ctx: { randomItem: ListItemDetails; itemsListAZ: ListItemDetails[]; itemName: string | null }
}

export const test = base.extend<Fixtures>({
  pages: async ({ page }, use) => {
    const pageFixtures = {
      login: new LoginPage(page),
      inventory: new InventoryPage(page),
      inventoryItem: new InventoryItemPage(page),
      cart: new CartPage(page),
      checkoutOne: new CheckoutOnePage(page),
      checkoutTwo: new CheckoutTwoPage(page),
      checkoutComplete: new CheckoutCompletePage(page)
    }
    await use(pageFixtures)
  },
  users: async ({}, use) => {
    await use(USERS)
  },

  testData: [
    async ({}, use) => {
      const dataFixtures = { errors: ERRORS, sorting: SORTING, createShipping: createShippingData, checkout: CHECKOUT }
      await use(dataFixtures)
    },
    { box: true }
  ],
  ctx: async ({}, use) => {
    const ctx: Fixtures['ctx'] = { randomItem: null as unknown as ListItemDetails, itemsListAZ: [], itemName: null as unknown as string }
    await use(ctx)
  }
})

export const { Given, When, Then } = createBdd(test)
