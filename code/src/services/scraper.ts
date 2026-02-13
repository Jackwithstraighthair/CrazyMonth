import { ConcertEvent, ScrapingResult } from '@/types/event';
import { getCurrentMonthRange, formatDate } from '@/utils/dateHelpers';

/**
 * 대상 아티스트 리스트
 */
export const TARGET_ARTISTS = [
  '엔시티드림',
  '엔시티위시',
  '라이즈',
  '세븐틴',
  '임영웅',
  '엑소',
  '방탄소년단',
  '워너원',
  '데이식스',
  '투바투',
  '스트레이키즈',
  '에이티즈',
  '더보이즈',
  '보이넥스트도어',
  '엔하이픈',
  '제로베이스원',
];

/**
 * NOL 티켓 사이트에서 콘서트 예매 정보 스크래핑
 * 현재는 목 데이터를 반환 (실제 스크래핑은 나중에 구현)
 */
export async function scrapeNOL(artists: string[]): Promise<ConcertEvent[]> {
  try {
    // TODO: 실제 웹 스크래핑 구현
    // URL: https://nol.yanolja.com/ticket/genre/concert
    
    // 현재는 목 데이터 반환
    const mockEvents: ConcertEvent[] = [
      {
        artist: '세븐틴',
        saleDate: formatDate(new Date()),
        saleTime: '20:00',
        title: 'SEVENTEEN WORLD TOUR',
        source: 'nol',
        url: 'https://nol.yanolja.com/ticket/example',
      },
    ];

    // 현재 월의 데이터만 필터링
    const { start, end } = getCurrentMonthRange();
    return mockEvents.filter((event) => {
      const eventDate = new Date(event.saleDate);
      return eventDate >= start && eventDate <= end;
    });
  } catch (error) {
    console.error('NOL 스크래핑 에러:', error);
    return [];
  }
}

/**
 * 멜론 티켓 사이트에서 콘서트 예매 정보 스크래핑
 * 현재는 목 데이터를 반환 (실제 스크래핑은 나중에 구현)
 */
export async function scrapeMelon(artists: string[]): Promise<ConcertEvent[]> {
  try {
    // TODO: 실제 웹 스크래핑 구현
    // URL: https://ticket.melon.com/concert/index.htm?genreType=GENRE_CON
    
    // 현재는 목 데이터 반환
    const mockEvents: ConcertEvent[] = [
      {
        artist: '엔시티드림',
        saleDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7일 후
        saleTime: '19:00',
        title: 'NCT DREAM CONCERT',
        source: 'melon',
        url: 'https://ticket.melon.com/example',
      },
      {
        artist: '스트레이키즈',
        saleDate: formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // 14일 후
        saleTime: '18:00',
        title: 'Stray Kids World Tour',
        source: 'melon',
        url: 'https://ticket.melon.com/example2',
      },
    ];

    // 현재 월의 데이터만 필터링
    const { start, end } = getCurrentMonthRange();
    return mockEvents.filter((event) => {
      const eventDate = new Date(event.saleDate);
      return eventDate >= start && eventDate <= end;
    });
  } catch (error) {
    console.error('멜론 스크래핑 에러:', error);
    return [];
  }
}

/**
 * 모든 소스에서 데이터를 수집하고 통합
 */
export async function scrapeAllSources(artists: string[] = TARGET_ARTISTS): Promise<ScrapingResult> {
  const errors: string[] = [];
  const allEvents: ConcertEvent[] = [];

  try {
    // 병렬로 두 소스에서 스크래핑
    const [nolEvents, melonEvents] = await Promise.allSettled([
      scrapeNOL(artists),
      scrapeMelon(artists),
    ]);

    if (nolEvents.status === 'fulfilled') {
      allEvents.push(...nolEvents.value);
    } else {
      errors.push(`NOL 스크래핑 실패: ${nolEvents.reason}`);
    }

    if (melonEvents.status === 'fulfilled') {
      allEvents.push(...melonEvents.value);
    } else {
      errors.push(`멜론 스크래핑 실패: ${melonEvents.reason}`);
    }
  } catch (error) {
    errors.push(`전체 스크래핑 실패: ${error}`);
  }

  return {
    events: allEvents,
    lastUpdated: new Date().toISOString(),
    errors: errors.length > 0 ? errors : undefined,
  };
}
