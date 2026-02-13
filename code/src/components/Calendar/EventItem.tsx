'use client';

import { CalendarEvent } from '@/types/event';
import { formatTime } from '@/utils/dateHelpers';

interface EventItemProps {
  event: CalendarEvent;
  isCompact?: boolean;
}

export default function EventItem({ event, isCompact = false }: EventItemProps) {
  const handleClick = () => {
    if (event.url) {
      window.open(event.url, '_blank', 'noopener,noreferrer');
    }
  };

  const timeStr = formatTime(
    `${event.start.getHours().toString().padStart(2, '0')}:${event.start.getMinutes().toString().padStart(2, '0')}`
  );

  return (
    <div
      onClick={handleClick}
      className={`
        rounded-md p-2 mb-1 cursor-pointer transition-all duration-200
        ${isCompact ? 'text-xs py-1 px-2' : 'text-sm py-2 px-3'}
        ${event.url ? 'hover:scale-105 hover:shadow-md' : ''}
      `}
      style={{
        backgroundColor: event.color || '#6B7280',
        color: '#FFFFFF',
      }}
      role={event.url ? 'button' : undefined}
      tabIndex={event.url ? 0 : undefined}
      onKeyDown={(e) => {
        if (event.url && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="font-bold truncate">{event.artist}</div>
      <div className={`${isCompact ? 'text-xs' : 'text-xs'} opacity-90`}>{timeStr}</div>
      {event.source && (
        <div className={`${isCompact ? 'text-xs' : 'text-xs'} opacity-75 mt-1`}>
          {event.source === 'nol' ? 'NOL' : '멜론'}
        </div>
      )}
    </div>
  );
}
