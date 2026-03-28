'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Chatbot } from '@/lib/chatbots/types';

interface ChatbotContextType {
  chatbot: Chatbot | null;
  loading: boolean;
  error: string | null;
  needsReembed: boolean;
  setChatbot: (chatbot: Chatbot) => void;
  refreshChatbot: () => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | null>(null);

export function ChatbotProvider({ chatbotId, children }: { chatbotId: string; children: ReactNode }) {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsReembed, setNeedsReembed] = useState(false);

  const fetchChatbot = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/chatbots/${chatbotId}`);
      if (!response.ok) throw new Error('Failed to fetch chatbot');
      const data = await response.json();
      setChatbot(data.data.chatbot);
      setNeedsReembed(data.data.needs_reembed === true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [chatbotId]);

  useEffect(() => {
    fetchChatbot();
  }, [fetchChatbot]);

  return (
    <ChatbotContext.Provider value={{ chatbot, loading, error, needsReembed, setChatbot, refreshChatbot: fetchChatbot }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot(): ChatbotContextType {
  const ctx = useContext(ChatbotContext);
  if (!ctx) throw new Error('useChatbot must be used within a ChatbotProvider');
  return ctx;
}
