/**
 * api-helper.ts - Wrapper untuk OrangeHRM API.
 * Dipakai di API hybrid tests (buat/hapus data via API lalu verify di UI).
 */
import { APIRequestContext, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export class ApiHelper {
  private request: APIRequestContext;
  private token: string = '';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /** Login via API dan simpan token untuk request selanjutnya */
  async authenticate(username = 'Admin', password = 'admin123'): Promise<void> {
    const response = await this.request.post(`${BASE_URL}/web/index.php/api/v2/auth/login`, {
      data: { username, password },
    });
    if (response.ok()) {
      const body = await response.json();
      this.token = body?.data?.token ?? '';
    }
  }

  /** GET request dengan auth header */
  async get(endpoint: string) {
    const response = await this.request.get(`${BASE_URL}${endpoint}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
    });
    return response;
  }

  /** POST request dengan auth header */
  async post(endpoint: string, data: object) {
    const response = await this.request.post(`${BASE_URL}${endpoint}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      data,
    });
    return response;
  }

  /** DELETE request dengan auth header */
  async delete(endpoint: string, data?: object) {
    const response = await this.request.delete(`${BASE_URL}${endpoint}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      data,
    });
    return response;
  }

  /** Ambil daftar employee dari API */
  async getEmployees(limit = 10) {
    const response = await this.get(`/web/index.php/api/v2/pim/employees?limit=${limit}`);
    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  /** Ambil daftar user dari API */
  async getUsers(limit = 10) {
    const response = await this.get(`/web/index.php/api/v2/admin/users?limit=${limit}`);
    expect(response.ok()).toBeTruthy();
    return response.json();
  }

  /** Verifikasi response status code */
  async assertStatus(response: Awaited<ReturnType<typeof this.get>>, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  }
}
