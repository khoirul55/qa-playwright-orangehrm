/**
 * date-helper.ts - Utility untuk manipulasi tanggal di test.
 */

/** Format Date ke string yyyy-mm-dd */
export function toYYYYMMDD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Dapatkan tanggal hari ini */
export function today(): string {
  return toYYYYMMDD(new Date());
}

/** Dapatkan tanggal N hari dari sekarang */
export function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toYYYYMMDD(date);
}

/** Cek apakah tanggal A lebih kecil dari B */
export function isBefore(dateA: string, dateB: string): boolean {
  return new Date(dateA) < new Date(dateB);
}

/** Format tanggal ke format display (dd/mm/yyyy) */
export function toDisplayFormat(dateStr: string): string {
  const [yyyy, mm, dd] = dateStr.split('-');
  return `${dd}/${mm}/${yyyy}`;
}
