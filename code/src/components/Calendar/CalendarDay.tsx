'use client';

import { CalendarEvent } from '@/types/ticketSale';
import { isToday } from '@/utils/dateHelpers';
import TicketSaleEventItem from './TicketSaleEventItem';

interface CalendarDayProps {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

const MAX_VISIBLE_EVENTS = 3;

export default function CalendarDay({
  date,
  events,
  isCurrentMonth,
  isToday: isTodayProp,
}: CalendarDayProps) {
  const dayNumber = date.getDate();
  const isTodayDate = isTodayProp || isToday(date);
  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS);
  const remainingCount = events.length - MAX_VISIBLE_EVENTS;

  return (
    <div
      className={`
        min-h-24 md:min-h-32 border border-gray-200 p-2
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 opacity-40'}
        ${isTodayDate ? 'bg-blue-50' : ''}
      `}
    >
      <div
        className={`
          text-sm font-medium mb-1
          ${isTodayDate ? 'flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white' : ''}
          ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
        `}
      >
        {dayNumber}
      </div>
      <div className="space-y-1">
        {visibleEvents.map((event) => (
          <TicketSaleEventItem key={event.id} event={event} isCompact={true} />
        ))}
        {remainingCount > 0 && (
          <div className="text-xs text-gray-500 font-medium px-2 py-1">
            +{remainingCount}개 더보기
          </div>
        )}
      </div>
    </div>
  );
}
