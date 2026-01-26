import type { Page } from '@playwright/test'
import { HeaderComponent } from './components'

export abstract class BasePage {
  readonly page: Page
  abstract readonly URL: string
  readonly header: HeaderComponent

  constructor(page: Page) {
    this.page = page
    this.header = new HeaderComponent(page.getByTestId('header-container'))
  }
}
