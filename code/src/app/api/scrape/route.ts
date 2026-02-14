import { NextRequest, NextResponse } from 'next/server';
import { scrapeMelon } from '@/services/scrapers/melonScraper';
import { scrapeInterpark } from '@/services/scrapers/interparkScraper';
import { mergeAndDedupe, resolveMonthKey } from '@/services/dataProcessor';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const monthParam = request.nextUrl.searchParams.get('month');
  const monthKey = resolveMonthKey(monthParam);

  try {
    // 각 스크래핑을 독립적으로 실행하여 하나가 실패해도 다른 것은 계속 진행
    const [melonEvents, interparkEvents] = await Promise.allSettled([
      scrapeMelon(monthKey),
      scrapeInterpark(monthKey),
    ]);

    const melonData = melonEvents.status === 'fulfilled' ? melonEvents.value : [];
    const interparkData = interparkEvents.status === 'fulfilled' ? interparkEvents.value : [];

    // 디버깅 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('=== Scraping Results ===');
      console.log('Melon events:', melonData.length, melonData);
      console.log('Interpark events:', interparkData.length, interparkData);
    }

    const allEvents = [...melonData, ...interparkData];
    const merged = mergeAndDedupe(allEvents, monthKey);

    // 최종 결과 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('Merged events:', merged.length, merged);
    }

    return NextResponse.json({
      data: merged,
      metadata: {
        month: monthKey,
        lastUpdated: new Date().toISOString(),
        totalEvents: merged.length,
        sources: {
          melon: melonData.length,
          interpark: interparkData.length,
        },
      },
    });
  } catch (e) {
    console.error('Scrape error:', e);
    return NextResponse.json(
      {
        data: [],
        metadata: {
          month: monthKey,
          lastUpdated: new Date().toISOString(),
          totalEvents: 0,
        },
        error: 'Failed to fetch events',
      },
      { status: 200 }
    );
  }
}
