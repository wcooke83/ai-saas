import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'AI Chatbot vs Live Chat: Which Is Right for Your Business?';

export default function Image() {
  return generateBlogOGImage({
    title: 'AI Chatbot vs Live Chat: Which Is Right for Your Business?',
    category: 'Comparison',
  });
}
