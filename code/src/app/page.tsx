'use client';

import { useEffect, useState } from 'react';
import type { TicketSaleEvent } from '@/types/ticketSale';
import type { ScrapeResponse } from '@/types/ticketSale';
import { getCurrentMonthKey } from '@/utils/dateHelpers';
import { getMonthRange } from '@/utils/dateHelpers';
import ResponsiveContainer from '@/components/Layout/ResponsiveContainer';
import CalendarHeader from '@/components/Calendar/CalendarHeader';
import CalendarGrid from '@/components/Calendar/CalendarGrid';

export default function Home() {
  const [data, setData] = useState<ScrapeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const monthKey = getCurrentMonthKey();
  const { year, month } = getMonthRange(monthKey);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/scrape?month=${monthKey}`)
      .then((res) => res.json())
      .then((json: ScrapeResponse & { error?: string }) => {
        if (cancelled) return;
        setData({
          data: json.data ?? [],
          metadata: json.metadata ?? {
            month: monthKey,
            lastUpdated: new Date().toISOString(),
            totalEvents: 0,
          },
        });
        if (json.error) setError(json.error);
      })
      .catch((err) => {
        if (!cancelled) {
          setError('일정을 불러오지 못했습니다.');
          setData({
            data: [],
            metadata: {
              month: monthKey,
              lastUpdated: new Date().toISOString(),
              totalEvents: 0,
            },
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [monthKey]);

  const events: TicketSaleEvent[] = data?.data ?? [];

  return (
    <ResponsiveContainer className="py-6 md:py-10">
      <main role="main">
        <div className="relative">
          {/* PRD 2.2.3: 배경 큰 월 숫자 */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden
          >
            <span className="text-[min(20vw,180px)] font-bold text-gray-200 dark:text-gray-700 opacity-10">
              {month}
            </span>
          </div>

          <CalendarHeader year={year} month={month} />

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500" role="status" aria-live="polite">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p>일정을 불러오는 중...</p>
            </div>
          )}

          {!loading && (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 text-amber-800 text-sm" role="alert">
                  {error}
                </div>
              )}
              <CalendarGrid monthKey={monthKey} events={events} />
              {data?.metadata?.lastUpdated && (
                <p className="text-xs text-gray-400 mt-4 text-center">
                  마지막 업데이트: {new Date(data.metadata.lastUpdated).toLocaleString('ko-KR')}
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </ResponsiveContainer>
  );
}
