import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage - Menangani interaksi di halaman dashboard setelah login.
 */
export class DashboardPage extends BasePage {
  readonly pageHeader: Locator;
  readonly quickLaunchWidgets: Locator;
  readonly timeAtWorkWidget: Locator;
  readonly myActionsWidget: Locator;
  readonly buzzFeedWidget: Locator;
  readonly employeeOnLeaveWidget: Locator;
  readonly employeeDistributionWidget: Locator;
  readonly userDropdown: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.quickLaunchWidgets = page.locator('.orangehrm-quick-launch-card');
    this.timeAtWorkWidget = page.locator('.orangehrm-attendance-card');
    this.myActionsWidget = page.locator('.orangehrm-action-widget');
    this.buzzFeedWidget = page.locator('.orangehrm-buzz-stats');
    this.employeeOnLeaveWidget = page.locator('.emp-on-leave-widget');
    this.employeeDistributionWidget = page.locator('.orangehrm-dashboard-widget');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutMenuItem = page.locator('a[href="/web/index.php/auth/logout"]');
  }

  /** Navigasi ke dashboard */
  async goto() {
    await this.navigate('/web/index.php/dashboard/index');
    await this.waitForPageLoad();
  }

  /** Ambil judul halaman */
  async getPageTitle(): Promise<string> {
    return this.getText(this.pageHeader);
  }

  /** Hitung jumlah Quick Launch cards */
  async getQuickLaunchCount(): Promise<number> {
    await this.waitForVisible(this.quickLaunchWidgets.first());
    return this.quickLaunchWidgets.count();
  }

  /** Klik user dropdown di pojok kanan atas */
  async openUserDropdown() {
    await this.clickElement(this.userDropdown);
  }

  /** Logout dari aplikasi */
  async logout() {
    await this.openUserDropdown();
    await this.clickElement(this.logoutMenuItem);
    await this.page.waitForURL('**/auth/login', { timeout: 10000 });
  }

  /** Ambil nama user yang sedang login (dari dropdown) */
  async getLoggedInUsername(): Promise<string> {
    return this.getText(this.userDropdown);
  }

  /** Ukur waktu load dashboard */
  async getDashboardLoadTime(): Promise<number> {
    const start = Date.now();
    await this.goto();
    await this.waitForVisible(this.quickLaunchWidgets.first());
    return Date.now() - start;
  }
}
