import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
          borderRadius: 36,
        }}
      >
        <span
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: 'white',
            letterSpacing: -4,
          }}
        >
          V
        </span>
      </div>
    ),
    { ...size }
  );
}
