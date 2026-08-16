import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AdminPage - Menangani User Management di modul Admin.
 */
export class AdminPage extends BasePage {
  readonly addUserButton: Locator;
  readonly userTable: Locator;
  readonly userRows: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly userRoleDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly noRecordsText: Locator;
  readonly totalRecordsText: Locator;

  constructor(page: Page) {
    super(page);
    this.addUserButton = page.locator('button:has-text("Add")').first();
    this.userTable = page.locator('.oxd-table-body');
    this.userRows = page.locator('.oxd-table-row--clickable');
    this.searchInput = page.locator('input[placeholder="Type for hints..."]').first();
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.resetButton = page.locator('button[type="reset"]:has-text("Reset")');
    this.userRoleDropdown = page.locator('.oxd-select-text').first();
    this.statusDropdown = page.locator('.oxd-select-text').nth(1);
    this.noRecordsText = page.locator('.oxd-text:has-text("No Records Found")');
    this.totalRecordsText = page.locator('.orangehrm-bottom-container span');
  }

  /** Buka halaman User Management */
  async goto() {
    await this.navigate('/web/index.php/admin/viewSystemUsers');
    await this.waitForPageLoad();
  }

  /** Buka halaman Job Titles */
  async gotoJobTitles() {
    await this.navigate('/web/index.php/admin/viewJobTitleList');
    await this.waitForPageLoad();
  }

  /** Search user berdasarkan username */
  async searchUser(username: string) {
    await this.fillInput(this.searchInput, username);
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  /** Reset filter pencarian */
  async resetSearch() {
    await this.clickElement(this.resetButton);
    await this.waitForPageLoad();
  }

  /** Hitung user di tabel */
  async getUserCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return this.userRows.count();
  }

  /** Ambil info total records */
  async getTotalRecords(): Promise<string> {
    try {
      return this.getText(this.totalRecordsText);
    } catch {
      return '0';
    }
  }

  /** Cek apakah hasil pencarian ada atau tidak */
  async hasNoRecords(): Promise<boolean> {
    return this.isVisible(this.noRecordsText);
  }
}
