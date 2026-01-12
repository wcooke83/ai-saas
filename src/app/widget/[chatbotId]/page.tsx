'use client';

import { useState, useEffect, use } from 'react';
import { ChatWidget } from '@/components/widget/ChatWidget';
import type { WidgetConfig, Chatbot } from '@/lib/chatbots/types';

interface WidgetPageProps {
  params: Promise<{ chatbotId: string }>;
}

export default function WidgetPage({ params }: WidgetPageProps) {
  const { chatbotId } = use(params);
  const [config, setConfig] = useState<{
    chatbot: Partial<Chatbot>;
    widgetConfig: WidgetConfig;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch(`/api/widget/${chatbotId}/config`);
        if (!response.ok) {
          throw new Error('Chatbot not found or not available');
        }
        const data = await response.json();
        setConfig(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chatbot');
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, [chatbotId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <div className="text-red-500 text-center p-4">
          <p className="font-medium">Unable to load chatbot</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ChatWidget
      chatbotId={chatbotId}
      chatbot={config.chatbot}
      config={config.widgetConfig}
    />
  );
}
