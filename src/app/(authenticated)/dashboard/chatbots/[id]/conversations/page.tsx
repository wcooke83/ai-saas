'use client';

import { use, useState, useEffect } from 'react';
import { Headphones, Loader2 } from 'lucide-react';
import { AgentConsoleLayout } from '@/components/agent-console/AgentConsoleLayout';
import { H1 } from '@/components/ui/heading';

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
      <div>
        <div className="flex items-center gap-2">
          <Headphones className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <H1 variant="dashboard" className="text-xl">
            Agent Console
          </H1>
        </div>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
          Manage live conversations and respond to handoff requests
        </p>
      </div>

      <div className="flex-1" style={{ height: 'calc(100% - 5rem)' }}>
        <AgentConsoleLayout
          chatbotId={id}
          authMode="session"
        />
      </div>
    </div>
  );
}
