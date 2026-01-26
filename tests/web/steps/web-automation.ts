import { expect, Locator, Page } from '@playwright/test'
import { Given, Then, When } from './fixtures'

type PageWithHeader = { page: Page; header: { headerSecondary: { title: Locator } }; URL: string; headerTitle: string }

export async function verifyPageUrlAndHeaderTitle(pageObject: PageWithHeader) {
  await expect(pageObject.page).toHaveURL(pageObject.URL)
  await expect(pageObject.header.headerSecondary.title).toHaveText(pageObject.headerTitle)
}

Given('I am logged as {string} user on inventory page', async ({ pages, users }, userKey: string) => {
  const user = users[userKey as keyof typeof users]
  await pages.login.page.goto('/')
  await pages.login.fillAndSubmit(user)
  await verifyPageUrlAndHeaderTitle(pages.inventory)
})

When('I click sorting and select {string} on inventory page', async ({ pages }, sortBy: string) => {
  await pages.inventory.header.headerSecondary.sortSelect.selectOption(sortBy)
})

Then('I see items sorted by their names in {string} order on inventory page', async ({ pages, testData }, sortBy: string) => {
  await expect(pages.inventory.header.headerSecondary.sortActive).toHaveText(sortBy)
  const sorters: Record<string, (arr: any[]) => any[]> = {
    az: arr => [...arr].sort((a, b) => a.localeCompare(b)),
    za: arr => [...arr].sort((a, b) => b.localeCompare(a)),
    lohi: arr => [...arr].sort((a, b) => a - b),
    hilo: arr => [...arr].sort((a, b) => b - a)
  }
  const sortKey = Object.keys(testData.sorting).find(
    key => testData.sorting[key as keyof typeof testData.sorting] === sortBy
  ) as keyof typeof sorters
  const allNames = (await pages.inventory.items.allDetails()).map(item => item.name)
  const expectedNames = sorters[sortKey](allNames)
  const allNamesSorted = (await pages.inventory.items.allDetails()).map(item => item.name)
  expect(allNamesSorted).toEqual(expectedNames)
})

Given('I am on the login page', async ({ pages }) => {
  await pages.login.page.goto('/')
})

When('I attempt to log in as {string}', async ({ pages, users }, userKey: string) => {
  const user = users[userKey as keyof typeof users]
  await pages.login.page.goto('/')
  await pages.login.fillAndSubmit(user)
})

Then('I should see a login error message {string}', async ({ pages, testData }, errorKey: string) => {
  await expect(pages.login.form.errorMessage).toBeVisible()
  await expect(pages.login.form.errorMessage).toHaveText(testData.errors[errorKey as keyof typeof testData.errors])
})

Then('the login inputs should be highlighted with the error class', async ({ pages }) => {
  const inputErrorClass = 'input_error'
  const checkElements = [pages.login.form.usernameInput, pages.login.form.passwordInput]
  for (const el of checkElements) {
    await expect(el).toContainClass(inputErrorClass)
  }
})

When('I open a random item page from inventory page', async ({ pages, ctx }) => {
  const allItems = await pages.inventory.items.allDetails()
  ctx.randomItem = allItems[Math.floor(Math.random() * allItems.length)]
  await pages.inventory.items.itemByName(ctx.randomItem.name).name.click()
})

Then('the item details on item page should match the inventory data', async ({ pages, ctx }) => {
  await expect(pages.inventoryItem.page).toHaveURL(pages.inventoryItem.URL + ctx.randomItem.id)
  const { id, ...expecdetDetails } = ctx.randomItem
  const itemDetails = {
    name: await pages.inventoryItem.itemDetalis.name.textContent(),
    description: await pages.inventoryItem.itemDetalis.description.textContent(),
    price: await pages.inventoryItem.itemDetalis.price.textContent()
  }
  expect(itemDetails).toEqual(expecdetDetails)
})

When('I add the item from item page to the cart and open the cart page', async ({ pages }) => {
  await pages.inventoryItem.itemDetalis.addButton.click()
  await pages.inventoryItem.header.headerPrimary.shoppingCart.click()
  verifyPageUrlAndHeaderTitle(pages.cart)
})

Then('the cart should contain the selected {int} item and have a proper badge count', async ({ pages, ctx }, itemsCount: number) => {
  const cartItems = await pages.cart.items.allDetails()
  expect(cartItems.length).toEqual(itemsCount)
  expect(await pages.cart.header.headerPrimary.shoppingBadge.textContent()).toEqual(itemsCount.toString())
  const { quantity, ...cartItem } = cartItems[0]
  expect(cartItem).toEqual(ctx.randomItem)
})

When('I add all {int} items from the inventory page to the cart', async ({ pages, ctx }, itemsAmount: number) => {
  ctx.itemsListAZ = (await pages.inventory.items.allDetails()).sort((a, b) => a.name.localeCompare(b.name))
  expect(ctx.itemsListAZ.length).toEqual(itemsAmount)
  await pages.inventory.addAllToCart()
})

When('I open the cart page', async ({ pages }) => {
  await pages.inventory.header.headerPrimary.shoppingCart.click()
  await verifyPageUrlAndHeaderTitle(pages.cart)
})

Then('the cart should contain all {int} inventory items', async ({ pages, ctx }, itemsAmount: number) => {
  const cartAllItemsBeforeAZ = (await pages.cart.items.allDetails()).sort((a, b) => a.name.localeCompare(b.name))
  expect(cartAllItemsBeforeAZ.length).toEqual(itemsAmount)
  expect(cartAllItemsBeforeAZ.map(({ quantity, ...rest }) => rest)).toEqual(ctx.itemsListAZ)
  expect(await pages.cart.header.headerPrimary.shoppingBadge.textContent()).toEqual(itemsAmount.toString())
})

When('I remove the item at index {int} from the cart', async ({ pages, ctx }, itemIndex: number) => {
  const itemRemove = pages.cart.items.itemByIndex(itemIndex)
  ctx.itemName = await itemRemove!.name.textContent()
  await itemRemove.removeButton.click()
})

Then('the cart should be updated with the remaining {int} items', async ({ pages, ctx }, itemsAmount: number) => {
  ctx.itemsListAZ = (await pages.cart.items.allDetails()).sort((a, b) => a.name.localeCompare(b.name))
  expect(ctx.itemsListAZ.length).toEqual(itemsAmount)
  expect(await pages.cart.header.headerPrimary.shoppingBadge.textContent()).toEqual(itemsAmount.toString())
  await expect(pages.cart.items.itemByName(ctx.itemName!).name).not.toBeVisible()
})

When('I proceed to checkout, enter shipping information and proceed to checkout overview', async ({ pages, testData }) => {
  await pages.cart.checkoutButton.click()
  await verifyPageUrlAndHeaderTitle(pages.checkoutOne)
  await pages.checkoutOne.fillAndSubmit(testData.createShipping())
})

Then('the checkout overview should show the correct items', async ({ pages, ctx }) => {
  await verifyPageUrlAndHeaderTitle(pages.checkoutTwo)
  const checkoutAllItemsAZ = (await pages.checkoutTwo.items.allDetails()).sort((a, b) => a.name.localeCompare(b.name))
  expect(checkoutAllItemsAZ).toEqual(ctx.itemsListAZ)
})

When('I finish the checkout', async ({ pages }) => {
  await pages.checkoutTwo.finishButton.click()
})

Then('I should see the order confirmation {string}', async ({ pages, testData }, statusKey: string) => {
  await verifyPageUrlAndHeaderTitle(pages.checkoutComplete)
  await expect(pages.checkoutComplete.completeLogo).toBeVisible()
  await expect(pages.checkoutComplete.completeHeader).toHaveText(testData.checkout[statusKey as keyof typeof testData.checkout].HEADER)
  await expect(pages.checkoutComplete.completeText).toHaveText(testData.checkout[statusKey as keyof typeof testData.checkout].TEXT)
})
