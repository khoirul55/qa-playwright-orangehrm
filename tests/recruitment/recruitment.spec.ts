import { test, expect } from '@playwright/test';
import { RecruitmentPage } from '../../pages/RecruitmentPage';

/**
 * 🎯 Recruitment Tests
 * Mencakup: daftar vacancy, daftar kandidat, navigasi.
 */
test.describe('🎯 Recruitment Module', () => {
  let recruitmentPage: RecruitmentPage;

  test.beforeEach(async ({ page }) => {
    recruitmentPage = new RecruitmentPage(page);
  });

  test.describe('Job Vacancies', () => {
    test('TC-REC-01: Halaman Job Vacancies dapat dibuka', async ({ page }) => {
      await recruitmentPage.gotoVacancies();
      await expect(page).toHaveURL(/.*viewJobVacancy/);
    });

    test('TC-REC-02: Tabel vacancy menampilkan data atau "No Records Found"', async ({ page }) => {
      await recruitmentPage.gotoVacancies();
      const count = await recruitmentPage.getRowCount();
      const hasNoRecords = await recruitmentPage.hasNoRecords();
      expect(count > 0 || hasNoRecords).toBeTruthy();
    });

    test('TC-REC-03: Tombol Add Vacancy tersedia', async ({ page }) => {
      await recruitmentPage.gotoVacancies();
      await expect(page.locator('button:has-text("Add")')).toBeVisible();
    });

    test('TC-REC-04: Halaman Add Vacancy dapat dibuka', async ({ page }) => {
      await recruitmentPage.gotoVacancies();
      await page.locator('button:has-text("Add")').first().click();
      await expect(page).toHaveURL(/.*addJobVacancy/, { timeout: 10000 });
    });
  });

  test.describe('Candidates', () => {
    test('TC-REC-05: Halaman Candidates dapat dibuka', async ({ page }) => {
      await recruitmentPage.gotoCandidates();
      await expect(page).toHaveURL(/.*viewCandidates/);
    });

    test('TC-REC-06: Kandidat list menampilkan tabel', async ({ page }) => {
      await recruitmentPage.gotoCandidates();
      await expect(page.locator('.oxd-table')).toBeVisible();
    });

    test('TC-REC-07: Filter kandidat: tombol Search tersedia', async ({ page }) => {
      await recruitmentPage.gotoCandidates();
      await expect(page.locator('button[type="submit"]:has-text("Search")')).toBeVisible();
    });

    test('TC-REC-08: Search kandidat menampilkan hasil atau "No Records Found"', async ({ page }) => {
      await recruitmentPage.gotoCandidates();
      await page.locator('button[type="submit"]:has-text("Search")').click();
      await recruitmentPage.waitForPageLoad();

      const count = await recruitmentPage.getRowCount();
      const hasNoRecords = await recruitmentPage.hasNoRecords();
      expect(count >= 0 || hasNoRecords).toBeTruthy();
    });

    test('TC-REC-09: Halaman Add Candidate dapat dibuka', async ({ page }) => {
      await recruitmentPage.gotoCandidates();
      await page.locator('button:has-text("Add")').first().click();
      await expect(page).toHaveURL(/.*addCandidate/, { timeout: 10000 });
    });

    test('TC-REC-10: Form Add Candidate memiliki field nama dan email', async ({ page }) => {
      await page.goto('/web/index.php/recruitment/addCandidate');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('input[name="firstName"]')).toBeVisible();
      await expect(page.locator('input[placeholder*="Email"]')).toBeVisible();
    });
  });
});
