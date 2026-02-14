/**
 * 현재 월의 YYYY-MM 반환
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/**
 * YYYY-MM에서 해당 월의 첫날, 마지막날, 일수
 */
export function getMonthRange(monthKey: string): {
  year: number;
  month: number;
  firstDay: Date;
  lastDay: Date;
  daysInMonth: number;
  startPadding: number; // 달력 그리드에서 첫날 전 빈 칸 수 (일요일=0)
} {
  const [y, m] = monthKey.split('-').map(Number);
  const year = y;
  const month = m - 1; // 0-indexed
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startPadding = firstDay.getDay();
  return {
    year,
    month: month + 1,
    firstDay,
    lastDay,
    daysInMonth,
    startPadding,
  };
}

/**
 * 날짜 문자열(YYYY-MM-DD)이 해당 월에 속하는지
 */
export function isInMonth(dateStr: string, monthKey: string): boolean {
  return dateStr.startsWith(monthKey);
}

/**
 * 오늘 날짜 YYYY-MM-DD
 */
export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 과거 날짜 여부 (오늘 포함 여부는 옵션)
 */
export function isPastDate(dateStr: string, includeToday = false): boolean {
  const today = getTodayKey();
  if (dateStr === today) return !includeToday;
  return dateStr < today;
}
