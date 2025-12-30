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
    <div className="min-h-screen bg-white p-4">
      <EmailWriter
        apiKey={apiKey || undefined}
        onGenerate={handleGenerate}
      />

      {/* Branding */}
      <div className="mt-6 text-center text-xs text-secondary-400">
        Powered by{' '}
        <a
          href="https://yourdomain.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:underline"
        >
          AI SaaS Tools
        </a>
      </div>
    </div>
  );
}

export default function EmailWriterEmbedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <EmailWriterEmbed />
    </Suspense>
  );
}
