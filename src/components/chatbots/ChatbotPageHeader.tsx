'use client';

import { Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { H1 } from '@/components/ui/heading';
import { useChatbot } from '@/components/chatbots/ChatbotContext';
import type { ReactNode } from 'react';

const statusColors: Record<string, string> = {
  draft: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  archived: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

interface ChatbotPageHeaderProps {
  chatbotId: string;
  title: string;
  badges?: ReactNode;
  actions?: ReactNode;
}

export function ChatbotPageHeader({ title, badges, actions }: ChatbotPageHeaderProps) {
  const { chatbot, loading } = useChatbot();

  if (loading && !chatbot) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-24 mt-2" />
        </div>
      </div>
    );
  }

  const name = chatbot?.name ?? '';
  const status = chatbot?.status ?? 'draft';
  const isPublished = chatbot?.is_published ?? false;
  const logoUrl = chatbot?.logo_url ?? null;

  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          )}
          <div>
            <H1 variant="dashboard">{title}</H1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColors[status] || statusColors.draft}>
                {status}
              </Badge>
              {isPublished && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                  Published
                </Badge>
              )}
              {badges}
            </div>
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
