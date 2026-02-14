'use client';

import type { TicketSaleEvent } from '@/types/ticketSale';

type TicketSaleEventItemProps = {
  event: TicketSaleEvent;
};

const SOURCE_LABEL: Record<string, string> = {
  melon: '멜론티켓',
  interpark: '인터파크',
};

const ARTIST_COLORS: Record<string, string> = {
  엔시티드림: 'bg-blue-100 border-blue-300',
  엔시티위시: 'bg-indigo-100 border-indigo-300',
  라이즈: 'bg-rose-100 border-rose-300',
  세븐틴: 'bg-pink-100 border-pink-300',
  임영웅: 'bg-amber-100 border-amber-300',
  엑소: 'bg-red-100 border-red-300',
  방탄소년단: 'bg-purple-100 border-purple-300',
  워너원: 'bg-cyan-100 border-cyan-300',
  데이식스: 'bg-emerald-100 border-emerald-300',
  투바투: 'bg-teal-100 border-teal-300',
  스트레이키즈: 'bg-orange-100 border-orange-300',
  에이티즈: 'bg-fuchsia-100 border-fuchsia-300',
  더보이즈: 'bg-sky-100 border-sky-300',
  보이넥스트도어: 'bg-lime-100 border-lime-300',
  엔하이픈: 'bg-violet-100 border-violet-300',
  제로베이스원: 'bg-rose-100 border-rose-300',
};

function getEventStyle(artist: string): string {
  return ARTIST_COLORS[artist] ?? 'bg-gray-100 border-gray-300';
}

export default function TicketSaleEventItem({ event }: TicketSaleEventItemProps) {
  const style = getEventStyle(event.artist);
  const sourceLabel = SOURCE_LABEL[event.source] ?? event.source;
  const content = (
    <>
      <div className="font-bold text-gray-900 text-sm truncate" title={event.artist}>
        {event.artist}
      </div>
      <div className="text-xs text-gray-600 flex items-center gap-1" aria-label="예매 오픈 시간">
        <span aria-hidden>⏰</span> {event.saleOpenTime}
      </div>
      <div className="text-xs text-gray-500" aria-label="출처">
        <span aria-hidden>📍</span> {sourceLabel}
      </div>
    </>
  );

  const className = `rounded-lg border p-2 shadow-sm text-left transition hover:shadow-md ${style}`;

  if (event.noticeUrl) {
    return (
      <a
        href={event.noticeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block ${className}`}
        aria-label={`${event.artist} ${event.saleOpenTime} 예매 - ${sourceLabel}`}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
