import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConversationRow } from '@/components/ConversationRow';
import { EmptyState } from '@/components/EmptyState';
import { useChatbotIds } from '@/stores/chatbots';
import { getAgentConversations } from '@/lib/api';
import type { AgentConversation } from '@/lib/api';

interface InboxItem extends AgentConversation {
  chatbotId: string;
}

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const chatbotIds = useChatbotIds();

  const results = useQueries({
    queries: chatbotIds.map((chatbotId) => ({
      queryKey: ['conversations', chatbotId, 'pending'],
      queryFn: () => getAgentConversations(chatbotId, 'pending', 50),
      staleTime: 30_000,
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isRefetching = results.some((r) => r.isRefetching);

  const items: InboxItem[] = results.flatMap((r, i) => {
    const chatbotId = chatbotIds[i];
    return (r.data?.conversations ?? []).map((conv) => ({ ...conv, chatbotId }));
  });

  // Sort newest first
  items.sort((a, b) => {
    const aTime = a.last_message_at || a.handoff_created_at;
    const bTime = b.last_message_at || b.handoff_created_at;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  function handleRefresh() {
    chatbotIds.forEach((chatbotId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', chatbotId, 'pending'] });
    });
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Inbox</Text>
        <Text className="text-sm text-gray-500 mt-0.5">
          {items.length > 0 ? `${items.length} pending` : 'All caught up'}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => `${item.chatbotId}-${item.conversation_id}`}
          renderItem={({ item }) => (
            <ConversationRow
              conversation={item}
              chatbotName={item.chatbotId}
              onPress={() =>
                router.push(
                  `/conversation/${item.conversation_id}?chatbotId=${item.chatbotId}`,
                )
              }
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={handleRefresh}
              tintColor="#6366f1"
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No pending conversations"
              subtitle="New handoff requests will appear here"
              icon={<Text style={{ fontSize: 40 }}>✓</Text>}
            />
          }
          contentContainerStyle={items.length === 0 ? { flex: 1 } : undefined}
        />
      )}
    </View>
  );
}
