import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'Chatbot Security and Privacy: What Business Owners Need to Know';

export default function Image() {
  return generateBlogOGImage({
    title: 'Chatbot Security and Privacy: What Business Owners Need to Know',
    category: 'Guide',
  });
}
