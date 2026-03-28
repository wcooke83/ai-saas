'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Bot, MessageSquare, Users, MoreVertical, Palette, Trash2, Eye, ExternalLink, Headphones, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfirmDialog } from '@/components/ui/confirm-dialog';
import { getClient } from '@/lib/supabase/client';
import { H1 } from '@/components/ui/heading';
import type { ChatbotWithStats } from '@/lib/chatbots/types';

export default function ChatbotsPage() {
  const [chatbots, setChatbots] = useState<ChatbotWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { confirm: confirmDelete, ConfirmDialog: DeleteConfirmDialog } = useConfirmDialog({
    title: 'Delete Chatbot',
    description: 'This will permanently delete this chatbot, its knowledge sources, conversations, and settings. This cannot be undone.',
    confirmText: 'Delete',
    variant: 'danger',
  });

  useEffect(() => {
    async function fetchChatbots() {
      try {
        const response = await fetch('/api/chatbots');
        if (!response.ok) {
          throw new Error('Failed to fetch chatbots');
        }
        const data = await response.json();
        setChatbots(data.data.chatbots);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchChatbots();
  }, []);

  // Subscribe to Supabase Realtime Presence for each chatbot's agent count.
  // Agents track presence on `agent-presence:${chatbotId}` channels; when they
  // disconnect (close tab, network loss), Supabase removes them automatically.
  useEffect(() => {
    if (chatbots.length === 0) return;

    const supabase = getClient() as any;
    const channels: ReturnType<typeof supabase.channel>[] = [];

    for (const chatbot of chatbots) {
      const channel = supabase.channel(`agent-presence:${chatbot.id}`);

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          let count = 0;
          for (const key of Object.keys(state)) {
            count += (state[key] as unknown[]).length;
          }
          setChatbots(prev => prev.map(c =>
            c.id === chatbot.id ? { ...c, agents_online: count } : c
          ));
        })
        .subscribe();

      channels.push(channel);
    }

    return () => {
      for (const ch of channels) {
        supabase.removeChannel(ch);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbots.length > 0]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete chatbot');
      }

      setChatbots(chatbots.filter(c => c.id !== id));
      toast.success('Chatbot deleted successfully.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete chatbot');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <H1 variant="dashboard">Chatbots</H1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Create and manage your AI chatbots
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/chatbots/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Chatbot
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {chatbots.length === 0 && (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              No chatbots yet
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md">
              Create your first AI chatbot to start engaging with your customers.
              Train it with your knowledge base and deploy it on your website, Slack, or Telegram.
            </p>
            <Button asChild>
              <Link href="/dashboard/chatbots/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Chatbot
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chatbot grid */}
      {chatbots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <ChatbotCard
              key={chatbot.id}
              chatbot={chatbot}
              onDelete={() => handleDelete(chatbot.id)}
            />
          ))}
        </div>
      )}
      <DeleteConfirmDialog />
    </div>
  );
}

interface ChatbotCardProps {
  chatbot: ChatbotWithStats;
  onDelete: () => void;
}

function ChatbotCard({ chatbot, onDelete }: ChatbotCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusColors = {
    draft: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    archived: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  };

  return (
    <Card className="relative group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {chatbot.logo_url ? (
              <img
                src={chatbot.logo_url}
                alt={chatbot.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{chatbot.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={statusColors[chatbot.status]}>
                  {chatbot.status}
                </Badge>
                {(chatbot as any).needs_reembed && (
                  <Link
                    href={`/dashboard/chatbots/${chatbot.id}/knowledge`}
                    onClick={e => e.stopPropagation()}
                  >
                    <Badge
                      className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-800/60 transition-colors"
                      title="Knowledge base needs re-processing — click to fix"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Needs Update
                    </Badge>
                  </Link>
                )}
                {(chatbot as any).live_handoff_config?.enabled && (
                  <span className={`inline-flex items-center gap-1 text-xs ${
                    (chatbot.agents_online ?? 0) > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-secondary-400 dark:text-secondary-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      (chatbot.agents_online ?? 0) > 0
                        ? 'bg-green-500'
                        : 'bg-secondary-300 dark:bg-secondary-600'
                    }`} />
                    {(chatbot.agents_online ?? 0) > 0
                      ? `${chatbot.agents_online} online`
                      : 'No agents'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              aria-label="Chatbot actions"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <MoreVertical className="w-5 h-5 text-secondary-500" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  role="menu"
                  aria-label="Chatbot actions"
                  className="absolute right-0 mt-1 w-48 rounded-lg shadow-lg border z-20"
                  style={{ backgroundColor: 'rgb(var(--modal-bg))', borderColor: 'rgb(var(--modal-border))' }}
                >
                  <Link
                    role="menuitem"
                    href={`/dashboard/chatbots/${chatbot.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                  <Link
                    role="menuitem"
                    href={`/dashboard/chatbots/${chatbot.id}/customize`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Palette className="w-4 h-4" />
                    Customize
                  </Link>
                  <Link
                    role="menuitem"
                    href={`/dashboard/chatbots/${chatbot.id}/conversations`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Headphones className="w-4 h-4" />
                    Agent Console
                  </Link>
                  {chatbot.is_published && (
                    <a
                      role="menuitem"
                      href={`/widget/${chatbot.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Preview Widget
                    </a>
                  )}
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chatbot.description && (
          <CardDescription className="mb-4 line-clamp-2">
            {chatbot.description}
          </CardDescription>
        )}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-secondary-400" />
            <div>
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                {chatbot.total_conversations ?? 0}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-secondary-400" />
            <div>
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                {chatbot.total_messages ?? 0}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Messages</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <Link
            href={`/dashboard/chatbots/${chatbot.id}`}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Manage chatbot →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
