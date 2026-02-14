/**
 * 인터파크 티켓 - 공지사항 페이지 파싱
 * fetch로 HTML 수집 후 각 공지사항을 개별적으로 파싱하여 아티스트명·날짜·시간 추출
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
    
    // 공지사항 리스트 아이템들을 개별적으로 분리
    // 일반적인 HTML 구조: <tr>, <li>, <div class="notice-item"> 등
    // 정확한 셀렉터는 실제 HTML 구조에 따라 다름
    const noticeItems = extractNoticeItems(html);
    
    // 각 공지사항을 개별적으로 파싱
    for (const noticeHtml of noticeItems) {
      const artist = matchArtist(noticeHtml);
      if (!artist) continue;
      
      // 예매/티켓팅 관련 키워드가 있는지 확인
      const saleKeywords = ['예매', '티켓', '오픈', '판매', '시작', '티켓팅'];
      const hasSaleKeyword = saleKeywords.some(keyword => noticeHtml.includes(keyword));
      if (!hasSaleKeyword) continue;
      
      const parsedDate = parseDate(noticeHtml);
      if (!parsedDate) continue;
      
      // 날짜 검증
      if (!isInMonth(parsedDate, monthKey) || isPastDate(parsedDate)) continue;
      
      const parsedTime = parseTime(noticeHtml) || '20:00';
      
      // 공지사항 링크 추출
      const noticeLinkMatch = noticeHtml.match(/href="(\/contents\/notice[^"]+)"/);
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
    }
  } catch (error) {
    console.error('Interpark scraping error:', error);
  }
  
  return results;
}

/**
 * HTML에서 개별 공지사항 아이템들을 추출
 * 여러 가지 패턴을 시도하여 공지사항 리스트를 분리
 */
function extractNoticeItems(html: string): string[] {
  const items: string[] = [];
  
  // 패턴 1: <tr> 태그로 분리 (테이블 구조)
  const trMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
  if (trMatches && trMatches.length > 1) {
    return trMatches;
  }
  
  // 패턴 2: <li> 태그로 분리 (리스트 구조)
  const liMatches = html.match(/<li[^>]*>[\s\S]*?<\/li>/gi);
  if (liMatches && liMatches.length > 1) {
    return liMatches;
  }
  
  // 패턴 3: notice, board, item 등의 클래스명을 가진 div
  const divMatches = html.match(/<div[^>]*class="[^"]*(?:notice|board|item|list)[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
  if (divMatches && divMatches.length > 1) {
    return divMatches;
  }
  
  // 패턴 4: article 태그
  const articleMatches = html.match(/<article[^>]*>[\s\S]*?<\/article>/gi);
  if (articleMatches && articleMatches.length > 1) {
    return articleMatches;
  }
  
  // 아무것도 매칭되지 않으면 전체 HTML을 하나의 아이템으로 반환
  // (이전 동작 유지 - fallback)
  return [html];
}
