/**
 * 다양한 텍스트 형식에서 시간 추출 후 24시간제 HH:MM으로 정규화
 */
const TIME_PATTERNS = [
  // 20:00, 8:00, 08:00
  /(\d{1,2}):(\d{2})/,
  // 오후 8시, 오전 10시
  /(오전|오후)\s*(\d{1,2})시/,
  // 20시 00분
  /(\d{1,2})시\s*(\d{1,2})?분?/,
];

export function parseTime(text: string): string | null {
  const normalized = text.replace(/\s/g, ' ');
  for (const pattern of TIME_PATTERNS) {
    const m = normalized.match(pattern);
    if (!m) continue;
    if (m[1] === '오전' || m[1] === '오후') {
      let hour = parseInt(m[2], 10);
      if (m[1] === '오후' && hour !== 12) hour += 12;
      if (m[1] === '오전' && hour === 12) hour = 0;
      const h = String(hour).padStart(2, '0');
      return `${h}:00`;
    }
    const hour = parseInt(m[1], 10);
    const minute = m[2] ? parseInt(m[2], 10) : 0;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) continue;
    const h = String(hour).padStart(2, '0');
    const min = String(minute).padStart(2, '0');
    return `${h}:${min}`;
  }
  return null;
}
