'use client';

import type { TicketSaleEvent } from '@/types/ticketSale';
import { getMonthRange } from '@/utils/dateHelpers';
import CalendarDay from './CalendarDay';

type CalendarGridProps = {
  monthKey: string;
  events: TicketSaleEvent[];
};

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export default function CalendarGrid({ monthKey, events }: CalendarGridProps) {
  const { year, month, daysInMonth, startPadding } = getMonthRange(monthKey);
  const eventsByDate = new Map<string, TicketSaleEvent[]>();
  for (const e of events) {
    const list = eventsByDate.get(e.saleOpenDate) ?? [];
    list.push(e);
    eventsByDate.set(e.saleOpenDate, list);
  }

  const cells: { dateKey: string | null; dayOfMonth: number | null }[] = [];
  for (let i = 0; i < startPadding; i++) {
    cells.push({ dateKey: null, dayOfMonth: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ dateKey, dayOfMonth: d });
  }
  const totalCells = Math.ceil(cells.length / 7) * 7;
  while (cells.length < totalCells) {
    cells.push({ dateKey: null, dayOfMonth: null });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50" role="row">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className="py-2 text-center text-sm font-medium text-gray-600"
            role="columnheader"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7" role="grid">
        {cells.map(({ dateKey, dayOfMonth }, i) => (
          <CalendarDay
            key={dateKey ?? `empty-${i}`}
            dateKey={dateKey}
            dayOfMonth={dayOfMonth}
            events={dateKey ? eventsByDate.get(dateKey) ?? [] : []}
          />
        ))}
      </div>
    </div>
  );
}
