import { ImageResponse } from 'next/og';

export const alt = 'VocUI Tools - AI-Powered Productivity Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top bar with logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'absolute',
            top: 40,
            left: 48,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.15)',
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 800, color: 'white' }}>V</span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>VocUI</span>
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.15)',
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
            Tools
          </span>
        </div>

        {/* Title */}
        <span style={{ fontSize: 52, fontWeight: 800, color: 'white', letterSpacing: -1 }}>
          AI-Powered Productivity Tools
        </span>

        {/* Description */}
        <span
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 16,
            maxWidth: 650,
            textAlign: 'center' as const,
          }}
        >
          Email writer, proposal generator, blog writer, and more
        </span>

        {/* URL */}
        <span
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.4)',
            position: 'absolute',
            bottom: 32,
          }}
        >
          vocui.com/tools
        </span>
      </div>
    ),
    { ...size }
  );
}
