import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'The Small Business Guide to AI Automation in 2025';

export default function Image() {
  return generateBlogOGImage({
    title: 'The Small Business Guide to AI Automation in 2025',
    category: 'Guide',
  });
}
