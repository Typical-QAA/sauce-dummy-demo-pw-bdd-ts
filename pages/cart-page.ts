import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page'
import { CartItemCard, ItemsListCart } from './components'

export class CartPage extends BasePage {
  readonly URL = '/cart.html'
  readonly headerTitle = 'Your Cart'
  readonly container: Locator
  readonly items: ItemsListCart<CartItemCard>
  readonly continueShoppingButton: Locator
  readonly checkoutButton: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.locator('#root')
    this.items = new ItemsListCart(this.container.getByTestId('cart-list'), CartItemCard)
    this.continueShoppingButton = this.container.getByTestId('continue-shopping')
    this.checkoutButton = this.container.getByTestId('checkout')
  }
}
