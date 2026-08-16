import { test as base, Page } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * Auth Setup - Dijalankan sekali untuk menyimpan session login.
 * File: tests/auth.setup.ts
 * Hasilnya disimpan di playwright/.auth/admin.json
 */
export async function loginAndSaveSession(page: Page) {
  await page.goto(`${BASE_URL}/web/index.php/auth/login`);
  await page.locator('input[name="username"]').fill(ADMIN_USERNAME);
  await page.locator('input[name="password"]').fill(ADMIN_PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/dashboard/index', { timeout: 30000 });
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });
}

export { ADMIN_USERNAME, ADMIN_PASSWORD, BASE_URL };
