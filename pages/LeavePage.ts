import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LeavePage - Menangani fitur Leave Management (izin/cuti).
 */
export class LeavePage extends BasePage {
  readonly applyLeaveMenu: Locator;
  readonly myLeaveMenu: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly commentInput: Locator;
  readonly applyButton: Locator;
  readonly leaveTable: Locator;
  readonly leaveRows: Locator;
  readonly filterFromDate: Locator;
  readonly filterToDate: Locator;
  readonly searchButton: Locator;
  readonly noRecordsText: Locator;
  readonly leaveBalanceText: Locator;

  constructor(page: Page) {
    super(page);
    this.applyLeaveMenu = page.locator('.oxd-main-menu-item:has-text("Apply")');
    this.myLeaveMenu = page.locator('.oxd-main-menu-item:has-text("My Leave")');
    this.leaveTypeDropdown = page.locator('.oxd-select-text').first();
    this.fromDateInput = page.locator('input[placeholder="yyyy-dd-mm"]').first();
    this.toDateInput = page.locator('input[placeholder="yyyy-dd-mm"]').last();
    this.commentInput = page.locator('textarea.oxd-textarea');
    this.applyButton = page.locator('button[type="submit"]:has-text("Apply")');
    this.leaveTable = page.locator('.oxd-table-body');
    this.leaveRows = page.locator('.oxd-table-row--clickable');
    this.filterFromDate = page.locator('input[placeholder="yyyy-dd-mm"]').first();
    this.filterToDate = page.locator('input[placeholder="yyyy-dd-mm"]').last();
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.noRecordsText = page.locator('.oxd-text:has-text("No Records Found")');
    this.leaveBalanceText = page.locator('.orangehrm-leave-balance');
  }

  /** Buka halaman Apply Leave */
  async gotoApplyLeave() {
    await this.navigate('/web/index.php/leave/applyLeave');
    await this.waitForPageLoad();
  }

  /** Buka halaman My Leave list */
  async gotoMyLeave() {
    await this.navigate('/web/index.php/leave/viewMyLeaveList');
    await this.waitForPageLoad();
  }

  /** Buka halaman Leave List (admin view) */
  async gotoLeaveList() {
    await this.navigate('/web/index.php/leave/viewLeaveList');
    await this.waitForPageLoad();
  }

  /** Pilih tipe leave dari dropdown */
  async selectLeaveType(type: string) {
    await this.clickElement(this.leaveTypeDropdown);
    const option = this.page.locator(`.oxd-select-option:has-text("${type}")`);
    await this.clickElement(option);
  }

  /** Isi tanggal dari - sampai */
  async fillLeaveDates(fromDate: string, toDate: string) {
    await this.fillInput(this.fromDateInput, fromDate);
    await this.page.keyboard.press('Tab');
    await this.fillInput(this.toDateInput, toDate);
    await this.page.keyboard.press('Tab');
  }

  /** Isi komentar alasan izin */
  async fillComment(comment: string) {
    await this.fillInput(this.commentInput, comment);
  }

  /** Submit form apply leave */
  async submitLeave() {
    await this.clickElement(this.applyButton);
    await this.waitForPageLoad();
  }

  /** Hitung baris di tabel leave */
  async getLeaveRowCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return this.leaveRows.count();
  }

  /** Filter leave berdasarkan tanggal */
  async filterByDate(from: string, to: string) {
    await this.fillInput(this.filterFromDate, from);
    await this.page.keyboard.press('Tab');
    await this.fillInput(this.filterToDate, to);
    await this.page.keyboard.press('Tab');
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }
}
