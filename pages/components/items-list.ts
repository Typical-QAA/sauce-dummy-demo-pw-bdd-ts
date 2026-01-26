import type { Locator } from '@playwright/test'
import type { CartItemDetails, ListItemDetails } from '../../types/web'
import { CheckoutItemCard, ItemCard } from './item-card'

export class ItemsList<T extends ItemCard, D extends ListItemDetails = ListItemDetails> {
  readonly container: Locator
  readonly items: Locator

  constructor(
    container: Locator,
    private cardClass: new (loc: Locator) => T,
    private detailsMapper?: (item: T) => Promise<D>
  ) {
    this.container = container
    this.items = this.container.getByTestId('inventory-item')
    if (!this.detailsMapper) {
      this.detailsMapper = async (item: T) => {
        const id = await this.extractItemId(item.container)
        return {
          id,
          name: (await item.name.textContent()) ?? '',
          description: (await item.description.textContent()) ?? '',
          price: (await item.price.textContent()) ?? ''
        } as D
      }
    }
  }

  protected async extractItemId(container: Locator): Promise<string> {
    const link = container.locator('a[data-test^="item-"][data-test$="-title-link"]')
    const dataTestValue = await link.getAttribute('data-test')

    if (!dataTestValue) {
      return ''
    }

    const match = dataTestValue.match(/item-(\d+)-title-link/)
    return match ? match[1] : ''
  }

  itemByIndex(index: number): T {
    return new this.cardClass(this.items.nth(index))
  }

  itemById(id: number | string): T {
    const locator = this.items.filter({ has: this.items.page().getByTestId(`item-${id}-title-link`) })
    return new this.cardClass(locator)
  }

  itemByName(name: string): T {
    return new this.cardClass(this.items.filter({ hasText: name }))
  }

  async allDetails(): Promise<D[]> {
    const itemLocators = await this.items.all()
    return Promise.all(itemLocators.map(locator => this.detailsMapper!(new this.cardClass(locator))))
  }
}

export class ItemsListCart<T extends CheckoutItemCard> extends ItemsList<T, CartItemDetails> {
  constructor(container: Locator, cardClass: new (loc: Locator) => T) {
    super(container, cardClass, async (item: T) => {
      const id = await this.extractItemId(item.container)
      return {
        id,
        name: (await item.name.textContent()) ?? '',
        description: (await item.description.textContent()) ?? '',
        quantity: (await item.quantity.textContent()) ?? '',
        price: (await item.price.textContent()) ?? ''
      }
    })
  }
}
