'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

export function ChatbotWidget() {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Don't load widget on widget pages to prevent recursion
    if (pathname?.startsWith('/widget/')) {
      setShouldLoad(false);
      return;
    }
    setShouldLoad(true);
  }, [pathname]);

  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      {/* Prefetch SDK script for faster loading */}
      <link rel="prefetch" href="/widget/sdk.js" as="script" />
      
      {/* Preconnect to speed up iframe loading */}
      <link rel="preconnect" href={typeof window !== 'undefined' ? window.location.origin : ''} />
      
      {/* Load SDK with high priority */}
      <Script
        src="/widget/sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[ChatbotWidget] SDK loaded, ChatWidget available:', !!(window as any).ChatWidget);
          if ((window as any).ChatWidget) {
            console.log('[ChatbotWidget] Initializing ChatWidget SDK');
            (window as any).ChatWidget.init({
              chatbotId: '10df2440-6aac-441a-855d-715c0ea8e506'
            });
          } else {
            console.error('[ChatbotWidget] ChatWidget not found on window');
          }
        }}
      />
    </>
  );
}
