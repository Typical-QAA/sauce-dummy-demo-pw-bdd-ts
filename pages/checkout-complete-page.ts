import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page'

export class CheckoutCompletePage extends BasePage {
  readonly URL = '/checkout-complete.html'
  readonly headerTitle = 'Checkout: Complete!'
  readonly container: Locator
  readonly completeLogo: Locator
  readonly completeHeader: Locator
  readonly completeText: Locator
  readonly backHomeButton: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.locator('#root')
    this.completeLogo = this.container.getByTestId('pony-express')
    this.completeHeader = this.container.getByTestId('complete-header')
    this.completeText = this.container.getByTestId('complete-text')
    this.backHomeButton = this.container.getByTestId('back-to-products')
  }
}
