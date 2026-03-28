'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bot, AlertTriangle } from 'lucide-react';
import { ChatbotSubNav } from '@/components/chatbots/ChatbotSubNav';
import { ChatbotProvider, useChatbot } from '@/components/chatbots/ChatbotContext';

interface ChatbotLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function ChatbotLayout({ children, params }: ChatbotLayoutProps) {
  const { id } = use(params);

  return (
    <ChatbotProvider chatbotId={id}>
      <ChatbotLayoutInner chatbotId={id}>
        {children}
      </ChatbotLayoutInner>
    </ChatbotProvider>
  );
}

function ChatbotLayoutInner({ chatbotId, children }: { chatbotId: string; children: React.ReactNode }) {
  const { chatbot, needsReembed } = useChatbot();
  const chatbotName = chatbot?.name ?? null;

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
      <ChatbotSubNav chatbotId={chatbotId} />

      {/* Re-embed warning banner */}
      {needsReembed && (
        <div className="rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-amber-800 dark:text-amber-200">
            Your knowledge base needs re-processing. Your chatbot may give incorrect answers until this is fixed.
          </p>
          <Link
            href={`/dashboard/chatbots/${chatbotId}/knowledge`}
            className="text-sm font-semibold text-amber-700 dark:text-amber-300 hover:underline whitespace-nowrap flex-shrink-0"
          >
            Fix now &rarr;
          </Link>
        </div>
      )}

      {/* Page content */}
      {children}
    </div>
  );
}
