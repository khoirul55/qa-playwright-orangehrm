import { Page, Locator } from '@playwright/test';

/**
 * SidebarComponent - Navigasi sidebar kiri OrangeHRM.
 * Bisa dipakai di semua spec tanpa login ulang.
 */
export class SidebarComponent {
  readonly page: Page;
  readonly adminMenu: Locator;
  readonly pimMenu: Locator;
  readonly leaveMenu: Locator;
  readonly timeMenu: Locator;
  readonly recruitmentMenu: Locator;
  readonly myInfoMenu: Locator;
  readonly dashboardMenu: Locator;
  readonly directoryMenu: Locator;
  readonly maintenanceMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminMenu = page.locator('a[href="/web/index.php/admin/viewAdminModule"]');
    this.pimMenu = page.locator('a[href="/web/index.php/pim/viewPimModule"]');
    this.leaveMenu = page.locator('a[href="/web/index.php/leave/viewLeaveModule"]');
    this.timeMenu = page.locator('a[href="/web/index.php/time/viewTimeModule"]');
    this.recruitmentMenu = page.locator('a[href="/web/index.php/recruitment/viewRecruitmentModule"]');
    this.myInfoMenu = page.locator('a[href="/web/index.php/pim/viewMyDetails"]');
    this.dashboardMenu = page.locator('a[href="/web/index.php/dashboard/index"]');
    this.directoryMenu = page.locator('a[href="/web/index.php/directory/viewDirectory"]');
    this.maintenanceMenu = page.locator('a[href="/web/index.php/maintenance/viewMaintenanceModule"]');
  }

  async goToAdmin() {
    await this.adminMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPim() {
    await this.pimMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToLeave() {
    await this.leaveMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToRecruitment() {
    await this.recruitmentMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToDashboard() {
    await this.dashboardMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Cek apakah menu tertentu aktif/highlight */
  async isMenuActive(menu: Locator): Promise<boolean> {
    const classes = await menu.evaluate(el => el.className);
    return classes.includes('active');
  }
}
