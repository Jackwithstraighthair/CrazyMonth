import { TicketSaleEvent } from '@/types/ticketSale';
import { matchArtist } from './artistMatcher';
import { parseDate, extractDateFromText } from '../parsers/dateParser';
import { parseTime, extractTimeFromText } from '../parsers/timeParser';
import { getCurrentMonthRange, formatDate } from '@/utils/dateHelpers';

/**
 * 멜론 티켓 "티켓 오픈" 페이지에서 티켓 예매 오픈 정보 스크래핑
 * 
 * Target URL: https://ticket.melon.com/csoon/index.htm#orderType=0&pageIndex=1&schGcode=GENRE_ALL&schText=&schDt=
 * 
 * 현재는 목 데이터를 반환 (실제 스크래핑은 Puppeteer 등으로 구현 필요)
 */
export async function scrapeMelonTicketOpen(): Promise<TicketSaleEvent[]> {
  try {
    // TODO: 실제 웹 스크래핑 구현
    // Puppeteer를 사용하여 동적 페이지 스크래핑
    // 
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.goto('https://ticket.melon.com/csoon/index.htm#orderType=0&pageIndex=1&schGcode=GENRE_ALL&schText=&schDt=');
    // await page.waitForSelector('.ticket-open-list'); // 실제 셀렉터는 분석 필요
    // 
    // const events = await page.evaluate(() => {
    //   // 실제 DOM 구조에 맞게 수정 필요
    //   const items = document.querySelectorAll('.ticket-item');
    //   return Array.from(items).map(item => ({
    //     title: item.querySelector('.title')?.textContent || '',
    //     openDate: item.querySelector('.open-date')?.textContent || '',
    //     openTime: item.querySelector('.open-time')?.textContent || '',
    //     link: item.querySelector('a')?.href || '',
    //   }));
    // });
    // 
    // await browser.close();

    // 현재는 목 데이터 반환
    const mockEvents: TicketSaleEvent[] = [
      {
        artist: '세븐틴',
        saleOpenDate: formatDate(new Date()),
        saleOpenTime: '20:00',
        concertTitle: 'SEVENTEEN WORLD TOUR FOLLOW AGAIN SEOUL',
        source: 'melon',
        noticeUrl: 'https://ticket.melon.com/performance/index.htm?prodId=209999',
      },
      {
        artist: '엔시티드림',
        saleOpenDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7일 후
        saleOpenTime: '19:00',
        concertTitle: 'NCT DREAM CONCERT',
        source: 'melon',
        noticeUrl: 'https://ticket.melon.com/performance/index.htm?prodId=209998',
      },
    ];

    // 현재 월의 데이터만 필터링
    const { start, end } = getCurrentMonthRange();
    return mockEvents.filter((event) => {
      const eventDate = new Date(event.saleOpenDate);
      return eventDate >= start && eventDate <= end;
    });
  } catch (error) {
    console.error('멜론 티켓 오픈 스크래핑 에러:', error);
    return [];
  }
}

/**
 * 스크래핑된 원시 데이터를 TicketSaleEvent로 변환
 */
function parseMelonEvent(rawData: {
  title: string;
  openDate: string;
  openTime: string;
  link?: string;
}): TicketSaleEvent | null {
  // 아티스트 매칭
  const artist = matchArtist(rawData.title);
  if (!artist) {
    return null;
  }

  // 날짜 파싱
  const saleOpenDate = parseDate(rawData.openDate) || extractDateFromText([rawData.openDate, rawData.title]);
  if (!saleOpenDate) {
    return null;
  }

  // 시간 파싱
  const saleOpenTime = parseTime(rawData.openTime) || extractTimeFromText([rawData.openTime, rawData.title]);
  if (!saleOpenTime) {
    return null;
  }

  return {
    artist,
    saleOpenDate,
    saleOpenTime,
    concertTitle: rawData.title,
    source: 'melon',
    noticeUrl: rawData.link,
  };
}
