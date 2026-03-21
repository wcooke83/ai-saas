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
import {
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Escalation, EscalationReason, EscalationStatus } from '@/lib/chatbots/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  thumbs_up?: boolean | null;
}

interface EscalationDetailDialogProps {
  escalation: Escalation | null;
  chatbotId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: () => void;
}

const REASON_LABELS: Record<EscalationReason, string> = {
  wrong_answer: 'Wrong Answer',
  offensive_content: 'Offensive Content',
  need_human_help: 'Need Human Help',
  other: 'Other',
};

const REASON_COLORS: Record<EscalationReason, string> = {
  wrong_answer: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  offensive_content: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  need_human_help: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  other: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300',
};

const STATUS_COLORS: Record<EscalationStatus, string> = {
  open: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  acknowledged: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
};

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

export function EscalationDetailDialog({
  escalation,
  chatbotId,
  open,
  onOpenChange,
  onStatusChange,
}: EscalationDetailDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<EscalationStatus | null>(null);
  const [currentStatus, setCurrentStatus] = useState<EscalationStatus | null>(null);

  useEffect(() => {
    if (open && escalation) {
      setCurrentStatus(escalation.status);
      if (escalation.conversation_id) {
        fetchMessages();
      } else {
        setMessages([]);
      }
    }
  }, [open, escalation]);

  async function fetchMessages() {
    if (!escalation?.conversation_id) return;

    setLoadingMessages(true);
    try {
      const response = await fetch(
        `/api/chatbots/${chatbotId}/conversations?conversationId=${escalation.conversation_id}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      const data = await response.json();
      setMessages(data.data?.messages || []);
    } catch (err) {
      toast.error('Failed to load conversation messages');
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleUpdateStatus(newStatus: EscalationStatus) {
    if (!escalation) return;

    setUpdatingStatus(newStatus);
    try {
      const response = await fetch(
        `/api/chatbots/${chatbotId}/escalations/${escalation.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update escalation status');
      }

      setCurrentStatus(newStatus);
      toast.success(`Escalation marked as ${newStatus}`);
      onStatusChange();
    } catch (err) {
      toast.error('Failed to update escalation status');
    } finally {
      setUpdatingStatus(null);
    }
  }

  if (!open || !escalation) return null;

  const status = currentStatus || escalation.status;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                Escalation Details
              </DialogTitle>
              <DialogDescription className="mt-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={REASON_COLORS[escalation.reason]}>
                    {REASON_LABELS[escalation.reason] || escalation.reason}
                  </Badge>
                  <Badge className={STATUS_COLORS[status]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                  <span className="text-xs text-secondary-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(escalation.created_at)}
                  </span>
                </div>
              </DialogDescription>
            </div>
          </div>

          {/* Details */}
          {escalation.details && (
            <div className="mt-4 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700">
              <p className="text-xs font-medium text-secondary-500 mb-1">Details</p>
              <p className="text-sm text-secondary-900 dark:text-secondary-100">
                {escalation.details}
              </p>
            </div>
          )}

          <div className="flex gap-4 mt-3 text-xs text-secondary-500">
            <span>Created: {formatDate(escalation.created_at)}</span>
            {escalation.updated_at !== escalation.created_at && (
              <span>Updated: {formatDate(escalation.updated_at)}</span>
            )}
          </div>
        </DialogHeader>

        {/* Conversation Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-secondary-50/50 dark:bg-secondary-900/50">
          {!escalation.conversation_id ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-500">No conversation linked to this escalation</p>
            </div>
          ) : loadingMessages ? (
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
              const isHighlighted = escalation.message_id === message.id;
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
                    <div
                      className={`max-w-[85%] ${isHighlighted ? 'border-l-4 border-red-500 pl-3' : ''}`}
                    >
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
                        {isHighlighted && (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 text-[10px] px-1.5 py-0">
                            Escalated
                          </Badge>
                        )}
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

        {/* Footer with actions */}
        <div className="px-6 py-4 border-t border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900">
          <div className="flex items-center justify-between">
            <div className="text-xs text-secondary-500">
              {escalation.session_id && (
                <span>Session: {escalation.session_id.slice(0, 16)}...</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {status === 'open' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/30"
                    onClick={() => handleUpdateStatus('acknowledged')}
                    disabled={updatingStatus !== null}
                  >
                    {updatingStatus === 'acknowledged' ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 mr-1" />
                    )}
                    Acknowledge
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleUpdateStatus('resolved')}
                    disabled={updatingStatus !== null}
                  >
                    {updatingStatus === 'resolved' ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                    )}
                    Resolve
                  </Button>
                </>
              )}
              {status === 'acknowledged' && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleUpdateStatus('resolved')}
                  disabled={updatingStatus !== null}
                >
                  {updatingStatus === 'resolved' ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                  )}
                  Resolve
                </Button>
              )}
              {status === 'resolved' && (
                <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Resolved
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="w-4 h-4 mr-1" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
