import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * RecruitmentPage - Menangani fitur Recruitment (lowongan & kandidat).
 */
export class RecruitmentPage extends BasePage {
  readonly addVacancyButton: Locator;
  readonly vacancyTable: Locator;
  readonly vacancyRows: Locator;
  readonly jobTitleDropdown: Locator;
  readonly vacancyNameInput: Locator;
  readonly hiringManagerInput: Locator;
  readonly saveButton: Locator;
  readonly searchButton: Locator;
  readonly candidateRows: Locator;
  readonly statusDropdown: Locator;
  readonly noRecordsText: Locator;

  constructor(page: Page) {
    super(page);
    this.addVacancyButton = page.locator('button:has-text("Add")').first();
    this.vacancyTable = page.locator('.oxd-table-body');
    this.vacancyRows = page.locator('.oxd-table-row--clickable');
    this.jobTitleDropdown = page.locator('.oxd-select-text').first();
    this.vacancyNameInput = page.locator('input[placeholder="Type vacancy name"]');
    this.hiringManagerInput = page.locator('input[placeholder="Type for hints..."]').first();
    this.saveButton = page.locator('button[type="submit"]:has-text("Save")');
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.candidateRows = page.locator('.oxd-table-row--clickable');
    this.statusDropdown = page.locator('.oxd-select-text').first();
    this.noRecordsText = page.locator('.oxd-text:has-text("No Records Found")');
  }

  /** Buka halaman Vacancies */
  async gotoVacancies() {
    await this.navigate('/web/index.php/recruitment/viewJobVacancy');
    await this.waitForPageLoad();
  }

  /** Buka halaman Candidates */
  async gotoCandidates() {
    await this.navigate('/web/index.php/recruitment/viewCandidates');
    await this.waitForPageLoad();
  }

  /** Hitung baris di tabel */
  async getRowCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    const rows = this.page.locator('.oxd-table-row--clickable');
    return rows.count();
  }

  /** Search candidates (kosong = tampilkan semua) */
  async searchCandidates() {
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  /** Cek apakah "No Records Found" muncul */
  async hasNoRecords(): Promise<boolean> {
    return this.isVisible(this.noRecordsText);
  }

  /** Ambil teks dari kolom pertama baris pertama */
  async getFirstRowText(): Promise<string> {
    const firstRow = this.page.locator('.oxd-table-row--clickable').first();
    await this.waitForVisible(firstRow);
    return (await firstRow.textContent()) ?? '';
  }
}
