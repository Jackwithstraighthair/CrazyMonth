/**
 * 티켓 예매 오픈 이벤트 데이터 모델
 */
export interface TicketSaleEvent {
  /** 아티스트 이름 */
  artist: string;
  /** 예매 오픈 날짜 (ISO 8601 형식: YYYY-MM-DD) */
  saleOpenDate: string;
  /** 예매 오픈 시간 (24시간제: HH:MM) */
  saleOpenTime: string;
  /** 콘서트 제목 (선택적) */
  concertTitle?: string;
  /** 출처: 'melon' 또는 'interpark' */
  source: 'melon' | 'interpark';
  /** 공지/상세 페이지 링크 (선택적) */
  noticeUrl?: string;
  /** 실제 공연 날짜 (수집하되 표시하지 않음, 선택적) */
  concertDate?: string;
}

/**
 * 달력 표시용 이벤트 데이터 모델
 */
export interface CalendarEvent {
  /** 고유 ID */
  id: string;
  /** 이벤트 제목 */
  title: string;
  /** 시작 시간 (예매 오픈 시간) */
  start: Date;
  /** 종료 시간 (예매 오픈 시간 + 1시간) */
  end: Date;
  /** 아티스트 이름 */
  artist: string;
  /** 출처 */
  source: 'melon' | 'interpark';
  /** 색상 코드 (선택적) */
  color?: string;
  /** 공지/상세 페이지 링크 (선택적) */
  url?: string;
}

/**
 * 스크래핑 결과 데이터 모델
 */
export interface ScrapingResult {
  /** 수집된 이벤트 목록 */
  events: TicketSaleEvent[];
  /** 마지막 업데이트 시간 (ISO 8601 형식) */
  lastUpdated: string;
  /** 에러 메시지 목록 (선택적) */
  errors?: string[];
}
