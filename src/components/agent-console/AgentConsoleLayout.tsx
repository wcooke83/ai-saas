'use client';

import { useAgentConsole } from './useAgentConsole';
import { AgentConversationList } from './AgentConversationList';
import { AgentChatPanel } from './AgentChatPanel';

interface AgentConsoleLayoutProps {
  chatbotId: string;
  apiKey?: string;
  authMode: 'session' | 'apikey';
}

export function AgentConsoleLayout({ chatbotId, apiKey, authMode }: AgentConsoleLayoutProps) {
  const {
    conversations,
    stats,
    messages,
    selectedConversationId,
    loading,
    messagesLoading,
    sending,
    filter,
    messagesEndRef,
    visitorTyping,
    visitorPresence,
    setFilter,
    selectConversation,
    sendReply,
    performAction,
    broadcastAgentTyping,
  } = useAgentConsole({ chatbotId, apiKey, authMode });

  const selectedConversation = conversations.find(
    (c) => c.conversation_id === selectedConversationId
  ) || null;

  return (
    <div className="flex h-full bg-white dark:bg-secondary-900 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Sidebar — conversation list */}
      <div className="w-80 flex-shrink-0">
        <AgentConversationList
          conversations={conversations}
          stats={stats}
          selectedId={selectedConversationId}
          loading={loading}
          filter={filter}
          onSelect={selectConversation}
          onFilterChange={setFilter}
        />
      </div>

      {/* Main — chat panel */}
      <AgentChatPanel
        conversation={selectedConversation}
        messages={messages}
        messagesLoading={messagesLoading}
        sending={sending}
        messagesEndRef={messagesEndRef}
        visitorTyping={visitorTyping}
        visitorPresence={visitorPresence}
        onSendReply={sendReply}
        onAction={performAction}
        onTyping={broadcastAgentTyping}
      />
    </div>
  );
}
