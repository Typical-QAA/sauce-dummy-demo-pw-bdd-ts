import type { Locator } from '@playwright/test'

export abstract class ItemCard {
  readonly container: Locator
  readonly name: Locator
  readonly description: Locator
  readonly price: Locator

  constructor(container: Locator) {
    this.container = container
    this.name = this.container.getByTestId('inventory-item-name')
    this.description = this.container.getByTestId('inventory-item-desc')
    this.price = this.container.getByTestId('inventory-item-price')
  }
}

export class CheckoutItemCard extends ItemCard {
  readonly quantity: Locator

  constructor(container: Locator) {
    super(container)
    this.quantity = this.container.getByTestId('item-quantity')
  }
}

export class CartItemCard extends CheckoutItemCard {
  readonly removeButton: Locator

  constructor(container: Locator) {
    super(container)
    this.removeButton = this.container.locator('div.item_pricebar > button.btn_secondary')
  }
}

export class ListItemCard extends ItemCard {
  readonly image: Locator
  readonly addButton: Locator
  readonly removeButton: Locator

  constructor(container: Locator) {
    super(container)
    this.image = this.container.locator('div.inventory_item_img')
    this.addButton = this.container.locator('button.btn_primary')
    this.removeButton = this.container.locator('button.btn_secondary')
  }
}

export class DetalisItemCard extends ItemCard {
  readonly image: Locator
  readonly addButton: Locator
  readonly removeButton: Locator

  constructor(container: Locator) {
    super(container)
    this.image = this.container.locator('div.inventory_details_img_container')
    this.addButton = this.container.getByTestId('add-to-cart')
    this.removeButton = this.container.getByTestId('remove')
  }
}
