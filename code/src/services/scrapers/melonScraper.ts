/**
 * 멜론 티켓 - 티켓 오픈 코너 스크래핑
 * Vercel 서버리스 환경: Puppeteer 불가 → fetch로 HTML만 수집 (동적 렌더링 페이지는 제한적)
 * 실제 멜론 티켓이 JS로 렌더링되면 빈 배열 반환 후 인터파크/목 데이터로 보완
 */
import type { TicketSaleEvent } from '@/types/ticketSale';
import { matchArtist } from './artistMatcher';
import { parseDate } from '../parsers/dateParser';
import { parseTime } from '../parsers/timeParser';
import { isInMonth, isPastDate } from '@/utils/dateHelpers';

const MELON_CSOON_URL = 'https://ticket.melon.com/csoon/index.htm';

export async function scrapeMelon(monthKey: string): Promise<TicketSaleEvent[]> {
  const results: TicketSaleEvent[] = [];
  try {
    const res = await fetch(MELON_CSOON_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 },
    });
    const html = await res.text();
    // 멜론은 대부분 클라이언트 렌더링이라 HTML에 리스트가 없을 수 있음
    const artistMatch = matchArtist(html);
    if (!artistMatch) {
      // HTML 내에 날짜/시간 패턴으로 추출 시도
      const dateMatch = html.match(/(\d{4})-(\d{2})-(\d{2})/g);
      const timeMatch = html.match(/(\d{1,2}):(\d{2})/g);
      if (dateMatch && timeMatch) {
        for (let i = 0; i < Math.min(dateMatch.length, 5); i++) {
          const d = dateMatch[i];
          const t = timeMatch[i] || '20:00';
          if (d && isInMonth(d, monthKey) && !isPastDate(d)) {
            const artist = matchArtist(html) || '공연';
            if (artist && artist !== '공연') {
              results.push({
                artist,
                saleOpenDate: d,
                saleOpenTime: t.length === 4 ? `0${t}` : t,
                source: 'melon',
                noticeUrl: MELON_CSOON_URL,
              });
            }
          }
        }
      }
      return results;
    }
    const parsedDate = parseDate(html);
    const parsedTime = parseTime(html) || '20:00';
    if (parsedDate && isInMonth(parsedDate, monthKey) && !isPastDate(parsedDate)) {
      results.push({
        artist: artistMatch,
        saleOpenDate: parsedDate,
        saleOpenTime: parsedTime,
        source: 'melon',
        noticeUrl: MELON_CSOON_URL,
      });
    }
  } catch {
    // 네트워크/파싱 실패 시 빈 배열
  }
  return results;
}
