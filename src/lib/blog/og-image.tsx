import { ImageResponse } from 'next/og';

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const OG_IMAGE_CONTENT_TYPE = 'image/png' as const;

/**
 * Generates a branded VocUI Open Graph image for a blog post.
 *
 * Usage in each blog post's `opengraph-image.tsx`:
 * ```ts
 * import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';
 * export const size = OG_IMAGE_SIZE;
 * export const contentType = OG_IMAGE_CONTENT_TYPE;
 * export default function Image() {
 *   return generateBlogOGImage({ title: '...', category: '...' });
 * }
 * ```
 */
export function generateBlogOGImage({
  title,
  category,
}: {
  title: string;
  category: string;
}): ImageResponse {
  // Brand colors: sky-600 (#0284c7), sky-800 (#075985), sky-950 (#082f49)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          background: 'linear-gradient(145deg, #082f49 0%, #0c4a6e 40%, #0369a1 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top row: logo + category */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* VocUI wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              V
            </div>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.5px' }}>
              VocUI
            </span>
          </div>

          {/* Category badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 20px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontSize: '16px',
              fontWeight: 600,
              color: '#bae6fd',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {category}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '950px',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 50 ? '48px' : '56px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom row: domain + tagline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '18px', color: 'rgba(186,230,253,0.8)', fontWeight: 500 }}>
            vocui.com/blog
          </span>
          <span style={{ fontSize: '18px', color: 'rgba(186,230,253,0.6)', fontWeight: 400 }}>
            AI Chatbot Platform
          </span>
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE },
  );
}
