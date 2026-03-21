'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, User, MessageSquare } from 'lucide-react';
import type { AgentConversation, ConversationStats, HandoffStatus } from './useAgentConsole';

interface AgentConversationListProps {
  conversations: AgentConversation[];
  stats: ConversationStats;
  selectedId: string | null;
  loading: boolean;
  filter: HandoffStatus | 'all';
  onSelect: (conversationId: string) => void;
  onFilterChange: (filter: HandoffStatus | 'all') => void;
}

const STATUS_COLORS: Record<HandoffStatus, string> = {
  pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AgentConversationList({
  conversations,
  stats,
  selectedId,
  loading,
  filter,
  onSelect,
  onFilterChange,
}: AgentConversationListProps) {
  const filters: Array<{ label: string; value: HandoffStatus | 'all'; count?: number }> = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending', count: stats.pending },
    { label: 'Active', value: 'active', count: stats.active },
    { label: 'Resolved', value: 'resolved', count: stats.resolved },
  ];

  return (
    <div className="flex flex-col h-full border-r border-secondary-200 dark:border-secondary-700">
      {/* Filter tabs */}
      <div className="p-3 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex gap-1 flex-wrap">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFilterChange(f.value)}
              className="text-xs"
            >
              {f.label}
              {f.count !== undefined && f.count > 0 && (
                <span className="ml-1 bg-white/20 rounded-full px-1.5 text-[10px] relative">
                  {f.count}
                  {f.value === 'pending' && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-6 text-center text-secondary-500 dark:text-secondary-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations</p>
            <p className="text-xs mt-1">Handoff requests will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
            {conversations.map((conv) => (
              <button
                key={conv.conversation_id}
                onClick={() => onSelect(conv.conversation_id)}
                className={`w-full text-left p-3 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors ${
                  selectedId === conv.conversation_id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-secondary-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                        {conv.visitor_name || conv.visitor_email || 'Anonymous Visitor'}
                      </span>
                    </div>
                    {conv.last_message && (
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 line-clamp-2">
                        {conv.last_message.is_agent ? `Agent: ` : ''}
                        {conv.last_message.content}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge className={`text-[10px] px-1.5 py-0 ${STATUS_COLORS[conv.handoff_status]}`}>
                      {conv.handoff_status}
                    </Badge>
                    <span className="text-[10px] text-secondary-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {timeAgo(conv.last_message_at || conv.handoff_created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-secondary-400">
                  <span>{conv.message_count} msgs</span>
                  {conv.agent_name && conv.handoff_status === 'active' && (
                    <span>Agent: {conv.agent_name}</span>
                  )}
                  {conv.escalation_reason && conv.handoff_status === 'pending' && (
                    <span className="text-orange-500">
                      {conv.escalation_reason === 'need_human_help' ? 'Needs help' :
                       conv.escalation_reason === 'wrong_answer' ? 'Wrong answer' :
                       conv.escalation_reason === 'offensive_content' ? 'Offensive' : 'Other'}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
