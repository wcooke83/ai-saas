import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'What Is Prompt Engineering? A Practical Introduction';

export default function Image() {
  return generateBlogOGImage({
    title: 'What Is Prompt Engineering? A Practical Introduction',
    category: 'Explainer',
  });
}
