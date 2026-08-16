import { test as setup } from '@playwright/test';
import { loginAndSaveSession } from '../fixtures/auth.fixture';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Auth Setup - Dijalankan SEKALI sebelum semua test suite.
 * Menyimpan session login ke file JSON agar tidak perlu login ulang setiap test.
 */
setup('authenticate as admin', async ({ page }) => {
  // Buat folder jika belum ada
  const authDir = path.join(process.cwd(), 'playwright', '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await loginAndSaveSession(page);
  console.log('✅ Session tersimpan: playwright/.auth/admin.json');
});
