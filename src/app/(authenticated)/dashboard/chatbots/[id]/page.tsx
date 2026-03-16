'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  Users,
  ThumbsUp,
  Database,
  Palette,
  BarChart3,
  Code,
  Play,
  Pause,
  Loader2,
  Settings,
  Inbox,
  ClipboardList,
  Brain,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionCard } from '@/components/ui/action-card';
import type { Chatbot } from '@/lib/chatbots/types';

interface ChatbotDetailProps {
  params: Promise<{ id: string }>;
}

export default function ChatbotDetailPage({ params }: ChatbotDetailProps) {
  const { id } = use(params);
  const router = useRouter();
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [stats, setStats] = useState({
    conversations: 0,
    messages: 0,
    satisfaction: 0,
  });
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChatbot() {
      try {
        const response = await fetch(`/api/chatbots/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/dashboard/chatbots');
            return;
          }
          throw new Error('Failed to fetch chatbot');
        }
        const data = await response.json();
        setChatbot(data.data.chatbot);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchChatbot();
  }, [id, router]);

  const handlePublish = async () => {
    if (!chatbot) return;
    setPublishing(true);

    try {
      const response = await fetch(`/api/chatbots/${id}/publish`, {
        method: chatbot.is_published ? 'DELETE' : 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to update publish status');
      }

      const data = await response.json();
      setChatbot(data.data.chatbot);
      toast.success(data.data.chatbot.is_published ? 'Chatbot published' : 'Chatbot unpublished');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update publish status');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !chatbot) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{error || 'Chatbot not found'}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/dashboard/chatbots">Back to Chatbots</Link>
        </Button>
      </div>
    );
  }

  const statusColors = {
    draft: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    archived: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  };

  const quickActions = [
    {
      href: `/dashboard/chatbots/${id}/settings`,
      icon: Settings,
      label: 'Settings',
      description: 'Edit chatbot config',
    },
    {
      href: `/dashboard/chatbots/${id}/knowledge`,
      icon: Database,
      label: 'Knowledge Base',
      description: 'Train your chatbot',
    },
    {
      href: `/dashboard/chatbots/${id}/customize`,
      icon: Palette,
      label: 'Customize Widget',
      description: 'Style and branding',
    },
    {
      href: `/dashboard/chatbots/${id}/analytics`,
      icon: BarChart3,
      label: 'Analytics',
      description: 'View performance',
    },
    {
      href: `/dashboard/chatbots/${id}/leads`,
      icon: Inbox,
      label: 'Leads & Chat',
      description: 'View conversations',
    },
    {
      href: `/dashboard/chatbots/${id}/surveys`,
      icon: ClipboardList,
      label: 'Surveys',
      description: 'View survey results',
    },
    {
      href: `/dashboard/chatbots/${id}/sentiment`,
      icon: Brain,
      label: 'Sentiment & Loyalty',
      description: 'Analyze outcomes',
    },
    {
      href: `/dashboard/chatbots/${id}/deploy`,
      icon: Code,
      label: 'Deploy',
      description: 'Get embed code',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/chatbots"
            className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Chatbots
          </Link>
          <div className="flex items-center gap-4">
            {chatbot.logo_url ? (
              <img
                src={chatbot.logo_url}
                alt={chatbot.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {chatbot.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={statusColors[chatbot.status]}>
                  {chatbot.status}
                </Badge>
                {chatbot.is_published && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    Published
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/chatbots/${id}/customize`}>
              <Palette className="w-4 h-4 mr-2" />
              Customize
            </Link>
          </Button>
          <Button
            onClick={handlePublish}
            disabled={publishing}
            variant={chatbot.is_published ? 'outline' : 'default'}
          >
            {publishing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : chatbot.is_published ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {chatbot.is_published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {stats.conversations}
                </p>
                <p className="text-sm text-secondary-500">Conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {stats.messages}
                </p>
                <p className="text-sm text-secondary-500">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {stats.satisfaction}%
                </p>
                <p className="text-sm text-secondary-500">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {chatbot.messages_this_month}
                </p>
                <p className="text-sm text-secondary-500">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <ActionCard
            key={action.href}
            href={action.href}
            icon={action.icon}
            title={action.label}
            description={action.description}
          />
        ))}
      </div>

      {/* Description */}
      {chatbot.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-600 dark:text-secondary-400">
              {chatbot.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* System Prompt Preview */}
      <Card>
        <CardHeader>
          <CardTitle>System Prompt</CardTitle>
          <CardDescription>
            How your chatbot is configured to behave
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg text-sm text-secondary-700 dark:text-secondary-300 whitespace-pre-wrap overflow-auto max-h-96">
            {chatbot.system_prompt}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
