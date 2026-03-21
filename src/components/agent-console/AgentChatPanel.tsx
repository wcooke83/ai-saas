'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Send,
  UserCheck,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  Loader2,
  Bot,
  User,
  Headphones,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AgentMessage, AgentConversation, VisitorPresenceInfo } from './useAgentConsole';

interface AgentChatPanelProps {
  conversation: AgentConversation | null;
  messages: AgentMessage[];
  messagesLoading: boolean;
  sending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  visitorTyping?: boolean;
  visitorPresence?: VisitorPresenceInfo;
  onSendReply: (content: string) => Promise<void>;
  onAction: (conversationId: string, action: 'take_over' | 'resolve' | 'return_to_ai') => Promise<boolean>;
  onTyping?: (isTyping: boolean) => void;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AgentChatPanel({
  conversation,
  messages,
  messagesLoading,
  sending,
  messagesEndRef,
  visitorTyping = false,
  visitorPresence,
  onSendReply,
  onAction,
  onTyping,
}: AgentChatPanelProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!input.trim() || sending || !conversation) return;
    const content = input;
    setInput('');
    onTyping?.(false);
    try {
      await onSendReply(content);
    } catch {
      toast.error('Failed to send message');
      setInput(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAction = async (action: 'take_over' | 'resolve' | 'return_to_ai') => {
    if (!conversation) return;
    const success = await onAction(conversation.conversation_id, action);
    if (success) {
      const labels = { take_over: 'Taken over', resolve: 'Resolved', return_to_ai: 'Returned to AI' };
      toast.success(labels[action]);
    } else {
      toast.error(`Failed to ${action.replace('_', ' ')}`);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-secondary-400 dark:text-secondary-500">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a conversation to view messages</p>
        </div>
      </div>
    );
  }

  const isResolved = conversation.handoff_status === 'resolved';

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
              {conversation.visitor_name || conversation.visitor_email || 'Anonymous Visitor'}
            </h3>
            <Badge
              className={`text-[10px] ${
                conversation.handoff_status === 'pending'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                  : conversation.handoff_status === 'active'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
              }`}
            >
              {conversation.handoff_status}
            </Badge>
          </div>
          {conversation.visitor_email && conversation.visitor_name && (
            <p className="text-xs text-secondary-500">{conversation.visitor_email}</p>
          )}
          {visitorPresence && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  visitorPresence.online ? 'bg-green-500' : 'bg-secondary-400'
                }`}
              />
              <span className="text-[11px] text-secondary-500">
                {visitorPresence.online ? 'Online' : 'Offline'}
              </span>
              {visitorPresence.online && visitorPresence.page_url && (
                <span className="text-[11px] text-secondary-400 truncate max-w-[250px]" title={visitorPresence.page_url}>
                  — {visitorPresence.page_title || visitorPresence.page_url}
                </span>
              )}
            </div>
          )}
          {conversation.escalation_reason && (
            <div className="flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                {conversation.escalation_reason === 'need_human_help' ? 'Requested human support' :
                 conversation.escalation_reason === 'wrong_answer' ? 'Reported wrong answer' :
                 conversation.escalation_reason === 'offensive_content' ? 'Reported offensive content' :
                 'Other issue'}
              </span>
              {conversation.escalation_details && (
                <span className="text-xs text-secondary-500 dark:text-secondary-400 truncate max-w-[200px]">
                  — {conversation.escalation_details}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {conversation.handoff_status === 'pending' && (
            <Button size="sm" onClick={() => handleAction('take_over')}>
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              Take Over
            </Button>
          )}
          {conversation.handoff_status === 'active' && (
            <>
              <Button size="sm" variant="outline" onClick={() => handleAction('return_to_ai')}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Return to AI
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAction('resolve')}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Resolve
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messagesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-3/4" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-secondary-400 py-8">
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAgent = msg.metadata?.is_human_agent === true;
            const isSystem = msg.role === 'system';
            const isBot = msg.role === 'assistant' && !isAgent;
            const isUser = msg.role === 'user';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center">
                  <span className="text-xs text-secondary-400 dark:text-secondary-500 bg-secondary-100 dark:bg-secondary-800 rounded-full px-3 py-1">
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${isUser ? 'justify-start' : 'justify-end'}`}
              >
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-secondary-600 dark:text-secondary-400" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    isUser
                      ? 'bg-secondary-100 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100'
                      : isAgent
                      ? 'bg-primary-500 text-white'
                      : 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100'
                  }`}
                >
                  {(isAgent || isBot) && (
                    <div className="flex items-center gap-1 mb-0.5">
                      {isAgent ? (
                        <Headphones className="w-3 h-3 opacity-70" />
                      ) : (
                        <Bot className="w-3 h-3 opacity-70" />
                      )}
                      <span className="text-[10px] opacity-70">
                        {isAgent
                          ? `${(msg.metadata as any)?.agent_name || 'Agent'} (${(msg.metadata as any)?.source || 'platform'})`
                          : 'AI'}
                      </span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isUser ? 'text-secondary-400' : 'opacity-60'}`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
                {!isUser && isAgent && (
                  <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                {!isUser && isBot && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
            );
          })
        )}
        {visitorTyping && (
          <div className="flex items-center gap-1.5 px-1 py-0.5">
            <span className="text-xs text-secondary-400 dark:text-secondary-500 italic">
              Visitor is typing
            </span>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-secondary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-secondary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-secondary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        )}
        <div ref={messagesEndRef as React.LegacyRef<HTMLDivElement>} />
      </div>

      {/* Reply input */}
      {!isResolved && (
        <div className="p-3 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                onTyping?.(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                conversation.handoff_status === 'pending'
                  ? 'Take over the conversation first...'
                  : 'Type a reply...'
              }
              disabled={conversation.handoff_status === 'pending' || sending}
              className="flex-1 resize-none rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-900 px-3 py-2 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              rows={2}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || conversation.handoff_status === 'pending' || sending}
              size="sm"
              className="self-end"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
