import type { Locator, Page } from '@playwright/test'
import { BasePage } from './base-page'
import { ItemsList, ListItemCard } from './components'

export class InventoryPage extends BasePage {
  readonly URL = '/inventory.html'
  readonly headerTitle = 'Products'
  readonly container: Locator
  readonly items: ItemsList<ListItemCard>

  constructor(page: Page) {
    super(page)
    this.container = page.locator('#root')
    this.items = new ItemsList(page.getByTestId('inventory-list'), ListItemCard)
  }

  async allNames() {
    return await this.container.getByTestId('inventory-item-name').allTextContents()
  }

  async addAllToCart() {
    const items = await this.items.items.all()
    for (const locator of items) {
      await new ListItemCard(locator).addButton.click()
    }
    return items.length
  }
}
