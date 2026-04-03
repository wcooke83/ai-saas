import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'Knowledge Base Chatbot: The Complete Guide | VocUI';

export default function Image() {
  return generateBlogOGImage({
    title: 'Knowledge Base Chatbot: The Complete Guide',
    category: 'Topic Guide',
    domain: 'vocui.com/guides',
  });
}
