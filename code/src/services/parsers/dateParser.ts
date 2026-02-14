/**
 * 다양한 텍스트 형식에서 날짜 추출 후 YYYY-MM-DD로 정규화
 * 특히 "예매 오픈" 관련 날짜를 우선적으로 추출
 */

const DATE_PATTERNS = [
  // 2025년 2월 27일, 2025년 2월 27일(목)
  /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/,
  // 2025.02.27, 2025-02-27, 2025/02/27
  /(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/,
  // 2월 27일, 02월 27일
  /(\d{1,2})월\s*(\d{1,2})일/,
  // 2/27, 02/27
  /(\d{1,2})\/(\d{1,2})(?!\d)/,
];

// 예매/티켓팅 관련 키워드
const SALE_KEYWORDS = [
  '예매',
  '티켓팅',
  '티켓 오픈',
  '판매 시작',
  '오픈',
  '발매',
  '구매',
];

export function parseDate(text: string): string | null {
  const normalized = text.replace(/\s+/g, ' ');
  const currentYear = new Date().getFullYear();
  
  // 전략 1: 예매 관련 키워드 근처의 날짜를 우선 추출
  for (const keyword of SALE_KEYWORDS) {
    const keywordIndex = normalized.indexOf(keyword);
    if (keywordIndex === -1) continue;
    
    // 키워드 앞뒤 100자 범위에서 날짜 찾기
    const startPos = Math.max(0, keywordIndex - 50);
    const endPos = Math.min(normalized.length, keywordIndex + 150);
    const contextText = normalized.substring(startPos, endPos);
    
    const result = extractDateFromText(contextText, currentYear);
    if (result) return result;
  }
  
  // 전략 2: 키워드가 없으면 전체 텍스트에서 첫 번째 날짜 추출
  return extractDateFromText(normalized, currentYear);
}

function extractDateFromText(text: string, defaultYear: number): string | null {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (!match) continue;
    
    let year: number;
    let month: number;
    let day: number;
    
    if (match.length === 4) {
      // 년도가 포함된 패턴 (YYYY-MM-DD 형태)
      year = parseInt(match[1], 10);
      month = parseInt(match[2], 10);
      day = parseInt(match[3], 10);
    } else if (match.length === 3) {
      // 년도가 없는 패턴 (MM-DD 형태)
      year = defaultYear;
      month = parseInt(match[1], 10);
      day = parseInt(match[2], 10);
    } else {
      continue;
    }
    
    // 날짜 유효성 검증
    if (!isValidDate(year, month, day)) continue;
    
    // YYYY-MM-DD 형식으로 반환
    const yyyy = String(year);
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
  }
  
  return null;
}

function isValidDate(year: number, month: number, day: number): boolean {
  // 기본 범위 검증
  if (year < 2000 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  
  // 월별 일수 검증
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;
  
  return true;
}
