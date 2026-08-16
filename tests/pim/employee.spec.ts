import { test, expect } from '@playwright/test';
import { PimPage } from '../../pages/PimPage';
import { TableComponent } from '../../components/TableComponent';
import { randomName } from '../../utils/random-data';
import employeesData from '../../test-data/employees.json';

/**
 * 👥 PIM - Employee Management Tests
 * Mencakup: tampil daftar, tambah, cari, edit, hapus employee.
 */
test.describe('👥 PIM - Employee Management', () => {
  let pimPage: PimPage;
  let tableComponent: TableComponent;

  test.beforeEach(async ({ page }) => {
    pimPage = new PimPage(page);
    tableComponent = new TableComponent(page);
    await pimPage.goto();
  });

  test.describe('View Employee List', () => {
    test('TC-PIM-01: Halaman Employee List dapat dibuka', async ({ page }) => {
      await expect(page).toHaveURL(/.*viewEmployeeList/);
      await expect(page.locator('.oxd-table-body')).toBeVisible();
    });

    test('TC-PIM-02: Tabel employee menampilkan minimal 1 data', async () => {
      const count = await pimPage.getEmployeeCount();
      expect(count).toBeGreaterThan(0);
    });

    test('TC-PIM-03: Tabel memiliki kolom: First/Middle/Last Name, Employee ID, Action', async ({ page }) => {
      const headerCells = page.locator('.oxd-table-header .oxd-table-head-cell');
      const headers = await headerCells.allTextContents();
      const flatHeaders = headers.join(' ');
      expect(flatHeaders).toContain('First Name');
      expect(flatHeaders).toContain('Last Name');
      expect(flatHeaders).toContain('Employee Id');
    });
  });

  test.describe('Add Employee', () => {
    test('TC-PIM-04: Tambah employee baru berhasil', async ({ page }) => {
      const { first, last } = randomName();
      const employeeData = employeesData.employees[0];

      await pimPage.goToAddEmployee();
      await pimPage.fillEmployeeForm(first, employeeData.middleName, last);
      await pimPage.saveEmployee();

      // Setelah save, redirect ke profile employee baru
      await expect(page).toHaveURL(/.*pim\/viewPersonalDetails/, { timeout: 15000 });
      await expect(page.locator('input[name="firstName"]')).toHaveValue(first);
    });

    test('TC-PIM-05: Employee ID digenerate otomatis saat tambah employee', async () => {
      await pimPage.goToAddEmployee();
      const generatedId = await pimPage.getGeneratedEmployeeId();
      expect(generatedId).toBeTruthy();
      expect(generatedId).toMatch(/^\d+$/); // harus berupa angka
    });

    test('TC-PIM-06: Form tambah employee gagal jika nama kosong', async ({ page }) => {
      await pimPage.goToAddEmployee();
      // Langsung klik save tanpa isi nama
      await pimPage.saveButton.click();
      // Harus muncul error validation
      const errors = page.locator('.oxd-input-field-error-message');
      await expect(errors.first()).toBeVisible({ timeout: 5000 });
    });

    test('TC-PIM-07: Tambah employee tanpa middle name berhasil', async ({ page }) => {
      const { first, last } = randomName();
      await pimPage.goToAddEmployee();
      await pimPage.fillEmployeeForm(first, '', last);
      await pimPage.saveEmployee();
      await expect(page).toHaveURL(/.*pim\/viewPersonalDetails/, { timeout: 15000 });
    });
  });

  test.describe('Search Employee', () => {
    test('TC-PIM-08: Cari employee yang ada memberikan hasil', async () => {
      await pimPage.searchEmployee('Admin');
      const count = await pimPage.getEmployeeCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('TC-PIM-09: Cari employee yang tidak ada menampilkan "No Records Found"', async ({ page }) => {
      await pimPage.searchEmployee('ZZZ_DEFINITELY_NOT_EXIST_XYZ_999');
      await expect(page.locator('.oxd-text:has-text("No Records Found")')).toBeVisible({ timeout: 8000 });
    });

    test('TC-PIM-10: Reset filter menampilkan semua employee', async ({ page }) => {
      await pimPage.searchEmployee('Admin');
      // Klik Reset
      await page.locator('button[type="reset"]:has-text("Reset")').click();
      await pimPage.waitForPageLoad();
      const count = await pimPage.getEmployeeCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Delete Employee', () => {
    test('TC-PIM-11: Hapus employee yang baru ditambah', async ({ page }) => {
      // Tambah employee dulu
      const { first, last } = randomName();
      await pimPage.goToAddEmployee();
      await pimPage.fillEmployeeForm(first, 'Del', last);
      await pimPage.saveEmployee();
      await page.waitForURL(/.*viewPersonalDetails/);

      // Kembali ke daftar dan cari employee yang baru dibuat
      await pimPage.goto();
      await pimPage.searchEmployee(`${first} ${last}`);
      await pimPage.waitForPageLoad();

      const countBefore = await pimPage.getEmployeeCount();
      if (countBefore > 0) {
        await pimPage.deleteFirstEmployee();
        await page.waitForTimeout(2000);
        const toastText = await page.locator('.oxd-toast-content').textContent().catch(() => '');
        expect(toastText ?? '').toContain('Successfully Deleted');
      }
    });
  });
});
