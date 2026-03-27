import { ImageResponse } from 'next/og';

export const alt = 'VocUI - Voice User Interface';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
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
        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.15)',
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 800, color: 'white', letterSpacing: -2 }}>
            V
          </span>
        </div>

        {/* Brand name */}
        <span style={{ fontSize: 64, fontWeight: 800, color: 'white', letterSpacing: -2 }}>
          VocUI
        </span>

        {/* Tagline */}
        <span
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 12,
            letterSpacing: 2,
            textTransform: 'uppercase' as const,
          }}
        >
          Voice User Interface
        </span>

        {/* Description */}
        <span
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 32,
            maxWidth: 600,
            textAlign: 'center' as const,
            lineHeight: 1.4,
          }}
        >
          AI-powered chatbots trained on your knowledge base
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
          vocui.com
        </span>
      </div>
    ),
    { ...size }
  );
}
