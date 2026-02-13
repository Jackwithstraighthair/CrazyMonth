'use client';

import { format } from 'date-fns';
import { getWeekdayName } from '@/utils/dateHelpers';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  const monthYear = format(currentDate, 'yyyy년 M월');
  const weekdays = Array.from({ length: 7 }, (_, i) => getWeekdayName(i));

  return (
    <div className="mb-6">
      <div className="flex items-center justify-center mb-4">
        {onPrevMonth && (
          <button
            onClick={onPrevMonth}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="이전 달"
            disabled={!onPrevMonth}
          >
            ←
          </button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mx-4">
          {monthYear}
        </h1>
        {onNextMonth && (
          <button
            onClick={onNextMonth}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="다음 달"
            disabled={!onNextMonth}
          >
            →
          </button>
        )}
      </div>
      <div className="grid grid-cols-7 gap-0 border-b border-gray-300">
        {weekdays.map((day, index) => {
          const isWeekend = index === 0 || index === 6;
          return (
            <div
              key={day}
              className={`
                py-3 text-center font-semibold text-sm
                ${isWeekend ? 'text-red-500' : 'text-gray-700'}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
