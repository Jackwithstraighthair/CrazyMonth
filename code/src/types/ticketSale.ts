export interface TicketSaleEvent {
  artist: string;
  saleOpenDate: string; // YYYY-MM-DD
  saleOpenTime: string; // HH:MM 24h
  concertTitle?: string;
  source: 'melon' | 'interpark';
  noticeUrl?: string;
}

export interface ScrapeResponse {
  data: TicketSaleEvent[];
  metadata: {
    month: string;
    lastUpdated: string;
    totalEvents: number;
  };
}
