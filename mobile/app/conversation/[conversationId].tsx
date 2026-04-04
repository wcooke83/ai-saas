import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { MessageBubble } from '@/components/MessageBubble';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { useConversationRealtime } from '@/hooks/useConversationRealtime';
import { useAuthStore } from '@/stores/auth';
import {
  getAgentConversations,
  getConversationMessages,
  sendAgentReply,
  sendAgentAction,
} from '@/lib/api';
import type { AgentConversation, AgentMessage } from '@/lib/api';

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { conversationId, chatbotId } = useLocalSearchParams<{
    conversationId: string;
    chatbotId: string;
  }>();
  const { agentName, user } = useAuthStore();
  const resolvedAgentName = agentName || (user?.email?.split('@')[0] ?? 'Agent');

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState<'take_over' | 'resolve' | 'return_to_ai' | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Fetch conversation metadata from list query cache or refetch
  const { data: conversationData } = useQuery({
    queryKey: ['conversation-detail', chatbotId, conversationId],
    queryFn: async () => {
      // Try all statuses to find this conversation
      for (const status of ['pending', 'active', 'resolved'] as const) {
        const result = await getAgentConversations(chatbotId, status, 50);
        const found = result.conversations.find(
          (c) => c.conversation_id === conversationId,
        );
        if (found) return found;
      }
      return null;
    },
    enabled: !!chatbotId && !!conversationId,
    staleTime: 15_000,
  });

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery<AgentMessage[]>({
    queryKey: ['messages', conversationId],
    queryFn: () => getConversationMessages(chatbotId, conversationId),
    enabled: !!chatbotId && !!conversationId,
    staleTime: 30_000,
  });

  // Realtime new messages
  useConversationRealtime(conversationId ?? null);

  const conversation: AgentConversation | null = conversationData ?? null;
  const isResolved = conversation?.handoff_status === 'resolved';
  const isPending = conversation?.handoff_status === 'pending';
  const isActive = conversation?.handoff_status === 'active';

  const handleAction = useCallback(
    async (action: 'take_over' | 'resolve' | 'return_to_ai') => {
      if (!conversation) return;
      const labels = {
        take_over: 'Take over this conversation?',
        resolve: 'Mark conversation as resolved?',
        return_to_ai: 'Return this conversation to AI?',
      };
      Alert.alert(labels[action], undefined, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: action === 'resolve' ? 'destructive' : 'default',
          onPress: async () => {
            setActionLoading(action);
            try {
              await sendAgentAction(chatbotId, conversationId, action, resolvedAgentName);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              // Invalidate to refresh conversation status
              queryClient.invalidateQueries({
                queryKey: ['conversation-detail', chatbotId, conversationId],
              });
              queryClient.invalidateQueries({
                queryKey: ['conversations', chatbotId],
              });
            } catch {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('Error', `Failed to ${action.replace(/_/g, ' ')}.`);
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]);
    },
    [conversation, chatbotId, conversationId, resolvedAgentName, queryClient],
  );

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || sending || !isActive) return;
    setInput('');
    setSending(true);

    // Optimistic message
    const optimisticMsg: AgentMessage = {
      id: `optimistic-${Date.now()}`,
      conversation_id: conversationId,
      role: 'assistant',
      content,
      metadata: { is_human_agent: true, agent_name: resolvedAgentName },
      created_at: new Date().toISOString(),
    };
    queryClient.setQueryData<AgentMessage[]>(['messages', conversationId], (prev) => [
      ...(prev ?? []),
      optimisticMsg,
    ]);

    try {
      await sendAgentReply(chatbotId, conversationId, content, resolvedAgentName);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Realtime will de-duplicate with the real message; invalidate to reconcile
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    } catch {
      // Rollback optimistic message
      queryClient.setQueryData<AgentMessage[]>(['messages', conversationId], (prev) =>
        (prev ?? []).filter((m) => m.id !== optimisticMsg.id),
      );
      setInput(content);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }, [input, sending, isActive, chatbotId, conversationId, resolvedAgentName, queryClient]);

  const visitorLabel =
    conversation?.visitor_name || conversation?.visitor_email || 'Anonymous Visitor';

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View
        className="border-b border-gray-100 bg-white"
        style={{ paddingTop: insets.top }}
      >
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="mr-3 p-1">
            <Text className="text-primary-500 text-base font-medium">‹ Back</Text>
          </Pressable>
          <View className="flex-1">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                {visitorLabel}
              </Text>
              {conversation && <StatusBadge status={conversation.handoff_status} />}
            </View>
            {conversation?.visitor_email && conversation?.visitor_name && (
              <Text className="text-xs text-gray-500">{conversation.visitor_email}</Text>
            )}
            {conversation?.escalation_reason && (
              <Text className="text-xs text-orange-600 mt-0.5">
                {conversation.escalation_reason === 'need_human_help'
                  ? 'Requested human support'
                  : conversation.escalation_reason === 'wrong_answer'
                  ? 'Reported wrong answer'
                  : conversation.escalation_reason === 'offensive_content'
                  ? 'Reported offensive content'
                  : 'Other issue'}
              </Text>
            )}
          </View>

          {/* Action button */}
          {isPending && (
            <Pressable
              onPress={() => handleAction('take_over')}
              disabled={actionLoading !== null}
              className="bg-primary-500 rounded-xl px-3 py-2 active:bg-primary-600 disabled:opacity-50"
            >
              {actionLoading === 'take_over' ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-sm font-semibold">Take Over</Text>
              )}
            </Pressable>
          )}
          {isActive && (
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handleAction('return_to_ai')}
                disabled={actionLoading !== null}
                className="border border-gray-300 rounded-xl px-3 py-2 active:bg-gray-50 disabled:opacity-50"
              >
                {actionLoading === 'return_to_ai' ? (
                  <ActivityIndicator size="small" color="#6366f1" />
                ) : (
                  <Text className="text-gray-700 text-sm font-medium">AI</Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => handleAction('resolve')}
                disabled={actionLoading !== null}
                className="bg-green-600 rounded-xl px-3 py-2 active:bg-green-700 disabled:opacity-50"
              >
                {actionLoading === 'resolve' ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-sm font-semibold">Resolve</Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* Messages */}
      {messagesLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : messages.length === 0 ? (
        <EmptyState title="No messages yet" subtitle="Messages will appear here" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      {/* Input */}
      {!isResolved && (
        <View
          className="border-t border-gray-100 bg-white px-4 py-3"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          {isPending && (
            <Text className="text-xs text-gray-400 text-center mb-2">
              Take over the conversation to reply
            </Text>
          )}
          <View className="flex-row items-end gap-2">
            <TextInput
              className="flex-1 border border-gray-300 rounded-2xl px-4 py-2.5 text-gray-900 bg-white max-h-28"
              placeholder={isActive ? 'Type a reply...' : 'Take over first...'}
              placeholderTextColor="#9ca3af"
              value={input}
              onChangeText={setInput}
              multiline
              editable={isActive && !sending}
              returnKeyType="default"
              style={{ textAlignVertical: 'top' }}
            />
            <Pressable
              onPress={handleSend}
              disabled={!input.trim() || !isActive || sending}
              className="bg-primary-500 rounded-full w-10 h-10 items-center justify-center active:bg-primary-600 disabled:opacity-40"
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-lg font-bold">↑</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
      {isResolved && (
        <View
          className="px-4 py-4 border-t border-gray-100 bg-gray-50"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          <Text className="text-xs text-gray-500 text-center">
            This conversation has been resolved.
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
