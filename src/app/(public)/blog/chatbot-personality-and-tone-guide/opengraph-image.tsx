import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'How to Choose the Right Personality and Tone for Your Chatbot';

export default function Image() {
  return generateBlogOGImage({
    title: 'How to Choose the Right Personality and Tone for Your Chatbot',
    category: 'Guide',
  });
}
