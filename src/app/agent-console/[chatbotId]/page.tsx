'use client';

import { use, useState, useEffect } from 'react';
import { AgentConsoleLayout } from '@/components/agent-console/AgentConsoleLayout';

interface EmbeddableAgentConsoleProps {
  params: Promise<{ chatbotId: string }>;
}

export default function EmbeddableAgentConsolePage({ params }: EmbeddableAgentConsoleProps) {
  const { chatbotId } = use(params);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Receive API key from parent via postMessage
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'agent-console-auth' && event.data?.apiKey) {
        setApiKey(event.data.apiKey);
      }
    }
    window.addEventListener('message', handleMessage);

    // Also check for API key in URL hash (fallback)
    const hash = window.location.hash;
    if (hash.startsWith('#key=')) {
      setApiKey(hash.replace('#key=', ''));
    }

    // Signal to parent that we're ready for auth
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'agent-console-ready', chatbotId }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [chatbotId]);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="text-center text-gray-500">
          <p className="text-sm">Waiting for authentication...</p>
          <p className="text-xs mt-1">Provide an API key via postMessage or URL hash</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-950">
        <div className="text-center text-red-500">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-950">
      <AgentConsoleLayout
        chatbotId={chatbotId}
        apiKey={apiKey}
        authMode="apikey"
      />
    </div>
  );
}
