'use client';

import { useState } from 'react';
import type { TimeSlot } from '@/lib/calendar/types';

interface CalendarSlotsProps {
  slots: TimeSlot[];
  timezone: string;
  duration: number;
  onSelect: (slot: TimeSlot) => void;
  primaryColor?: string;
  textColor?: string;
  mutedColor?: string;
}

export function CalendarSlots({
  slots, timezone, duration, onSelect,
  primaryColor = '#0ea5e9',
  textColor = 'currentColor',
  mutedColor = 'inherit',
}: CalendarSlotsProps) {
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
      {/* Date tabs with fade indicators */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '8px',
            scrollbarWidth: 'thin',
          }}
        >
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
                borderColor: date === active ? primaryColor : `${textColor}33`,
                backgroundColor: date === active ? primaryColor : 'transparent',
                color: date === active ? '#fff' : mutedColor,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {date}
            </button>
          ))}
        </div>
        {dates.length > 3 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: '8px',
              width: '24px',
              background: 'linear-gradient(to right, transparent, var(--widget-bg, #fff))',
              pointerEvents: 'none',
            }}
          />
        )}
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
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${primaryColor}10`;
                  e.currentTarget.style.color = primaryColor;
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = `${primaryColor}10`;
                  e.currentTarget.style.color = primaryColor;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ fontSize: '11px', color: mutedColor, opacity: 0.7, marginTop: '6px' }}>
        {duration} min | {timezone}
      </div>
    </div>
  );
}
