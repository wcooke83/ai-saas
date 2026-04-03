import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'Intercom Alternatives That Won\u2019t Break the Budget';

export default function Image() {
  return generateBlogOGImage({
    title: 'Intercom Alternatives That Won\u2019t Break the Budget',
    category: 'Comparison',
  });
}
