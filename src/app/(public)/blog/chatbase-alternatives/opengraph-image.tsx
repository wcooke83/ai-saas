import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'Top Chatbase Alternatives Worth Trying in 2026';

export default function Image() {
  return generateBlogOGImage({
    title: 'Top Chatbase Alternatives Worth Trying in 2026',
    category: 'Comparison',
  });
}
