import { Page, Locator } from '@playwright/test';

/**
 * TopBarComponent - Header/navbar atas OrangeHRM.
 */
export class TopBarComponent {
  readonly page: Page;
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;
  readonly profileLink: Locator;
  readonly notificationBell: Locator;
  readonly searchBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.locator('a[href="/web/index.php/auth/logout"]');
    this.profileLink = page.locator('.oxd-userdropdown-link:has-text("My Info")');
    this.notificationBell = page.locator('.oxd-topbar-body-nav-tab:has(.bi-bell)');
    this.searchBar = page.locator('.oxd-input.oxd-input--focus');
  }

  async openUserDropdown() {
    await this.userDropdown.click();
    await this.page.waitForSelector('.oxd-dropdown-menu', { state: 'visible' });
  }

  async logout() {
    await this.openUserDropdown();
    await this.logoutLink.click();
    await this.page.waitForURL('**/auth/login');
  }

  async getLoggedInUser(): Promise<string> {
    return (await this.userDropdown.textContent()) ?? '';
  }
}
