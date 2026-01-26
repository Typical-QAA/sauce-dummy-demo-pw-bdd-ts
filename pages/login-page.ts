import type { Locator, Page } from '@playwright/test'
import type { UserDataCredentials } from '../types/web'
import { BasePage } from './base-page'

class Form {
  readonly container: Locator
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly errorMessage: Locator

  constructor(container: Locator) {
    this.container = container
    this.usernameInput = this.container.getByTestId('username')
    this.passwordInput = this.container.getByTestId('password')
    this.loginButton = this.container.getByTestId('login-button')
    this.errorMessage = this.container.getByTestId('error')
  }
}

export class LoginPage extends BasePage {
  readonly URL = '/'
  readonly container: Locator
  readonly form: Form

  constructor(page: Page) {
    super(page)
    this.container = page.locator('#root')
    this.form = new Form(page.getByTestId('login-container'))
  }

  async fillAndSubmit(user: UserDataCredentials) {
    await this.form.usernameInput.fill(user.username)
    await this.form.passwordInput.fill(user.password)
    await this.form.loginButton.click()
  }
}
