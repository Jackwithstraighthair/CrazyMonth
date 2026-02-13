/**
 * 날짜 텍스트 파싱 유틸리티
 * 다양한 형식의 날짜 텍스트를 ISO 8601 형식(YYYY-MM-DD)으로 변환
 */

/**
 * 날짜 패턴 정의
 */
const DATE_PATTERNS = [
  // 2025년 2월 20일
  /(\d{4})[년.\-/]\s*(\d{1,2})[월.\-/]\s*(\d{1,2})[일]?/,
  // 2025.02.20
  /(\d{4})\.(\d{2})\.(\d{2})/,
  // 2025-02-20
  /(\d{4})-(\d{2})-(\d{2})/,
  // 2월 20일 (년도는 현재 연도)
  /(\d{1,2})[월/]\s*(\d{1,2})[일]/,
  // 02/20 (년도는 현재 연도)
  /(\d{1,2})\/(\d{1,2})/,
];

/**
 * 텍스트에서 날짜를 추출하여 ISO 8601 형식으로 반환
 * @param text 파싱할 텍스트
 * @param referenceDate 기준 날짜 (기본값: 오늘)
 * @returns ISO 8601 형식 날짜 문자열 (YYYY-MM-DD) 또는 null
 */
export function parseDate(text: string, referenceDate: Date = new Date()): string | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const currentYear = referenceDate.getFullYear();

  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      let year: number;
      let month: number;
      let day: number;

      if (match.length === 4) {
        // 2025년 2월 20일 형식
        year = parseInt(match[1], 10);
        month = parseInt(match[2], 10);
        day = parseInt(match[3], 10);
      } else if (match.length === 3) {
        // 2월 20일 형식 (년도 없음)
        year = currentYear;
        month = parseInt(match[1], 10);
        day = parseInt(match[2], 10);
      } else {
        continue;
      }

      // 날짜 유효성 검증
      if (year < 2000 || year > 2100) continue;
      if (month < 1 || month > 12) continue;
      if (day < 1 || day > 31) continue;

      // ISO 8601 형식으로 변환
      const monthStr = month.toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      return `${year}-${monthStr}-${dayStr}`;
    }
  }

  return null;
}

/**
 * 여러 텍스트에서 날짜를 추출 (첫 번째로 매칭되는 것 반환)
 */
export function extractDateFromText(texts: string[]): string | null {
  for (const text of texts) {
    const date = parseDate(text);
    if (date) {
      return date;
    }
  }
  return null;
}
