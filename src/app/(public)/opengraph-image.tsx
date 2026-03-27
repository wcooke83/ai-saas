import { ImageResponse } from 'next/og';

export const alt = 'VocUI - Build Intelligent Chatbots';
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

        {/* Title */}
        <span style={{ fontSize: 56, fontWeight: 800, color: 'white', letterSpacing: -2 }}>
          Build Intelligent Chatbots
        </span>

        {/* Subtitle */}
        <span
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 16,
            maxWidth: 700,
            textAlign: 'center' as const,
            lineHeight: 1.4,
          }}
        >
          AI chatbots trained on your knowledge base. Deploy on your website, Slack, or Telegram in minutes.
        </span>

        {/* CTA hint */}
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            padding: '12px 28px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.15)',
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>
            Get Started Free
          </span>
        </div>

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
