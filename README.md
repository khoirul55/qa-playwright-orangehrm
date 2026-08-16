# 🎭 QA Automation Portfolio — OrangeHRM

![Playwright Tests](https://github.com/khoirul55/qa-playwright-orangehrm/actions/workflows/playwright.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Playwright](https://img.shields.io/badge/Playwright-1.48-green?logo=playwright)
![License](https://img.shields.io/badge/License-MIT-yellow)

> **Portfolio Project #1** — Automated End-to-End Test Suite untuk [OrangeHRM](https://opensource-demo.orangehrmlive.com) menggunakan **Playwright + TypeScript** dengan pola **Page Object Model**.
>
> Proyek ini merupakan bagian dari portofolio QA Engineering dengan fokus pada best practices yang digunakan di industri modern.

📄 **Live Test Report:** [GitHub Pages](https://khoirul55.github.io/qa-playwright-orangehrm/)
🔗 **Portfolio #2:** [Selenium + Java (SauceDemo)](https://github.com/khoirul55/selenium-java-e2e-framework)

---

## ✨ Fitur Unggulan

| Fitur | Keterangan |
|---|---|
| 🏗️ **Page Object Model** | Arsitektur terstruktur: Pages, Components, Fixtures |
| 🌐 **Multi-Browser** | Chromium, Firefox, WebKit (Safari) |
| 📊 **Allure Report** | Laporan visual dengan screenshot & video |
| ♿ **Accessibility Testing** | Audit WCAG 2.1 dengan `axe-core` |
| 🔄 **API + UI Hybrid** | Validasi data via REST API, konfirmasi di UI |
| 🧩 **Data-Driven Testing** | Login negatif dengan 7+ skenario dari JSON |
| 🤖 **CI/CD GitHub Actions** | Auto-run multi-browser + publish Allure Report ke GitHub Pages |
| ⏱️ **Performance Assertion** | Validasi waktu load halaman |
| 🔐 **Session Reuse** | Auth sekali, session disimpan untuk semua test |

---

## 📁 Struktur Project

```
qa-playwright-orangehrm/
├── pages/                     # Page Object Model
│   ├── BasePage.ts            # Base class dengan helper methods
│   ├── LoginPage.ts           # Halaman login
│   ├── DashboardPage.ts       # Dashboard
│   ├── PimPage.ts             # Employee Management
│   ├── LeavePage.ts           # Leave Management
│   ├── RecruitmentPage.ts     # Recruitment
│   └── AdminPage.ts           # Admin panel
│
├── components/                # Komponen UI reusable
│   ├── SidebarComponent.ts
│   ├── TopBarComponent.ts
│   └── TableComponent.ts
│
├── tests/
│   ├── auth.setup.ts          # Auth session setup (dijalankan sekali)
│   ├── smoke/                 # Smoke tests — critical path
│   ├── auth/                  # Login, logout, forgot password
│   ├── pim/                   # Employee CRUD
│   ├── leave/                 # Leave management
│   ├── recruitment/           # Vacancies & candidates
│   ├── accessibility/         # Axe-core WCAG 2.1 audit ♿
│   └── api/                   # REST API + hybrid UI tests
│
├── fixtures/                  # Auth & test setup
├── test-data/                 # JSON data untuk data-driven tests
├── utils/                     # Helpers: API, dates, random data
└── .github/workflows/         # CI/CD GitHub Actions
```

---

## 🧪 Test Coverage

| Modul | Test Cases | Tipe |
|---|---|---|
| 🔐 Authentication | 9 TC | Positive, Negative, Edge Case |
| 🚀 Smoke | 5 TC | Critical Path |
| 👥 Employee (PIM) | 11 TC | CRUD, Validasi |
| 🌴 Leave Management | 10 TC | View, Apply, Filter |
| 🎯 Recruitment | 10 TC | Vacancies, Candidates |
| ♿ Accessibility | 5 TC | WCAG 2.1 Audit |
| 🌐 API Testing | 7 TC | REST API + Hybrid |
| **Total** | **57 TC** | |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js 18+
- Git

### Instalasi
```bash
# 1. Clone repository
git clone https://github.com/khoirul55/qa-playwright-orangehrm.git
cd qa-playwright-orangehrm

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Setup environment variables
cp .env.example .env
```

### Menjalankan Test
```bash
# Semua test (semua browser)
npm test

# Per browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Per modul
npm run test:smoke         # Smoke tests
npm run test:auth          # Login tests
npm run test:pim           # Employee tests
npm run test:accessibility # Accessibility audit
npm run test:api           # API tests

# Mode debug (browser terbuka)
npm run test:headed
npm run test:debug
```

### Melihat Laporan
```bash
# Playwright HTML Report
npm run report:html

# Allure Report (perlu Allure CLI)
npm run report:allure:generate
npm run report:allure
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Programming language |
| **Playwright 1.48** | Modern E2E browser automation |
| **Axe-core** | Accessibility (WCAG 2.1) auditing |
| **Allure Report** | Interactive visual test reporting |
| **GitHub Actions** | CI/CD pipeline |
| **Node.js** | Runtime environment |

---

## 🏗️ Arsitektur: Page Object Model

```
BasePage (parent class)
    ├── LoginPage
    ├── DashboardPage
    ├── PimPage
    ├── LeavePage
    ├── RecruitmentPage
    └── AdminPage
```

Setiap Page Object hanya berisi:
- **Locators**: cara menemukan elemen di halaman
- **Methods**: aksi yang bisa dilakukan di halaman tersebut

Test files **tidak boleh** punya raw locator — hanya memanggil method dari Page Object.

---

## 🌐 API + UI Hybrid Testing

Salah satu fitur unggulan proyek ini adalah pengujian yang menggabungkan **API dan UI**:

```
1. GET /api/v2/pim/employees → Ambil total employee dari API
2. Buka halaman Employee List di browser
3. Bandingkan jumlah dari API dengan data yang tampil di UI
4. Assert konsistensi data
```

Ini membuktikan tidak hanya UI berfungsi benar, tapi data yang ditampilkan **akurat** sesuai dengan yang ada di database.

---

## ♿ Accessibility Testing

Menggunakan `@axe-core/playwright` untuk audit WCAG 2.1:

- **Halaman yang diaudit**: Login, Dashboard, PIM
- **Standard**: WCAG 2.0 Level A & AA
- **Cek khusus**: Color contrast, Alt text gambar
- **Impact levels**: Critical → Serious → Moderate → Minor

---

## 🤖 CI/CD Pipeline

Pipeline otomatis berjalan di GitHub Actions divisualisasikan dalam diagram berikut:

```mermaid
graph LR
    A[Push/PR ke main] --> B[Checkout Code]
    B --> C[Setup Node.js]
    C --> D[Install Dependencies]
    D --> E[Install Playwright Browsers]
    E --> F[Run Tests: WebKit, Firefox, Chromium]
    F --> G{Tests Pass?}
    G -->|Yes| H[Upload Allure Results]
    G -->|No| I[Upload Screenshots & Traces]
    H --> J[Generate Allure Report]
    I --> J
    J --> K[Deploy to GitHub Pages]
```

🔗 **Live Allure Report**: [https://khoirul55.github.io/qa-playwright-orangehrm/](https://khoirul55.github.io/qa-playwright-orangehrm/)

---

## 👤 Author

**Khoirul** — QA Engineer

Seorang professional dengan background Full Stack Developer (React, Next.js, Laravel) yang sedang bertransisi ke QA Engineer. Kombinasi keahlian development dan testing memungkinkan pendekatan yang lebih komprehensif dalam quality assurance.

- 🔗 GitHub: [@khoirul55](https://github.com/khoirul55)
- 💼 LinkedIn: [Khoirul Gunawan](https://www.linkedin.com/in/khoirul-gunawan5/)
- 📁 Portfolio #1: [Playwright + TypeScript (OrangeHRM)](https://github.com/khoirul55/qa-playwright-orangehrm) ← *You are here*
- 📁 Portfolio #2: [Selenium + Java (SauceDemo)](https://github.com/khoirul55/selenium-java-e2e-framework)

---

## 📄 Lisensi

MIT License — bebas digunakan untuk referensi belajar.
