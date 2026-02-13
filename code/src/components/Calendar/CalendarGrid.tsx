'use client';

import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth } from 'date-fns';
import { CalendarEvent } from '@/types/event';
import { isToday } from '@/utils/dateHelpers';
import CalendarDay from './CalendarDay';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export default function CalendarGrid({ currentDate, events }: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // 날짜별로 이벤트 그룹화
  const eventsByDate = new Map<string, CalendarEvent[]>();
  events.forEach((event) => {
    const dateKey = format(event.start, 'yyyy-MM-dd');
    if (!eventsByDate.has(dateKey)) {
      eventsByDate.set(dateKey, []);
    }
    eventsByDate.get(dateKey)!.push(event);
  });

  // 월 숫자 표시 (중앙 배경)
  const monthNumber = currentDate.getMonth() + 1;

  return (
    <div className="relative">
      {/* 월 숫자 배경 (반투명) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{
          fontSize: '20rem',
          fontWeight: 'bold',
          color: 'rgba(0, 0, 0, 0.05)',
          lineHeight: '1',
        }}
      >
        {monthNumber}
      </div>

      {/* 달력 그리드 */}
      <div className="relative z-10 grid grid-cols-7 gap-0">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDate.get(dateKey) || [];
          const isCurrentMonthDate = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <CalendarDay
              key={dateKey}
              date={day}
              events={dayEvents}
              isCurrentMonth={isCurrentMonthDate}
              isToday={isTodayDate}
            />
          );
        })}
      </div>
    </div>
  );
}
