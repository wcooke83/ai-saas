'use client';

import { useState, useEffect, use } from 'react';
import { ChatWidget } from '@/components/widget/ChatWidget';
import type { WidgetConfig, Chatbot, PreChatFormConfig, PostChatSurveyConfig, FileUploadConfig, ProactiveMessagesConfig, TranscriptConfig, EscalationConfig, LiveHandoffConfig, FeedbackConfig } from '@/lib/chatbots/types';

interface WidgetPageProps {
  params: Promise<{ chatbotId: string }>;
}

export default function WidgetPage({ params }: WidgetPageProps) {
  const { chatbotId } = use(params);
  const [config, setConfig] = useState<{
    chatbot: Partial<Chatbot>;
    widgetConfig: WidgetConfig;
    preChatFormConfig?: PreChatFormConfig;
    postChatSurveyConfig?: PostChatSurveyConfig;
    fileUploadConfig?: FileUploadConfig;
    proactiveMessagesConfig?: ProactiveMessagesConfig;
    transcriptConfig?: TranscriptConfig;
    escalationConfig?: EscalationConfig;
    liveHandoffConfig?: LiveHandoffConfig;
    agentsAvailable?: boolean;
    memoryEnabled?: boolean;
    sessionTtlHours?: number;
    feedbackConfig?: FeedbackConfig;
    creditExhausted?: boolean;
    creditLow?: boolean;
    creditRemaining?: number | null;
    creditExhaustionMode?: string;
    creditExhaustionConfig?: Record<string, unknown>;
    creditPackages?: Array<{ id: string; name: string; creditAmount: number; priceCents: number; stripePriceId: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<Record<string, string> | null>(null);
  const [userContext, setUserContext] = useState<Record<string, unknown> | null>(null);

  // Listen for user-context messages from parent SDK
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'user-context') {
        if (event.data.user) setUserData(event.data.user);
        if (event.data.context) setUserContext(event.data.context);
      }
    };
    window.addEventListener('message', handleMessage);

    // Signal to parent that widget is ready to receive data
    if (window.self !== window.top) {
      window.parent.postMessage({ type: 'widget-ready' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    async function fetchConfig() {
      try {
        // Add cache-busting to ensure fresh config
        const cacheBuster = Date.now();
        const response = await fetch(`/api/widget/${chatbotId}/config?_t=${cacheBuster}`);
        const data = await response.json();
        if (!response.ok) {
          const detail = data?.error?.details || data?.error?.message || `HTTP ${response.status}`;
          throw new Error(detail);
        }
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
      config={{
        ...config.widgetConfig,
        autoOpen: true,
        autoOpenDelay: 0,
      }}
      preChatFormConfig={config.preChatFormConfig}
      postChatSurveyConfig={config.postChatSurveyConfig}
      language={config.chatbot.language || 'en'}
      fileUploadConfig={config.fileUploadConfig}
      proactiveMessagesConfig={config.proactiveMessagesConfig}
      transcriptConfig={config.transcriptConfig}
      escalationConfig={config.escalationConfig}
      feedbackConfig={config.feedbackConfig as FeedbackConfig | undefined}
      liveHandoffConfig={config.liveHandoffConfig}
      agentsAvailable={config.agentsAvailable === true}
      memoryEnabled={config.memoryEnabled === true}
      sessionTtlHours={config.sessionTtlHours}
      userData={userData}
      userContext={userContext}
      creditExhausted={config.creditExhausted === true}
      creditLow={config.creditLow === true}
      creditRemaining={config.creditRemaining ?? null}
      creditExhaustionMode={config.creditExhaustionMode}
      creditExhaustionConfig={config.creditExhaustionConfig}
      creditPackages={config.creditPackages}
    />
  );
}
