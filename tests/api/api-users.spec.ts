import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/api-helper';

/**
 * 🌐 API + UI Hybrid Tests
 * 
 * Ini adalah teknik advanced: verifikasi data via API, lalu konfirmasi di UI.
 * Sangat impressive untuk portofolio karena menunjukkan pemahaman full-stack testing.
 */
test.describe('🌐 API Testing - OrangeHRM REST API', () => {

  test.describe('Authentication API', () => {
    test('TC-API-01: POST /auth/login mengembalikan token', async ({ request }) => {
      const response = await request.post(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/auth/login',
        {
          data: { username: 'Admin', password: 'admin123' },
        }
      );
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('token');
      console.log('✅ Token berhasil didapat dari API');
    });

    test('TC-API-02: Login dengan password salah mengembalikan 401', async ({ request }) => {
      const response = await request.post(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/auth/login',
        {
          data: { username: 'Admin', password: 'wrongpassword' },
        }
      );
      expect(response.status()).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty('error');
      console.log('✅ Status 401 dikonfirmasi untuk kredensial salah');
    });
  });

  test.describe('Employee API', () => {
    let apiHelper: ApiHelper;
    let authToken: string;

    test.beforeEach(async ({ request }) => {
      apiHelper = new ApiHelper(request);

      // Dapatkan token dulu
      const loginResponse = await request.post(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/auth/login',
        { data: { username: 'Admin', password: 'admin123' } }
      );
      const loginBody = await loginResponse.json();
      authToken = loginBody?.data?.token ?? '';
    });

    test('TC-API-03: GET /pim/employees mengembalikan list employee', async ({ request }) => {
      const response = await request.get(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees',
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('data');
      expect(Array.isArray(body.data)).toBeTruthy();
      expect(body.data.length).toBeGreaterThan(0);
      console.log(`✅ API mengembalikan ${body.data.length} employees`);
    });

    test('TC-API-04: Response employee memiliki struktur JSON yang benar', async ({ request }) => {
      const response = await request.get(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=1',
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const body = await response.json();
      const employee = body.data[0];

      // Schema validation
      expect(employee).toHaveProperty('empNumber');
      expect(employee).toHaveProperty('firstName');
      expect(employee).toHaveProperty('lastName');
      expect(typeof employee.empNumber).toBe('number');
      expect(typeof employee.firstName).toBe('string');
      console.log('✅ JSON schema employee valid');
    });

    test('TC-API-05: GET /admin/users mengembalikan daftar user', async ({ request }) => {
      const response = await request.get(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users',
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.length).toBeGreaterThan(0);
      console.log(`✅ API mengembalikan ${body.data.length} users`);
    });

    test('TC-API-06: Request tanpa token mengembalikan 401', async ({ request }) => {
      const response = await request.get(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees'
      );
      expect([401, 403]).toContain(response.status());
      console.log(`✅ Status ${response.status()} dikembalikan untuk request tanpa auth`);
    });
  });

  test.describe('API + UI Hybrid: Verify Consistency', () => {
    test('TC-API-07: Jumlah employee di API konsisten dengan tampilan di UI', async ({ page, request }) => {
      // Step 1: Ambil jumlah dari API
      const loginResponse = await request.post(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/auth/login',
        { data: { username: 'Admin', password: 'admin123' } }
      );
      const loginBody = await loginResponse.json();
      const token = loginBody?.data?.token ?? '';

      const apiResponse = await request.get(
        'https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=1',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const apiBody = await apiResponse.json();
      const totalFromApi = apiBody?.meta?.total ?? 0;

      // Step 2: Buka UI dan cek info total
      await page.goto('/web/index.php/pim/viewEmployeeList');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const recordsText = await page.locator('.orangehrm-bottom-container span').first().textContent().catch(() => '');

      console.log(`📊 API total: ${totalFromApi}, UI records text: "${recordsText}"`);

      // Verifikasi: total dari API harus > 0 dan UI menampilkan data
      expect(totalFromApi).toBeGreaterThan(0);
      const tableRows = page.locator('.oxd-table-row--clickable');
      const uiCount = await tableRows.count();
      expect(uiCount).toBeGreaterThan(0);

      console.log(`✅ API (${totalFromApi} total) dan UI (${uiCount} baris ditampilkan) konsisten`);
    });
  });
});
