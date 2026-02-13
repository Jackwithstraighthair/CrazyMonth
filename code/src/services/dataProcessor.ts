import { TicketSaleEvent, CalendarEvent } from '@/types/ticketSale';
import { combineDateTime, getCurrentMonthRange } from '@/utils/dateHelpers';

/**
 * 아티스트별 색상 매핑
 */
const ARTIST_COLORS: Record<string, string> = {
  '엔시티드림': '#00FF00',
  '엔시티위시': '#00BFFF',
  '라이즈': '#FF6B35',
  '세븐틴': '#0084FF',
  '임영웅': '#9B59B6',
  '엑소': '#E74C3C',
  '방탄소년단': '#7F00FF',
  '워너원': '#FF69B4',
  '데이식스': '#FFD700',
  '투바투': '#4169E1',
  '스트레이키즈': '#DC143C',
  '에이티즈': '#1C1C1C',
  '더보이즈': '#FF1493',
  '보이넥스트도어': '#32CD32',
  '엔하이픈': '#1E90FF',
  '제로베이스원': '#FFD700',
};

/**
 * 아티스트 이름을 받아서 일관된 색상 코드 반환
 */
export function getArtistColor(artist: string): string {
  return ARTIST_COLORS[artist] || '#6B7280'; // 기본 회색
}

/**
 * 고유 ID 생성
 */
function generateId(event: TicketSaleEvent, index: number): string {
  return `${event.artist}-${event.saleOpenDate}-${event.saleOpenTime}-${index}`;
}

/**
 * TicketSaleEvent[]를 달력에서 사용할 CalendarEvent[]로 변환
 */
export function convertToCalendarEvents(ticketEvents: TicketSaleEvent[]): CalendarEvent[] {
  return ticketEvents.map((event, index) => {
    const start = combineDateTime(event.saleOpenDate, event.saleOpenTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1시간 후

    return {
      id: generateId(event, index),
      title: event.concertTitle || `${event.artist} 예매 오픈`,
      start,
      end,
      artist: event.artist,
      source: event.source,
      color: getArtistColor(event.artist),
      url: event.noticeUrl,
    };
  });
}

/**
 * 현재 월의 이벤트만 필터링
 */
export function filterCurrentMonth(events: TicketSaleEvent[]): TicketSaleEvent[] {
  const { start, end } = getCurrentMonthRange();
  return events.filter((event) => {
    const eventDate = new Date(event.saleOpenDate);
    return eventDate >= start && eventDate <= end;
  });
}

/**
 * 날짜와 시간 순으로 정렬
 */
export function sortEventsByDateTime(events: TicketSaleEvent[]): TicketSaleEvent[] {
  return [...events].sort((a, b) => {
    const dateA = combineDateTime(a.saleOpenDate, a.saleOpenTime);
    const dateB = combineDateTime(b.saleOpenDate, b.saleOpenTime);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * 중복 이벤트 제거 (같은 아티스트, 날짜, 시간)
 */
export function removeDuplicates(events: TicketSaleEvent[]): TicketSaleEvent[] {
  const seen = new Set<string>();
  return events.filter((event) => {
    const key = `${event.artist}-${event.saleOpenDate}-${event.saleOpenTime}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * 데이터 처리 파이프라인: 필터링, 정렬, 중복 제거
 */
export function processEvents(events: TicketSaleEvent[]): TicketSaleEvent[] {
  let processed = filterCurrentMonth(events);
  processed = removeDuplicates(processed);
  processed = sortEventsByDateTime(processed);
  return processed;
}

/**
 * 티켓 예매 오픈 이벤트 검증
 */
export function validateTicketSaleEvent(event: TicketSaleEvent): boolean {
  // Rule 1: 필수 필드 존재
  if (!event.artist || !event.saleOpenDate || !event.saleOpenTime) {
    return false;
  }

  // Rule 2: 날짜 형식 검증
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(event.saleOpenDate)) {
    return false;
  }

  // Rule 3: 시간 형식 검증
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(event.saleOpenTime)) {
    return false;
  }

  // Rule 4: 날짜 범위 검증 (과거 날짜 제외)
  const saleDate = new Date(event.saleOpenDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (saleDate < today) {
    return false;
  }

  return true;
}
