'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Hash, Clock, MessageSquare, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  thumbs_up?: boolean | null;
}

interface Conversation {
  id: string;
  session_id: string;
  channel: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

interface ConversationDetailDialogProps {
  conversation: Conversation | null;
  chatbotId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function ConversationDetailDialog({
  conversation,
  chatbotId,
  open,
  onOpenChange,
}: ConversationDetailDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && conversation) {
      fetchMessages();
    }
  }, [open, conversation]);

  async function fetchMessages() {
    if (!conversation) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/chatbots/${chatbotId}/conversations?conversationId=${conversation.id}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      const data = await response.json();
      setMessages(data.data?.messages || []);
    } catch (err) {
      toast.error('Failed to load conversation messages');
    } finally {
      setLoading(false);
    }
  }

  if (!open || !conversation) return null;

  const messageCount = messages.length;
  const userMessages = messages.filter(m => m.role === 'user').length;
  const assistantMessages = messages.filter(m => m.role === 'assistant').length;
  const ratedMessages = messages.filter(m => m.thumbs_up !== null && m.thumbs_up !== undefined);
  const positiveRatings = ratedMessages.filter(m => m.thumbs_up).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Conversation
              </DialogTitle>
              <DialogDescription className="mt-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="font-mono text-xs">
                    {conversation.session_id.slice(0, 16)}...
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {conversation.channel}
                  </Badge>
                  <span className="text-xs text-secondary-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(conversation.updated_at)}
                  </span>
                </div>
              </DialogDescription>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-secondary-500">Messages:</span>
              <span className="font-medium">{messageCount}</span>
              <span className="text-secondary-400">
                ({userMessages} user, {assistantMessages} assistant)
              </span>
            </div>
            {ratedMessages.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-secondary-500">Rating:</span>
                <span className="font-medium text-green-600">
                  {positiveRatings}/{ratedMessages.length} positive
                </span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-secondary-50/50 dark:bg-secondary-900/50">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="flex-1 h-20 rounded-lg" />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-500">No messages in this conversation</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isUser = message.role === 'user';
              const showDate = index === 0 || 
                new Date(message.created_at).toDateString() !== 
                new Date(messages[index - 1].created_at).toDateString();

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-secondary-500 bg-secondary-100 dark:bg-secondary-800 px-3 py-1 rounded-full">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isUser
                            ? 'bg-primary-600 text-white'
                            : 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 shadow-sm border border-secondary-200 dark:border-secondary-700'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 mt-1 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span className={isUser ? 'text-primary-400' : 'text-secondary-500'}>
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.thumbs_up !== null && message.thumbs_up !== undefined && (
                          <span className={message.thumbs_up ? 'text-green-500' : 'text-red-500'}>
                            {message.thumbs_up ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900">
          <div className="flex items-center justify-between text-xs text-secondary-500">
            <div className="flex items-center gap-4">
              <span>Started: {formatDate(conversation.created_at)}</span>
              <span>Last updated: {formatDate(conversation.updated_at)}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-1" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
