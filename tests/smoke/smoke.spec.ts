import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * 🔥 SMOKE TEST - Test paling kritis yang harus selalu lulus.
 * Dipakai untuk quick sanity check setelah deployment.
 * Tag: @smoke
 */
test.describe('🚀 Smoke Tests - Critical Path', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // fresh session

  test('TC-SMOKE-01: Halaman login dapat diakses', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(/.*auth\/login/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC-SMOKE-02: Admin dapat login dan diarahkan ke dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await expect(page).toHaveURL(/.*dashboard\/index/, { timeout: 15000 });
    await expect(dashboardPage.quickLaunchWidgets.first()).toBeVisible();
  });

  test('TC-SMOKE-03: Dashboard menampilkan widget utama', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await page.waitForURL(/.*dashboard\/index/);

    const quickLaunchCount = await dashboardPage.getQuickLaunchCount();
    expect(quickLaunchCount).toBeGreaterThan(0);
  });

  test('TC-SMOKE-04: Sidebar navigasi berfungsi (PIM)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await page.waitForURL(/.*dashboard\/index/);

    await page.locator('a[href="/web/index.php/pim/viewPimModule"]').click();
    await expect(page).toHaveURL(/.*pim/, { timeout: 10000 });
  });

  test('TC-SMOKE-05: Admin dapat logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await page.waitForURL(/.*dashboard\/index/);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.logout();
    await expect(page).toHaveURL(/.*auth\/login/);
  });
});
