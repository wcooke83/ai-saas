'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmailWriter } from '@/components/tools/EmailWriter';

function EmailWriterEmbed() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('key');

  // Notify parent of ready state and handle auto-resize
  useEffect(() => {
    // Signal ready to parent
    if (window.parent !== window) {
      window.parent.postMessage(
        { source: 'ai-saas-embed', type: 'ready', toolId: 'email-writer' },
        '*'
      );
    }

    // Auto-resize observer
    const observer = new ResizeObserver(() => {
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            source: 'ai-saas-embed',
            type: 'resize',
            toolId: 'email-writer',
            payload: { height: document.documentElement.scrollHeight },
          },
          '*'
        );
      }
    });

    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  const handleGenerate = (result: { subject: string; body: string }) => {
    // Notify parent of generation result
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          source: 'ai-saas-embed',
          type: 'result',
          toolId: 'email-writer',
          payload: result,
        },
        '*'
      );
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'rgb(var(--card-bg))' }}>
      <EmailWriter
        apiKey={apiKey || undefined}
        onGenerate={handleGenerate}
      />

      {/* Branding */}
      <div className="mt-6 text-center text-xs text-secondary-400 dark:text-secondary-500">
        Powered by{' '}
        <a
          href="https://yourdomain.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 dark:text-primary-400 hover:underline dark:hover:text-primary-300"
        >
          AI SaaS Tools
        </a>
      </div>
    </div>
  );
}

export default function EmailWriterEmbedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center text-secondary-500 dark:text-secondary-400" style={{ backgroundColor: 'rgb(var(--card-bg))' }}>Loading...</div>}>
      <EmailWriterEmbed />
    </Suspense>
  );
}
