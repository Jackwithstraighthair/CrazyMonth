/**
 * 인터파크 티켓 - 공지사항 페이지 파싱
 * fetch로 HTML 수집 후 제목/본문에서 아티스트명·날짜·시간 추출
 */
import type { TicketSaleEvent } from '@/types/ticketSale';
import { matchArtist } from './artistMatcher';
import { parseDate } from '../parsers/dateParser';
import { parseTime } from '../parsers/timeParser';
import { isInMonth, isPastDate } from '@/utils/dateHelpers';

const INTERPARK_NOTICE_URL = 'https://tickets.interpark.com/contents/notice';

export async function scrapeInterpark(monthKey: string): Promise<TicketSaleEvent[]> {
  const results: TicketSaleEvent[] = [];
  try {
    const res = await fetch(INTERPARK_NOTICE_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 },
    });
    const html = await res.text();
    const combined = html; // 제목+본문 통합 검색
    const artist = matchArtist(combined);
    if (!artist) return results;
    const parsedDate = parseDate(combined);
    const parsedTime = parseTime(combined) || '20:00';
    if (!parsedDate || !isInMonth(parsedDate, monthKey) || isPastDate(parsedDate)) return results;
    const noticeLinkMatch = html.match(/href="(\/contents\/notice[^"]+)"/);
    const noticeUrl = noticeLinkMatch
      ? `https://tickets.interpark.com${noticeLinkMatch[1].replace(/&amp;/g, '&')}`
      : INTERPARK_NOTICE_URL;
    results.push({
      artist,
      saleOpenDate: parsedDate,
      saleOpenTime: parsedTime,
      source: 'interpark',
      noticeUrl,
    });
  } catch {
    // ignore
  }
  return results;
}
