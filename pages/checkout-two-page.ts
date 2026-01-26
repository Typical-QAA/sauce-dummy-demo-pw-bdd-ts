import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page'
import { CheckoutItemCard, ItemsListCart } from './components'

export class CheckoutTwoPage extends BasePage {
  readonly URL = '/checkout-step-two.html'
  readonly headerTitle = 'Checkout: Overview'
  readonly container: Locator
  readonly items: ItemsListCart<CheckoutItemCard>
  readonly cancelButton: Locator
  readonly finishButton: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.locator('#root')
    this.items = new ItemsListCart(this.container.getByTestId('cart-list'), CheckoutItemCard)
    this.cancelButton = this.container.getByTestId('cancel')
    this.finishButton = this.container.getByTestId('finish')
  }
}
