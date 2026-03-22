'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot } from 'lucide-react';
import { ChatbotSubNav } from '@/components/chatbots/ChatbotSubNav';

interface ChatbotLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function ChatbotLayout({ children, params }: ChatbotLayoutProps) {
  const { id } = use(params);
  const [chatbotName, setChatbotName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchName() {
      try {
        const response = await fetch(`/api/chatbots/${id}`);
        if (response.ok) {
          const data = await response.json();
          setChatbotName(data.data.chatbot.name);
        }
      } catch {
        // Non-critical, nav still works without name
      }
    }
    fetchName();
  }, [id]);

  return (
    <div className="space-y-0">
      {/* Back link + chatbot name */}
      <div className="flex items-center gap-3 mb-1">
        <Link
          href="/dashboard/chatbots"
          className="inline-flex items-center text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Chatbots
        </Link>
        {chatbotName && (
          <>
            <span className="text-secondary-300 dark:text-secondary-600">/</span>
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" />
              {chatbotName}
            </span>
          </>
        )}
      </div>

      {/* Shared sub-navigation */}
      <ChatbotSubNav chatbotId={id} />

      {/* Page content */}
      {children}
    </div>
  );
}
