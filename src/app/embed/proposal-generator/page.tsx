'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProposalGenerator } from '@/components/tools/ProposalGenerator';

function ProposalGeneratorEmbed() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('key');
  const isPro = searchParams.get('pro') === 'true';

  // Notify parent of ready state and handle auto-resize
  useEffect(() => {
    // Signal ready to parent
    if (window.parent !== window) {
      window.parent.postMessage(
        { source: 'ai-saas-embed', type: 'ready', toolId: 'proposal-generator' },
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
            toolId: 'proposal-generator',
            payload: { height: document.documentElement.scrollHeight },
          },
          '*'
        );
      }
    });

    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  const handleGenerate = (sections: Array<{ type: string; title: string; content: string }>) => {
    // Notify parent of generation result
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          source: 'ai-saas-embed',
          type: 'result',
          toolId: 'proposal-generator',
          payload: { sections },
        },
        '*'
      );
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <ProposalGenerator
        apiKey={apiKey || undefined}
        isPro={isPro}
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

export default function ProposalGeneratorEmbedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ProposalGeneratorEmbed />
    </Suspense>
  );
}
