import { useState } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ConversationRow } from '@/components/ConversationRow';
import { EmptyState } from '@/components/EmptyState';
import { getAgentConversations } from '@/lib/api';
import type { HandoffStatus } from '@/lib/api';

const TABS: { status: HandoffStatus; label: string }[] = [
  { status: 'pending', label: 'Pending' },
  { status: 'active', label: 'Active' },
  { status: 'resolved', label: 'Resolved' },
];

export default function ConversationsScreen() {
  const { chatbotId } = useLocalSearchParams<{ chatbotId: string }>();
  const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = useState<HandoffStatus>('pending');

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ['conversations', chatbotId, activeStatus],
    queryFn: () => getAgentConversations(chatbotId, activeStatus),
    staleTime: 30_000,
    enabled: !!chatbotId,
  });

  const conversations = data?.conversations ?? [];
  const stats = data?.stats ?? { pending: 0, active: 0, resolved: 0 };

  return (
    <View className="flex-1 bg-white">
      {/* Filter tabs */}
      <View className="flex-row border-b border-gray-100 px-4">
        {TABS.map((tab) => {
          const count = stats[tab.status];
          const isActive = activeStatus === tab.status;
          return (
            <Pressable
              key={tab.status}
              onPress={() => setActiveStatus(tab.status)}
              className={`flex-row items-center mr-5 py-3 ${
                isActive ? 'border-b-2 border-primary-500' : ''
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </Text>
              {count > 0 && (
                <View
                  className={`ml-1.5 rounded-full min-w-[18px] h-[18px] items-center justify-center px-0.5 ${
                    tab.status === 'pending'
                      ? 'bg-orange-500'
                      : tab.status === 'active'
                      ? 'bg-blue-500'
                      : 'bg-green-500'
                  }`}
                >
                  <Text className="text-white text-[10px] font-bold">{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.conversation_id}
          renderItem={({ item }) => (
            <ConversationRow
              conversation={item}
              onPress={() =>
                router.push(
                  `/conversation/${item.conversation_id}?chatbotId=${chatbotId}`,
                )
              }
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={() =>
                queryClient.invalidateQueries({
                  queryKey: ['conversations', chatbotId, activeStatus],
                })
              }
              tintColor="#6366f1"
            />
          }
          ListEmptyComponent={
            <EmptyState
              title={`No ${activeStatus} conversations`}
              subtitle={
                activeStatus === 'pending'
                  ? 'Handoff requests will appear here'
                  : activeStatus === 'active'
                  ? 'Active conversations will appear here'
                  : 'Resolved conversations will appear here'
              }
            />
          }
          contentContainerStyle={conversations.length === 0 ? { flex: 1 } : undefined}
        />
      )}
    </View>
  );
}
