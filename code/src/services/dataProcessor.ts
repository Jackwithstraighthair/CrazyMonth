import type { TicketSaleEvent } from '@/types/ticketSale';
import { isInMonth, isPastDate, getCurrentMonthKey } from '@/utils/dateHelpers';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{1,2}:\d{2}$/;

export function validateEvent(event: TicketSaleEvent, monthKey: string): boolean {
  if (!event.artist || !event.saleOpenDate || !event.saleOpenTime || !event.source) return false;
  if (!DATE_RE.test(event.saleOpenDate) || !TIME_RE.test(event.saleOpenTime)) return false;
  if (!isInMonth(event.saleOpenDate, monthKey)) return false;
  if (isPastDate(event.saleOpenDate)) return false;
  return true;
}

export function mergeAndDedupe(events: TicketSaleEvent[], monthKey: string): TicketSaleEvent[] {
  const seen = new Set<string>();
  const filtered: TicketSaleEvent[] = [];
  for (const e of events) {
    if (!validateEvent(e, monthKey)) continue;
    const key = `${e.artist}-${e.saleOpenDate}-${e.saleOpenTime}-${e.source}`;
    if (seen.has(key)) continue;
    seen.add(key);
    filtered.push(e);
  }
  filtered.sort((a, b) => {
    const d = a.saleOpenDate.localeCompare(b.saleOpenDate);
    if (d !== 0) return d;
    return a.saleOpenTime.localeCompare(b.saleOpenTime);
  });
  return filtered;
}

export function resolveMonthKey(monthParam: string | null): string {
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) return monthParam;
  return getCurrentMonthKey();
}
