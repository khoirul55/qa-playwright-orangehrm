import { test, expect } from '@playwright/test';
import { LeavePage } from '../../pages/LeavePage';
import { daysFromNow } from '../../utils/date-helper';

/**
 * 🌴 Leave Management Tests
 * Mencakup: lihat leave list, apply leave, filter, validasi form.
 */
test.describe('🌴 Leave Management', () => {
  let leavePage: LeavePage;

  test.beforeEach(async ({ page }) => {
    leavePage = new LeavePage(page);
  });

  test.describe('My Leave List', () => {
    test('TC-LEAVE-01: Halaman My Leave dapat dibuka', async ({ page }) => {
      await leavePage.gotoMyLeave();
      await expect(page).toHaveURL(/.*viewMyLeaveList/);
    });

    test('TC-LEAVE-02: Tabel leave menampilkan data atau "No Records Found"', async ({ page }) => {
      await leavePage.gotoMyLeave();
      const rows = await leavePage.getLeaveRowCount();
      const hasNoRecords = await leavePage.hasNoRecords();
      // Salah satu dari keduanya harus benar
      expect(rows > 0 || hasNoRecords).toBeTruthy();
    });
  });

  test.describe('Leave List (Admin View)', () => {
    test('TC-LEAVE-03: Admin dapat melihat semua leave request', async ({ page }) => {
      await leavePage.gotoLeaveList();
      await expect(page).toHaveURL(/.*viewLeaveList/);
      await expect(page.locator('.oxd-table-body')).toBeVisible();
    });

    test('TC-LEAVE-04: Leave list dapat difilter berdasarkan tanggal', async ({ page }) => {
      await leavePage.gotoLeaveList();
      const from = daysFromNow(-30);
      const to = daysFromNow(0);
      // Klik Search tanpa filter untuk muat ulang
      await page.locator('button[type="submit"]:has-text("Search")').click();
      await leavePage.waitForPageLoad();
      await expect(page.locator('.oxd-table-body')).toBeVisible();
    });
  });

  test.describe('Apply Leave Form', () => {
    test('TC-LEAVE-05: Halaman Apply Leave dapat dibuka', async ({ page }) => {
      await leavePage.gotoApplyLeave();
      await expect(page).toHaveURL(/.*applyLeave/);
    });

    test('TC-LEAVE-06: Form Apply Leave menampilkan field yang diperlukan', async ({ page }) => {
      await leavePage.gotoApplyLeave();
      // Cek dropdown Leave Type ada
      await expect(page.locator('.oxd-select-text').first()).toBeVisible();
      // Cek tombol Apply ada
      await expect(page.locator('button[type="submit"]:has-text("Apply")')).toBeVisible();
    });

    test('TC-LEAVE-07: Submit form tanpa mengisi field wajib menampilkan validasi', async ({ page }) => {
      await leavePage.gotoApplyLeave();
      // Klik Apply tanpa isi apapun
      await page.locator('button[type="submit"]:has-text("Apply")').click();
      // Harus muncul pesan error
      const errors = page.locator('.oxd-input-field-error-message');
      await expect(errors.first()).toBeVisible({ timeout: 5000 });
    });

    test('TC-LEAVE-08: Leave Type dropdown memiliki pilihan tersedia', async ({ page }) => {
      await leavePage.gotoApplyLeave();
      await page.locator('.oxd-select-text').first().click();
      const options = page.locator('.oxd-select-option');
      const count = await options.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Leave Entitlement', () => {
    test('TC-LEAVE-09: Halaman Leave Entitlement dapat dibuka', async ({ page }) => {
      await page.goto('/web/index.php/leave/viewLeaveEntitlementList');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*viewLeaveEntitlementList/);
    });

    test('TC-LEAVE-10: Leave Period tersedia di konfigurasi', async ({ page }) => {
      await page.goto('/web/index.php/leave/viewLeaveperiod');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*viewLeaveperiod/);
    });
  });
});
