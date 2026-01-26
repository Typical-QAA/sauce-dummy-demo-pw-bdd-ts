import type { Locator, Page } from '@playwright/test'
import type { ShippingData } from '../types/web'
import { BasePage } from './base-page'

class Form {
  readonly container: Locator
  readonly firstNameInput: Locator
  readonly lastNameInput: Locator
  readonly postalInput: Locator
  readonly errorMessage: Locator

  constructor(container: Locator) {
    this.container = container
    this.firstNameInput = this.container.getByTestId('firstName')
    this.lastNameInput = this.container.getByTestId('lastName')
    this.postalInput = this.container.getByTestId('postalCode')
    this.errorMessage = this.container.getByTestId('error')
  }
}

export class CheckoutOnePage extends BasePage {
  readonly URL = '/checkout-step-one.html'
  readonly headerTitle = 'Checkout: Your Information'
  readonly container: Locator
  readonly form: Form
  readonly cancelButton: Locator
  readonly continueButton: Locator

  constructor(page: Page) {
    super(page)
    this.container = page.locator('#root')
    this.form = new Form(this.container.locator('div.checkout_info'))
    this.cancelButton = this.container.getByTestId('cancel')
    this.continueButton = this.container.getByTestId('continue')
  }

  async fillAndSubmit(data: ShippingData) {
    await this.form.firstNameInput.fill(data.firstName)
    await this.form.lastNameInput.fill(data.lastName)
    await this.form.postalInput.fill(data.postal)
    await this.continueButton.click()
  }
}
