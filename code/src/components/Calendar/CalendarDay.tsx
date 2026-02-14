'use client';

import type { TicketSaleEvent } from '@/types/ticketSale';
import TicketSaleEventItem from './TicketSaleEventItem';
import { getTodayKey } from '@/utils/dateHelpers';

type CalendarDayProps = {
  dateKey: string | null; // YYYY-MM-DD or null for empty cell
  dayOfMonth: number | null;
  events: TicketSaleEvent[];
  maxVisible?: number;
};

export default function CalendarDay({
  dateKey,
  dayOfMonth,
  events,
  maxVisible = 3,
}: CalendarDayProps) {
  const isToday = dateKey === getTodayKey();
  const isEmpty = dateKey === null;

  if (isEmpty) {
    return <div className="min-h-[80px] md:min-h-[100px] bg-gray-50/50 border border-gray-100" />;
  }

  const visible = events.slice(0, maxVisible);
  const restCount = events.length - maxVisible;

  return (
    <div
      className={`min-h-[80px] md:min-h-[100px] border border-gray-200 bg-white p-1 md:p-2 flex flex-col ${
        isToday ? 'ring-2 ring-blue-400 ring-inset' : ''
      }`}
      role="gridcell"
      aria-label={dateKey ? `${dateKey} ${events.length}개 이벤트` : '빈 날짜'}
    >
      <div className="text-right">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${
            isToday ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700'
          }`}
        >
          {dayOfMonth}
        </span>
      </div>
      <div className="flex-1 space-y-1 overflow-hidden">
        {visible.map((evt, i) => (
          <TicketSaleEventItem key={`${evt.artist}-${evt.saleOpenDate}-${evt.saleOpenTime}-${i}`} event={evt} />
        ))}
        {restCount > 0 && (
          <div className="text-xs text-gray-500 font-medium pl-1">+{restCount}개</div>
        )}
      </div>
    </div>
  );
}
