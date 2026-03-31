import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = '7 Chatbot Lead Generation Strategies That Work';

export default function Image() {
  return generateBlogOGImage({
    title: '7 Chatbot Lead Generation Strategies That Work',
    category: 'Strategy',
  });
}
