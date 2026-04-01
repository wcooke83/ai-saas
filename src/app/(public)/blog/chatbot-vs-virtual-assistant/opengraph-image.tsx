import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'Chatbot vs Virtual Assistant: What\u0027s the Difference?';

export default function Image() {
  return generateBlogOGImage({
    title: 'Chatbot vs Virtual Assistant: What\u0027s the Difference?',
    category: 'Comparison',
  });
}
