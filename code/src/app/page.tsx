'use client';

import { useState, useEffect } from 'react';
import { scrapeAllSources } from '@/services/scraper';
import { convertToCalendarEvents, processEvents } from '@/services/dataProcessor';
import { CalendarEvent } from '@/types/event';
import ResponsiveContainer from '@/components/Layout/ResponsiveContainer';
import CalendarHeader from '@/components/Calendar/CalendarHeader';
import CalendarGrid from '@/components/Calendar/CalendarGrid';

export default function Home() {
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await scrapeAllSources();
        const processedEvents = processEvents(result.events);
        const calendarEvents = convertToCalendarEvents(processedEvents);
        setEvents(calendarEvents);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('데이터를 불러오는 중 오류가 발생했습니다.'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <ResponsiveContainer>
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <CalendarHeader currentDate={currentDate} />
        
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">데이터를 불러오는 중...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">오류 발생</p>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <CalendarGrid currentDate={currentDate} events={events} />
            {events.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">이번 달 예매 일정이 없습니다.</p>
                <p className="text-sm mt-2">곧 업데이트될 예정입니다.</p>
              </div>
            )}
          </>
        )}
      </div>
    </ResponsiveContainer>
  );
}
