'use client';

import { useState } from 'react';
import type { TimeSlot } from '@/lib/calendar/types';

interface CalendarSlotsProps {
  slots: TimeSlot[];
  timezone: string;
  duration: number;
  onSelect: (slot: TimeSlot) => void;
  primaryColor?: string;
}

export function CalendarSlots({ slots, timezone, duration, onSelect, primaryColor = '#0ea5e9' }: CalendarSlotsProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group slots by date
  const grouped: Record<string, TimeSlot[]> = {};
  for (const slot of slots) {
    const date = new Date(slot.start).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: timezone,
    });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(slot);
  }

  const dates = Object.keys(grouped);
  const active = selectedDate || dates[0];

  return (
    <div style={{ margin: '8px 0' }}>
      {/* Date tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '8px' }}>
        {dates.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => setSelectedDate(date)}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              border: '1px solid',
              cursor: 'pointer',
              borderColor: date === active ? primaryColor : '#e2e8f0',
              backgroundColor: date === active ? primaryColor : 'transparent',
              color: date === active ? '#fff' : '#64748b',
            }}
          >
            {date}
          </button>
        ))}
      </div>

      {/* Time slots */}
      {active && grouped[active] && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {grouped[active].map((slot, i) => {
            const time = new Date(slot.start).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: timezone,
            });
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(slot)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  border: `1px solid ${primaryColor}33`,
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 150ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${primaryColor}10`;
                  e.currentTarget.style.color = primaryColor;
                }}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
        {duration} min | {timezone}
      </div>
    </div>
  );
}
