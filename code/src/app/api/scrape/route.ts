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
    const [melonEvents, interparkEvents] = await Promise.all([
      scrapeMelon(monthKey),
      scrapeInterpark(monthKey),
    ]);
    const all = mergeAndDedupe([...melonEvents, ...interparkEvents], monthKey);

    return NextResponse.json({
      data: all,
      metadata: {
        month: monthKey,
        lastUpdated: new Date().toISOString(),
        totalEvents: all.length,
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
