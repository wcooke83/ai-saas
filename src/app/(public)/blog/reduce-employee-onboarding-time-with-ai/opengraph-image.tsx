import { generateBlogOGImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from '@/lib/blog/og-image';

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const alt = 'Reduce Employee Onboarding Time with an AI Knowledge Bot';

export default function Image() {
  return generateBlogOGImage({
    title: 'Reduce Employee Onboarding Time with an AI Knowledge Bot',
    category: 'Strategy',
  });
}
