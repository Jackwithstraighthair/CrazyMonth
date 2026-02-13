import { startOfMonth, endOfMonth, format, getDaysInMonth } from 'date-fns';

/**
 * 현재 월의 시작일과 마지막일을 반환
 */
export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}

/**
 * Date 객체를 "YYYY-MM-DD" 형식으로 변환
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * "HH:MM" 형식의 시간을 한국어 형식으로 변환 (예: "오후 8시")
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const hour24 = hours;
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
  const period = hour24 >= 12 ? '오후' : '오전';
  
  if (minutes === 0) {
    return `${period} ${hour12}시`;
  }
  return `${period} ${hour12}시 ${minutes}분`;
}

/**
 * 두 날짜가 같은 월인지 확인
 */
export function isSameMonthDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

/**
 * 해당 월의 일수 반환
 */
export function getDaysInMonthCount(date: Date): number {
  return getDaysInMonth(date);
}

/**
 * 요일 인덱스(0=일요일, 6=토요일)를 한국어 요일명으로 변환
 */
export function getWeekdayName(dayIndex: number): string {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return weekdays[dayIndex];
}

/**
 * 날짜 문자열과 시간 문자열을 결합하여 Date 객체 생성
 */
export function combineDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

/**
 * 현재 날짜가 속한 월의 첫 번째 날짜 반환
 */
export function getFirstDayOfMonth(date: Date = new Date()): Date {
  return startOfMonth(date);
}

/**
 * 현재 날짜가 속한 월의 마지막 날짜 반환
 */
export function getLastDayOfMonth(date: Date = new Date()): Date {
  return endOfMonth(date);
}

/**
 * 날짜가 오늘인지 확인
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
