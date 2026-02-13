/**
 * 시간 텍스트 파싱 유틸리티
 * 다양한 형식의 시간 텍스트를 24시간제 형식(HH:MM)으로 변환
 */

import { parseDate } from './dateParser';

/**
 * 시간 패턴 정의
 */
const TIME_PATTERNS = [
  // 20:00
  /(\d{1,2}):(\d{2})/,
  // 오후 8시
  /(오전|오후)\s*(\d{1,2})시/,
  // 오후 8시 30분
  /(오전|오후)\s*(\d{1,2})시\s*(\d{2})분/,
  // 20시 00분
  /(\d{1,2})시\s*(\d{2})분/,
  // 8시
  /(\d{1,2})시/,
];

/**
 * 텍스트에서 시간을 추출하여 24시간제 형식으로 반환
 * @param text 파싱할 텍스트
 * @returns 24시간제 형식 시간 문자열 (HH:MM) 또는 null
 */
export function parseTime(text: string): string | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  for (const pattern of TIME_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      let hours: number;
      let minutes: number = 0;

      if (match[0].includes('오전') || match[0].includes('오후')) {
        // 오전/오후 형식
        const period = match[1];
        hours = parseInt(match[2], 10);
        minutes = match[3] ? parseInt(match[3], 10) : 0;

        if (period === '오후') {
          if (hours !== 12) {
            hours += 12;
          }
        } else if (period === '오전' && hours === 12) {
          hours = 0;
        }
      } else if (match[0].includes('시')) {
        // "20시 00분" 또는 "8시" 형식
        hours = parseInt(match[1] || match[0].match(/(\d{1,2})/)?.[1] || '0', 10);
        minutes = match[2] ? parseInt(match[2], 10) : 0;
      } else {
        // "20:00" 형식
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
      }

      // 시간 유효성 검증
      if (hours < 0 || hours > 23) continue;
      if (minutes < 0 || minutes > 59) continue;

      // 24시간제 형식으로 변환
      const hoursStr = hours.toString().padStart(2, '0');
      const minutesStr = minutes.toString().padStart(2, '0');
      return `${hoursStr}:${minutesStr}`;
    }
  }

  return null;
}

/**
 * 여러 텍스트에서 시간을 추출 (첫 번째로 매칭되는 것 반환)
 */
export function extractTimeFromText(texts: string[]): string | null {
  for (const text of texts) {
    const time = parseTime(text);
    if (time) {
      return time;
    }
  }
  return null;
}

/**
 * 날짜와 시간이 함께 있는 텍스트에서 둘 다 추출
 */
export function parseDateTime(text: string): { date: string | null; time: string | null } {
  return {
    date: parseDate(text),
    time: parseTime(text),
  };
}
