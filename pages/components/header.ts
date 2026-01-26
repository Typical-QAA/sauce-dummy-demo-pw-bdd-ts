import type { Locator } from '@playwright/test'

class HeaderPrimary {
  readonly container: Locator
  readonly sideButton: Locator
  readonly headerLabel: Locator
  readonly shoppingCart: Locator
  readonly shoppingBadge: Locator

  constructor(container: Locator) {
    this.container = container
    this.sideButton = this.container.locator('div.bm-burger-button')
    this.headerLabel = this.container.locator('div.header_label')
    this.shoppingCart = this.container.getByTestId('shopping-cart-link')
    this.shoppingBadge = this.container.getByTestId('shopping-cart-badge')
  }
}

class HeaderSecondary {
  readonly container: Locator
  readonly title: Locator
  readonly sortActive: Locator
  readonly sortSelect: Locator
  readonly backToBroducts: Locator

  constructor(container: Locator) {
    this.container = container
    this.title = this.container.getByTestId('title')
    this.sortActive = this.container.getByTestId('active-option')
    this.sortSelect = this.container.getByTestId('product-sort-container')
    this.backToBroducts = this.container.getByTestId('back-to-products')
  }
}

export class HeaderComponent {
  readonly container: Locator
  readonly headerPrimary: HeaderPrimary
  readonly headerSecondary: HeaderSecondary

  constructor(container: Locator) {
    this.container = container
    this.headerPrimary = new HeaderPrimary(this.container.getByTestId('primary-header'))
    this.headerSecondary = new HeaderSecondary(this.container.getByTestId('secondary-header'))
  }
}
