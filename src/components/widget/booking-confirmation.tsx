'use client';

import type { BookingResponse } from '@/lib/calendar/types';

interface BookingConfirmationProps {
  booking: BookingResponse;
  eventTitle?: string;
  primaryColor?: string;
  textColor?: string;
  mutedColor?: string;
  onCancel?: () => void;
}

function generateICSContent(booking: BookingResponse, title: string): string {
  const start = new Date(booking.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date(booking.end).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    booking.meetingUrl ? `LOCATION:${booking.meetingUrl}` : '',
    `ATTENDEE:${booking.attendeeEmail}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
}

export function BookingConfirmation({
  booking,
  eventTitle = 'Appointment',
  primaryColor = '#0ea5e9',
  textColor = 'currentColor',
  mutedColor = 'inherit',
  onCancel,
}: BookingConfirmationProps) {
  const startDate = new Date(booking.start);
  const endDate = new Date(booking.end);

  const dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStr = `${startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })} - ${endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`;

  function handleAddToCalendar() {
    const ics = generateICSContent(booking, eventTitle);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle.toLowerCase().replace(/\s+/g, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      style={{
        border: `1px solid ${primaryColor}33`,
        borderRadius: '12px',
        padding: '14px',
        margin: '8px 0',
        backgroundColor: `${primaryColor}08`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '14px',
          }}
        >
          &#10003;
        </div>
        <span style={{ fontWeight: 600, fontSize: '14px', color: textColor }}>
          {booking.status === 'confirmed' ? 'Booking Confirmed' : 'Booking Pending'}
        </span>
      </div>

      <div style={{ fontSize: '13px', color: mutedColor, lineHeight: '1.6' }}>
        <div>{dateStr}</div>
        <div>{timeStr}</div>
        {booking.meetingUrl && (
          <div style={{ marginTop: '4px' }}>
            <a
              href={booking.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: primaryColor, textDecoration: 'underline' }}
            >
              Join Meeting
            </a>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <button
          type="button"
          onClick={handleAddToCalendar}
          style={{
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: primaryColor,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}`; }}
          onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
        >
          Add to Calendar
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              backgroundColor: 'transparent',
              color: '#ef4444',
              border: '1px solid #ef444433',
              cursor: 'pointer',
              outline: 'none',
            }}
            onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px #ef4444'; }}
            onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
