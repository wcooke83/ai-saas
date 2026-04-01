'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

const CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';

export function ChatbotWidget() {
  const pathname = usePathname();

  // Don't load widget on widget pages to prevent recursion
  if (pathname?.startsWith('/widget/')) {
    return null;
  }
  // Don't load on deploy pages — the chatbot's own widget is shown there as a demo
  if (pathname?.includes('/deploy')) {
    return null;
  }

  return (
    <Script
      src={`/widget/sdk.js`}
      data-chatbot-id={CHATBOT_ID}
      strategy="afterInteractive"
    />
  );
}
