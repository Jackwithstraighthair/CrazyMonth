/**
 * 다양한 텍스트 형식에서 날짜 추출 후 YYYY-MM-DD로 정규화
 */
const CURRENT_YEAR = new Date().getFullYear();

const DATE_PATTERNS = [
  // 2025년 2월 20일, 2025.02.20, 2025-02-20
  /(\d{4})[년.\-/]\s*(\d{1,2})[월.\-/]\s*(\d{1,2})/,
  // 2월 20일, 2/20
  /(\d{1,2})[월/]\s*(\d{1,2})[일]?/,
  // 2025.02.20, 2025-02-20
  /(\d{4})-(\d{1,2})-(\d{1,2})/,
];

export function parseDate(text: string): string | null {
  const normalized = text.replace(/\s/g, ' ');
  for (const pattern of DATE_PATTERNS) {
    const m = normalized.match(pattern);
    if (!m) continue;
    let year: number;
    let month: number;
    let day: number;
    if (m.length >= 4 && String(m[1]).length === 4) {
      year = parseInt(m[1], 10);
      month = parseInt(m[2], 10);
      day = parseInt(m[3], 10);
    } else if (m.length >= 3) {
      year = CURRENT_YEAR;
      month = parseInt(m[1], 10);
      day = parseInt(m[2], 10);
    } else {
      continue;
    }
    if (month < 1 || month > 12 || day < 1 || day > 31) continue;
    const y = String(year);
    const mo = String(month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${mo}-${d}`;
  }
  return null;
}
