import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * PimPage - Personal Information Management.
 * Menangani CRUD Employee.
 */
export class PimPage extends BasePage {
  readonly addEmployeeButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly employeeTable: Locator;
  readonly employeeRows: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly editButton: Locator;
  readonly noRecordsText: Locator;
  readonly recordCountText: Locator;

  constructor(page: Page) {
    super(page);
    this.addEmployeeButton = page.locator('button:has-text("Add")').first();
    this.searchInput = page.locator('input[placeholder="Type for hints..."]').first();
    this.searchButton = page.locator('button[type="submit"]:has-text("Search")');
    this.employeeTable = page.locator('.oxd-table-body');
    this.employeeRows = page.locator('.oxd-table-row--clickable');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('.orangehrm-employee-id input');
    this.saveButton = page.locator('button[type="submit"]:has-text("Save")');
    this.deleteButton = page.locator('button.oxd-icon-button:has(.bi-trash)');
    this.confirmDeleteButton = page.locator('.oxd-button--label-danger:has-text("Yes, Delete")');
    this.editButton = page.locator('button.oxd-icon-button:has(.bi-pencil-fill)').first();
    this.noRecordsText = page.locator('.oxd-text:has-text("No Records Found")');
    this.recordCountText = page.locator('.orangehrm-bottom-container span');
  }

  /** Buka halaman daftar employee */
  async goto() {
    await this.navigate('/web/index.php/pim/viewEmployeeList');
    await this.waitForPageLoad();
  }

  /** Buka form tambah employee */
  async goToAddEmployee() {
    await this.navigate('/web/index.php/pim/addEmployee');
    await this.waitForVisible(this.firstNameInput);
  }

  /** Isi form tambah employee */
  async fillEmployeeForm(firstName: string, middleName: string, lastName: string) {
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.middleNameInput, middleName);
    await this.fillInput(this.lastNameInput, lastName);
  }

  /** Submit form dan tunggu redirect ke profile */
  async saveEmployee() {
    await this.clickElement(this.saveButton);
    await this.waitForPageLoad();
  }

  /** Cari employee by nama */
  async searchEmployee(name: string) {
    await this.fillInput(this.searchInput, name);
    await this.clickElement(this.searchButton);
    await this.waitForPageLoad();
  }

  /** Hitung jumlah baris employee di tabel */
  async getEmployeeCount(): Promise<number> {
    await this.page.waitForTimeout(1000); // tunggu tabel render
    return this.employeeRows.count();
  }

  /** Klik tombol edit pada baris pertama */
  async clickFirstEmployeeEdit() {
    await this.waitForVisible(this.employeeRows.first());
    const editBtn = this.employeeRows.first().locator('button:has(.bi-pencil-fill)');
    await this.clickElement(editBtn);
    await this.waitForPageLoad();
  }

  /** Hapus employee pada baris pertama */
  async deleteFirstEmployee() {
    await this.waitForVisible(this.employeeRows.first());
    const deleteBtn = this.employeeRows.first().locator('button:has(.bi-trash)');
    await this.clickElement(deleteBtn);
    await this.clickElement(this.confirmDeleteButton);
    await this.waitForPageLoad();
  }

  /** Cek apakah "No Records Found" muncul */
  async hasNoRecords(): Promise<boolean> {
    return this.isVisible(this.noRecordsText);
  }

  /** Ambil info jumlah record dari footer tabel */
  async getRecordCount(): Promise<string> {
    try {
      return this.getText(this.recordCountText);
    } catch {
      return '0';
    }
  }

  /** Ambil Employee ID yang di-generate otomatis */
  async getGeneratedEmployeeId(): Promise<string> {
    await this.waitForVisible(this.employeeIdInput);
    return (await this.employeeIdInput.inputValue()) ?? '';
  }
}
