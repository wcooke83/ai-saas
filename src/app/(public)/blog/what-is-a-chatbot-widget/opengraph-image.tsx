import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'What Is a Chatbot Widget and How Does It Work?';

export default function Image() {
  return generateBlogOGImage({
    title: 'What Is a Chatbot Widget and How Does It Work?',
    category: 'Explainer',
  });
}
