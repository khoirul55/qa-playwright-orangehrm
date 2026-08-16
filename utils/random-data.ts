/**
 * random-data.ts - Generate data random untuk test data agar tidak konflik.
 * Berguna untuk test create employee agar nama tidak duplicate.
 */

/** Generate nama random */
export function randomName(): { first: string; last: string } {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Quinn', 'Riley', 'Drew'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { first, last };
}

/** Generate string random dengan prefix */
export function randomString(prefix: string = 'test', length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/** Generate email random */
export function randomEmail(): string {
  return `test.${randomString('', 8)}@example.com`;
}

/** Generate tanggal dalam format yyyy-mm-dd */
export function futureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Format tanggal untuk input OrangeHRM: yyyy-dd-mm */
export function formatDateForOrangeHRM(date: string): string {
  // date input: yyyy-mm-dd, output: yyyy-dd-mm
  const [yyyy, mm, dd] = date.split('-');
  return `${yyyy}-${dd}-${mm}`;
}
