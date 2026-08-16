import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import usersData from '../../test-data/users.json';

/**
 * 🔐 Auth Tests - Login, Logout, Forgot Password
 * Mencakup skenario positif, negatif, dan edge case.
 */
test.describe('🔐 Authentication', () => {

  test.describe('Positive Cases', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('TC-AUTH-01: Login dengan kredensial valid', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(usersData.validUser.username, usersData.validUser.password);
      await expect(page).toHaveURL(/.*dashboard\/index/, { timeout: 15000 });
    });

    test('TC-AUTH-02: Logo perusahaan tampil di halaman login', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      const isLogoVisible = await loginPage.isLogoVisible();
      expect(isLogoVisible).toBeTruthy();
    });

    test('TC-AUTH-03: Username & password field dapat diisi', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.usernameInput.fill('Admin');
      await loginPage.passwordInput.fill('admin123');
      await expect(loginPage.usernameInput).toHaveValue('Admin');
      await expect(loginPage.passwordInput).toHaveValue('admin123');
    });

    test('TC-AUTH-04: Session tetap aktif setelah refresh halaman', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('Admin', 'admin123');
      await page.waitForURL(/.*dashboard\/index/);
      await page.reload();
      await expect(page).toHaveURL(/.*dashboard\/index/, { timeout: 10000 });
    });

    test('TC-AUTH-05: Admin dapat logout dan session berakhir', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('Admin', 'admin123');
      await page.waitForURL(/.*dashboard\/index/);

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.logout();

      // Setelah logout, akses dashboard harus redirect ke login
      await page.goto('/web/index.php/dashboard/index');
      await expect(page).toHaveURL(/.*auth\/login/, { timeout: 10000 });
    });
  });

  test.describe('Negative Cases (Data-Driven)', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    // Loop otomatis: setiap skenario invalid dijalankan sebagai test terpisah
    for (const invalidUser of usersData.invalidUsers) {
      test(`TC-AUTH-NEG: ${invalidUser.scenario}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.usernameInput.fill(invalidUser.username);
        await loginPage.passwordInput.fill(invalidUser.password);
        await loginPage.loginButton.click();

        if (invalidUser.username === '' || invalidUser.password === '') {
          // Validasi field kosong: tampil error di field, bukan alert
          const requiredErrors = page.locator('.oxd-input-field-error-message');
          await expect(requiredErrors.first()).toBeVisible({ timeout: 5000 });
        } else {
          // Validasi kredensial salah
          const errorMsg = await loginPage.getErrorMessage();
          expect(errorMsg).toContain(invalidUser.expectedError);
        }

        // Pastikan tetap di halaman login
        await expect(page).toHaveURL(/.*auth\/login/);
      });
    }
  });

  test.describe('Forgot Password Flow', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('TC-AUTH-06: Link "Forgot Password" dapat diklik', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.clickForgotPassword();
      await expect(page).toHaveURL(/.*requestPasswordResetCode/, { timeout: 10000 });
    });

    test('TC-AUTH-07: Submit forgot password dengan username valid', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.clickForgotPassword();
      await loginPage.submitForgotPassword('Admin');
      const successText = page.locator('.orangehrm-forgot-password-title');
      await expect(successText).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Dashboard Post-Login', () => {
    test('TC-AUTH-08: Nama user tampil di header setelah login', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('Admin', 'admin123');
      await page.waitForURL(/.*dashboard\/index/);

      const dashboardPage = new DashboardPage(page);
      const username = await dashboardPage.getLoggedInUsername();
      expect(username.trim()).toBeTruthy();
    });

    test('TC-AUTH-09: Dashboard load dalam waktu < 10 detik', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('Admin', 'admin123');
      await page.waitForURL(/.*dashboard\/index/);

      const dashboardPage = new DashboardPage(page);
      const loadTime = await dashboardPage.getDashboardLoadTime();
      console.log(`⏱ Dashboard load time: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(10000);
    });
  });
});
