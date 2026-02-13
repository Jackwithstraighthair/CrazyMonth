import { TicketSaleEvent, ScrapingResult } from '@/types/ticketSale';
import { scrapeMelonTicketOpen } from './scrapers/melonScraper';
import { scrapeInterparkNotices } from './scrapers/interparkScraper';
import { TARGET_ARTISTS } from './scrapers/artistMatcher';

/**
 * 모든 소스에서 티켓 예매 오픈 데이터를 수집하고 통합
 */
export async function scrapeAllSources(
  artists: string[] = TARGET_ARTISTS
): Promise<ScrapingResult> {
  const errors: string[] = [];
  const allEvents: TicketSaleEvent[] = [];

  try {
    // 병렬로 두 소스에서 스크래핑
    const [melonEvents, interparkEvents] = await Promise.allSettled([
      scrapeMelonTicketOpen(),
      scrapeInterparkNotices(),
    ]);

    if (melonEvents.status === 'fulfilled') {
      allEvents.push(...melonEvents.value);
    } else {
      errors.push(`멜론 티켓 오픈 스크래핑 실패: ${melonEvents.reason}`);
    }

    if (interparkEvents.status === 'fulfilled') {
      allEvents.push(...interparkEvents.value);
    } else {
      errors.push(`인터파크 공지사항 스크래핑 실패: ${interparkEvents.reason}`);
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
