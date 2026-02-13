import { ConcertEvent, CalendarEvent } from '@/types/event';
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
function generateId(event: ConcertEvent, index: number): string {
  return `${event.artist}-${event.saleDate}-${event.saleTime}-${index}`;
}

/**
 * ConcertEvent[]를 react-big-calendar에서 사용할 CalendarEvent[]로 변환
 */
export function convertToCalendarEvents(concertEvents: ConcertEvent[]): CalendarEvent[] {
  return concertEvents.map((event, index) => {
    const start = combineDateTime(event.saleDate, event.saleTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1시간 후

    return {
      id: generateId(event, index),
      title: event.title || `${event.artist} 예매`,
      start,
      end,
      artist: event.artist,
      source: event.source,
      color: getArtistColor(event.artist),
      url: event.url,
    };
  });
}

/**
 * 현재 월의 이벤트만 필터링
 */
export function filterCurrentMonth(events: ConcertEvent[]): ConcertEvent[] {
  const { start, end } = getCurrentMonthRange();
  return events.filter((event) => {
    const eventDate = new Date(event.saleDate);
    return eventDate >= start && eventDate <= end;
  });
}

/**
 * 날짜와 시간 순으로 정렬
 */
export function sortEventsByDateTime(events: ConcertEvent[]): ConcertEvent[] {
  return [...events].sort((a, b) => {
    const dateA = combineDateTime(a.saleDate, a.saleTime);
    const dateB = combineDateTime(b.saleDate, b.saleTime);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * 중복 이벤트 제거 (같은 아티스트, 날짜, 시간)
 */
export function removeDuplicates(events: ConcertEvent[]): ConcertEvent[] {
  const seen = new Set<string>();
  return events.filter((event) => {
    const key = `${event.artist}-${event.saleDate}-${event.saleTime}`;
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
export function processEvents(events: ConcertEvent[]): ConcertEvent[] {
  let processed = filterCurrentMonth(events);
  processed = removeDuplicates(processed);
  processed = sortEventsByDateTime(processed);
  return processed;
}
