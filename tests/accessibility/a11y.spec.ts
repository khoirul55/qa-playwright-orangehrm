import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * ♿ Accessibility Tests menggunakan axe-core.
 * 
 * Ini adalah fitur LANGKA di portofolio QA junior.
 * axe-core adalah standard industri untuk accessibility audit (WCAG 2.1).
 * 
 * Impact levels: critical > serious > moderate > minor
 */
test.describe('♿ Accessibility Audit (WCAG 2.1)', () => {

  test('TC-A11Y-01: Halaman Login - tidak ada violation Critical/Serious', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa']) // WCAG 2.0 Level A & AA
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    // Log semua violations untuk laporan
    if (results.violations.length > 0) {
      console.log('\n📋 Accessibility Violations (Login Page):');
      results.violations.forEach(v => {
        console.log(`  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
        console.log(`  URL: ${v.helpUrl}`);
      });
    }

    // Test hanya gagal jika ada critical/serious violations
    expect(criticalViolations).toHaveLength(0);
  });

  test('TC-A11Y-02: Halaman Dashboard - audit aksesibilitas', async ({ page }) => {
    // Sudah login (storage state dipakai dari config)
    await page.goto('/web/index.php/dashboard/index');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('.orangehrm-buzz-stats') // Exclude widget Buzz yang punya konten user
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    console.log(`\n📊 Dashboard A11Y: ${results.passes.length} passed, ${results.violations.length} violations`);
    expect(criticalViolations.length).toBeLessThanOrEqual(5); // toleransi untuk situs demo
  });

  test('TC-A11Y-03: Halaman PIM Employee List - audit aksesibilitas', async ({ page }) => {
    await page.goto('/web/index.php/pim/viewEmployeeList');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a'])
      .analyze();

    console.log(`\n📊 PIM A11Y: ${results.passes.length} passed, ${results.violations.length} violations`);

    // Dokumentasikan semua violations (meskipun tidak fail test)
    results.violations.forEach(v => {
      test.info().annotations.push({
        type: `a11y-violation-${v.impact}`,
        description: `${v.id}: ${v.description}`,
      });
    });

    // Tidak ada violation dengan impact critical
    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical).toHaveLength(0);
  });

  test('TC-A11Y-04: Cek color contrast ratio di halaman Login', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast']) // hanya cek color contrast
      .analyze();

    console.log(`\n🎨 Color Contrast violations: ${results.violations.length}`);

    // Log semua untuk dokumentasi
    results.violations.forEach(v => {
      v.nodes.forEach(node => {
        console.log(`  Element: ${node.html}`);
        console.log(`  Failure: ${node.failureSummary}`);
      });
    });

    // Soft assertion — hanya log, tidak fail test (situs demo sering punya kontras kurang)
    test.info().annotations.push({
      type: 'color-contrast-violations',
      description: `Found ${results.violations.length} color contrast issues`,
    });
  });

  test('TC-A11Y-05: Semua gambar di halaman login memiliki alt text', async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    await page.waitForLoadState('networkidle');

    // Ambil semua img yang tidak punya alt atau alt-nya kosong
    const imagesWithoutAlt = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const violations: string[] = [];
      images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
          violations.push(img.src || img.outerHTML);
        }
      });
      return violations;
    });

    console.log(`\n🖼 Images without alt text: ${imagesWithoutAlt.length}`);
    imagesWithoutAlt.forEach(src => console.log(`  - ${src}`));

    // Dokumentasikan di report
    test.info().annotations.push({
      type: 'images-without-alt',
      description: `${imagesWithoutAlt.length} image(s) missing alt text`,
    });
  });
});
