'use client';

import { useEffect, useRef } from 'react';

interface CalendlyInlineProps {
  url: string;
  eventType: string;
  primaryColor?: string;
}

export function CalendlyInline({ url, eventType, primaryColor = '#0ea5e9' }: CalendlyInlineProps) {
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
      <div style={{ fontSize: '13px', color: '#334155', marginBottom: '8px' }}>
        Complete your booking on Calendly:
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '8px',
          backgroundColor: primaryColor,
          color: '#fff',
          fontSize: '13px',
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Book on Calendly
      </a>
      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
        {eventType}
      </div>
    </div>
  );
}
