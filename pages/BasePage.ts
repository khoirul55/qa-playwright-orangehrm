import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Parent class untuk semua Page Object.
 * Berisi helper methods yang dipakai di semua halaman.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigasi ke URL relatif */
  async navigate(path: string = '') {
    await this.page.goto(path);
  }

  /** Tunggu elemen muncul dan visible */
  async waitForVisible(locator: Locator, timeout = 15000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /** Klik dengan tunggu sampai stabil */
  async clickElement(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.click();
  }

  /** Isi input field (clear dulu lalu ketik) */
  async fillInput(locator: Locator, value: string) {
    await this.waitForVisible(locator);
    await locator.clear();
    await locator.fill(value);
  }

  /** Ambil teks dari elemen */
  async getText(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    return (await locator.textContent()) ?? '';
  }

  /** Cek elemen ada di halaman */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /** Tunggu loading spinner hilang */
  async waitForPageLoad() {
    // OrangeHRM pakai spinner class ini
    const spinner = this.page.locator('.oxd-loading-spinner');
    try {
      await spinner.waitFor({ state: 'hidden', timeout: 15000 });
    } catch {
      // spinner mungkin tidak muncul, lanjut saja
    }
  }

  /** Ambil toast/alert message (success atau error) */
  async getToastMessage(): Promise<string> {
    const toast = this.page.locator('.oxd-toast-content');
    await this.waitForVisible(toast, 8000);
    return (await toast.textContent()) ?? '';
  }

  /** Measure waktu load halaman (untuk performance test) */
  async measurePageLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.page.waitForLoadState('networkidle');
    return Date.now() - startTime;
  }
}
