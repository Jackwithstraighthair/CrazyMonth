/**
 * 데이터 처리 및 중복 제거 로직
 */
import type { TicketSaleEvent } from '@/types/ticketSale';
import { isInMonth } from '@/utils/dateHelpers';

/**
 * 현재 월의 키를 반환 (YYYY-MM)
 */
export function resolveMonthKey(monthParam: string | null): string {
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    return monthParam;
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * 여러 소스의 이벤트를 병합하고 중복 제거
 */
export function mergeAndDedupe(
  events: TicketSaleEvent[],
  monthKey: string
): TicketSaleEvent[] {
  // 1단계: 현재 월에 속하는 이벤트만 필터링
  const filtered = events.filter((e) => isInMonth(e.saleOpenDate, monthKey));
  
  // 2단계: 중복 제거
  // 같은 아티스트 + 날짜 + 시간이면 중복으로 간주
  const uniqueMap = new Map<string, TicketSaleEvent>();
  
  for (const event of filtered) {
    // 고유 키 생성: artist-date-time
    const key = `${event.artist}-${event.saleOpenDate}-${event.saleOpenTime}`;
    
    // 이미 존재하는 경우, 우선순위 결정
    if (uniqueMap.has(key)) {
      const existing = uniqueMap.get(key)!;
      // 멜론 티켓을 우선 (더 정확한 정보)
      if (event.source === 'melon' && existing.source === 'interpark') {
        uniqueMap.set(key, event);
      }
      // 이미 멜론이면 유지
      continue;
    }
    
    uniqueMap.set(key, event);
  }
  
  // 3단계: 날짜 + 시간 순으로 정렬
  const sorted = Array.from(uniqueMap.values()).sort((a, b) => {
    const dateA = `${a.saleOpenDate} ${a.saleOpenTime}`;
    const dateB = `${b.saleOpenDate} ${b.saleOpenTime}`;
    return dateA.localeCompare(dateB);
  });
  
  return sorted;
}

/**
 * 특정 아티스트만 필터링
 */
export function filterByArtist(
  events: TicketSaleEvent[],
  artist: string
): TicketSaleEvent[] {
  return events.filter((e) => e.artist === artist);
}

/**
 * 디버깅용: 중복 이벤트 찾기
 */
export function findDuplicates(events: TicketSaleEvent[]): string[] {
  const seen = new Map<string, number>();
  const duplicates: string[] = [];
  
  for (const event of events) {
    const key = `${event.artist}-${event.saleOpenDate}-${event.saleOpenTime}`;
    const count = seen.get(key) || 0;
    seen.set(key, count + 1);
    
    if (count === 1) {
      duplicates.push(key);
    }
  }
  
  return duplicates;
}
