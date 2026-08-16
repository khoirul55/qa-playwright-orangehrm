import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - Menangani semua interaksi di halaman login OrangeHRM.
 */
export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly resetUsernameInput: Locator;
  readonly resetSubmitButton: Locator;
  readonly resetSuccessMessage: Locator;
  readonly companyLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot > p');
    this.resetUsernameInput = page.locator('input[name="username"]');
    this.resetSubmitButton = page.locator('button[type="submit"]');
    this.resetSuccessMessage = page.locator('.orangehrm-forgot-password-title');
    this.companyLogo = page.locator('.orangehrm-login-branding img');
  }

  /** Buka halaman login */
  async goto() {
    await this.navigate('/web/index.php/auth/login');
    await this.waitForVisible(this.usernameInput);
  }

  /** Login dengan username dan password */
  async login(username: string, password: string) {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  /** Ambil pesan error saat login gagal */
  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return (await this.errorMessage.textContent()) ?? '';
  }

  /** Klik link "Forgot Password" */
  async clickForgotPassword() {
    await this.clickElement(this.forgotPasswordLink);
  }

  /** Submit form reset password */
  async submitForgotPassword(username: string) {
    await this.fillInput(this.resetUsernameInput, username);
    await this.clickElement(this.resetSubmitButton);
  }

  /** Cek apakah logo perusahaan tampil */
  async isLogoVisible(): Promise<boolean> {
    return this.isVisible(this.companyLogo);
  }

  /** Verifikasi user sudah login dengan cek URL */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.waitForURL('**/dashboard/index', { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
