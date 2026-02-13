/**
 * 콘서트 예매 이벤트 데이터 모델
 */
export interface ConcertEvent {
  /** 아티스트 이름 */
  artist: string;
  /** 예매 날짜 (ISO 8601 형식: YYYY-MM-DD) */
  saleDate: string;
  /** 예매 시간 (HH:MM 형식) */
  saleTime: string;
  /** 콘서트 제목 (선택적) */
  title?: string;
  /** 출처: 'nol' 또는 'melon' */
  source: 'nol' | 'melon';
  /** 예매 링크 (선택적) */
  url?: string;
}

/**
 * 달력 표시용 이벤트 데이터 모델
 */
export interface CalendarEvent {
  /** 고유 ID */
  id: string;
  /** 이벤트 제목 */
  title: string;
  /** 시작 시간 */
  start: Date;
  /** 종료 시간 */
  end: Date;
  /** 아티스트 이름 */
  artist: string;
  /** 출처 */
  source: 'nol' | 'melon';
  /** 색상 코드 (선택적) */
  color?: string;
  /** 예매 링크 (선택적) */
  url?: string;
}

/**
 * 스크래핑 결과 데이터 모델
 */
export interface ScrapingResult {
  /** 수집된 이벤트 목록 */
  events: ConcertEvent[];
  /** 마지막 업데이트 시간 (ISO 8601 형식) */
  lastUpdated: string;
  /** 에러 메시지 목록 (선택적) */
  errors?: string[];
}
