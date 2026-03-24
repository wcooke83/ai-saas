'use client';

import { use, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AgentConsoleLayout } from '@/components/agent-console/AgentConsoleLayout';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';

interface ConversationsPageProps {
  params: Promise<{ id: string }>;
}

export default function ConversationsPage({ params }: ConversationsPageProps) {
  const { id } = use(params);
  const [chatbotName, setChatbotName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChatbot() {
      try {
        const res = await fetch(`/api/chatbots/${id}`);
        if (res.ok) {
          const data = await res.json();
          setChatbotName(data.data.chatbot.name);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchChatbot();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)]">
      <ChatbotPageHeader chatbotId={id} title="Agent Console" />

      <div className="flex-1" style={{ height: 'calc(100% - 5rem)' }}>
        <AgentConsoleLayout
          chatbotId={id}
          authMode="session"
        />
      </div>
    </div>
  );
}
