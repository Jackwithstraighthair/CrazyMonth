import { TicketSaleEvent } from '@/types/ticketSale';
import { matchArtist, findArtistInTexts } from './artistMatcher';
import { parseDate, extractDateFromText } from '../parsers/dateParser';
import { parseTime, extractTimeFromText } from '../parsers/timeParser';
import { getCurrentMonthRange, formatDate } from '@/utils/dateHelpers';

/**
 * 인터파크 공지사항 페이지에서 티켓 예매 오픈 정보 스크래핑
 * 
 * Target URL: https://tickets.interpark.com/contents/notice
 * 
 * 현재는 목 데이터를 반환 (실제 스크래핑은 Puppeteer 등으로 구현 필요)
 */
export async function scrapeInterparkNotices(): Promise<TicketSaleEvent[]> {
  try {
    // TODO: 실제 웹 스크래핑 구현
    // Puppeteer를 사용하여 공지사항 페이지 스크래핑
    // 
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.goto('https://tickets.interpark.com/contents/notice');
    // await page.waitForSelector('.notice-list'); // 실제 셀렉터는 분석 필요
    // 
    // // 공지사항 리스트 수집
    // const notices = await page.evaluate(() => {
    //   const items = document.querySelectorAll('.notice-item');
    //   return Array.from(items).map(item => ({
    //     title: item.querySelector('.title')?.textContent || '',
    //     link: item.querySelector('a')?.href || '',
    //     date: item.querySelector('.date')?.textContent || '',
    //   }));
    // });
    // 
    // // 관련 공지사항만 필터링
    // const relevantNotices = notices.filter(notice => 
    //   containsTargetArtist(notice.title)
    // );
    // 
    // // 각 공지사항 내용 파싱
    // const events: TicketSaleEvent[] = [];
    // for (const notice of relevantNotices) {
    //   await page.goto(notice.link);
    //   await page.waitForSelector('.notice-content');
    //   
    //   const content = await page.evaluate(() => {
    //     return document.querySelector('.notice-content')?.textContent || '';
    //   });
    //   
    //   const event = parseInterparkNotice(notice.title, content, notice.link);
    //   if (event) {
    //     events.push(event);
    //   }
    // }
    // 
    // await browser.close();

    // 현재는 목 데이터 반환
    const mockEvents: TicketSaleEvent[] = [
      {
        artist: '스트레이키즈',
        saleOpenDate: formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // 14일 후
        saleOpenTime: '18:00',
        concertTitle: 'Stray Kids World Tour',
        source: 'interpark',
        noticeUrl: 'https://tickets.interpark.com/contents/notice/view?noticeId=12345',
      },
    ];

    // 현재 월의 데이터만 필터링
    const { start, end } = getCurrentMonthRange();
    return mockEvents.filter((event) => {
      const eventDate = new Date(event.saleOpenDate);
      return eventDate >= start && eventDate <= end;
    });
  } catch (error) {
    console.error('인터파크 공지사항 스크래핑 에러:', error);
    return [];
  }
}

/**
 * 인터파크 공지사항 텍스트를 파싱하여 TicketSaleEvent로 변환
 */
function parseInterparkNotice(
  title: string,
  content: string,
  link: string
): TicketSaleEvent | null {
  // 아티스트 매칭
  const artist = findArtistInTexts([title, content]);
  if (!artist) {
    return null;
  }

  // 날짜 파싱 (제목과 내용 모두에서 시도)
  const saleOpenDate =
    parseDate(title) ||
    parseDate(content) ||
    extractDateFromText([title, content]);

  if (!saleOpenDate) {
    return null;
  }

  // 시간 파싱 (제목과 내용 모두에서 시도)
  const saleOpenTime =
    parseTime(title) ||
    parseTime(content) ||
    extractTimeFromText([title, content]);

  if (!saleOpenTime) {
    return null;
  }

  return {
    artist,
    saleOpenDate,
    saleOpenTime,
    concertTitle: title,
    source: 'interpark',
    noticeUrl: link,
  };
}
