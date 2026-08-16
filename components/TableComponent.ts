import { Page, Locator } from '@playwright/test';

/**
 * TableComponent - Helper reusable untuk berinteraksi dengan tabel OrangeHRM.
 */
export class TableComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Hitung total baris di tabel */
  async getRowCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return this.page.locator('.oxd-table-row--clickable').count();
  }

  /** Ambil teks dari kolom tertentu pada baris tertentu (0-indexed) */
  async getCellText(rowIndex: number, colIndex: number): Promise<string> {
    const row = this.page.locator('.oxd-table-row--clickable').nth(rowIndex);
    const cell = row.locator('.oxd-table-cell').nth(colIndex);
    return (await cell.textContent()) ?? '';
  }

  /** Cek apakah teks tertentu ada di tabel */
  async hasTextInTable(text: string): Promise<boolean> {
    const table = this.page.locator('.oxd-table-body');
    const content = await table.textContent();
    return (content ?? '').includes(text);
  }

  /** Klik action button (edit/delete) pada baris tertentu */
  async clickActionButton(rowIndex: number, buttonType: 'edit' | 'delete') {
    const row = this.page.locator('.oxd-table-row--clickable').nth(rowIndex);
    const icon = buttonType === 'edit' ? '.bi-pencil-fill' : '.bi-trash';
    const button = row.locator(`button:has(${icon})`);
    await button.click();
    await this.page.waitForTimeout(500);
  }

  /** Pilih semua checkbox di tabel */
  async selectAllRows() {
    const headerCheckbox = this.page.locator('.oxd-table-header .oxd-checkbox-input');
    await headerCheckbox.check();
  }

  /** Hapus semua yang dipilih (bulk delete) */
  async deleteSelected() {
    const deleteSelectedBtn = this.page.locator('button:has-text("Delete Selected")');
    await deleteSelectedBtn.click();
    const confirmBtn = this.page.locator('.oxd-button--label-danger:has-text("Yes, Delete")');
    await confirmBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}
