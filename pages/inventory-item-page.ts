import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page'
import { DetalisItemCard } from './components'

export class InventoryItemPage extends BasePage {
  readonly URL = '/inventory-item.html?id='
  readonly container: Locator
  readonly itemDetalis: DetalisItemCard

  constructor(page: Page) {
    super(page)
    this.container = page.locator('#root')
    this.itemDetalis = new DetalisItemCard(this.container.getByTestId('inventory-item'))
  }
}
