import { useEffect } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueries } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getMyAssignments } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useChatbotsStore } from '@/stores/chatbots';
import type { ChatbotEntry } from '@/stores/chatbots';
import { EmptyState } from '@/components/EmptyState';

interface OwnedChatbot {
  id: string;
  name: string;
  created_at: string | null;
}

async function fetchOwnedChatbots(userId: string): Promise<OwnedChatbot[]> {
  const { data, error } = await supabase
    .from('chatbots')
    .select('id, name, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

function mergeEntries(
  owned: OwnedChatbot[],
  assignments: Awaited<ReturnType<typeof getMyAssignments>>['assignments'],
): ChatbotEntry[] {
  const ownerIds = new Set(owned.map((c) => c.id));

  const ownerEntries: ChatbotEntry[] = owned.map((c) => ({
    id: c.id,
    name: c.name,
    isOwner: true,
    can_handle_conversations: true,
    can_modify_settings: true,
    can_manage_knowledge: true,
    can_view_analytics: true,
  }));

  const assignedEntries: ChatbotEntry[] = assignments
    .filter((a) => !ownerIds.has(a.chatbot_id))
    .map((a) => ({
      id: a.chatbot_id,
      name: a.chatbot_name,
      isOwner: false,
      can_handle_conversations: true,
      can_modify_settings: a.can_modify_settings,
      can_manage_knowledge: a.can_manage_knowledge,
      can_view_analytics: a.can_view_analytics,
    }));

  return [...ownerEntries, ...assignedEntries];
}

export default function ChatbotsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { setChatbots, pendingCounts } = useChatbotsStore();

  const [ownedQuery, assignmentsQuery] = useQueries({
    queries: [
      {
        queryKey: ['chatbots', 'owned', user?.id],
        queryFn: () => fetchOwnedChatbots(user!.id),
        enabled: !!user?.id,
        staleTime: 60_000,
      },
      {
        queryKey: ['chatbots', 'assignments'],
        queryFn: getMyAssignments,
        enabled: !!user?.id,
        staleTime: 60_000,
        select: (data: Awaited<ReturnType<typeof getMyAssignments>>) => data.assignments,
      },
    ],
  });

  const isLoading = ownedQuery.isLoading || assignmentsQuery.isLoading;
  const isRefetching =
    (ownedQuery.isRefetching && !ownedQuery.isLoading) ||
    (assignmentsQuery.isRefetching && !assignmentsQuery.isLoading);

  const merged = mergeEntries(
    ownedQuery.data ?? [],
    assignmentsQuery.data ?? [],
  );

  useEffect(() => {
    if (!ownedQuery.isLoading && !assignmentsQuery.isLoading) {
      setChatbots(merged);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownedQuery.data, assignmentsQuery.data]);

  function handleRefresh() {
    ownedQuery.refetch();
    assignmentsQuery.refetch();
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Chatbots</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={merged}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const pending = pendingCounts[item.id] ?? 0;
            return (
              <Pressable
                className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-50"
                onPress={() =>
                  router.push(`/(app)/chatbots/${item.id}/conversations`)
                }
              >
                <View className="flex-1 mr-3">
                  <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                  {item.isOwner ? (
                    <Text className="text-xs text-gray-400 mt-0.5">
                      {item.id.slice(0, 8)}...
                    </Text>
                  ) : (
                    <Text className="text-xs text-gray-400 mt-0.5">Shared by owner</Text>
                  )}
                </View>
                <View className="flex-row items-center gap-3">
                  {!item.isOwner && (
                    <View className="bg-gray-100 rounded px-1.5 py-0.5">
                      <Text className="text-gray-500 text-xs font-medium">Assigned</Text>
                    </View>
                  )}
                  {pending > 0 && (
                    <View className="bg-orange-500 rounded-full min-w-[22px] h-[22px] items-center justify-center px-1">
                      <Text className="text-white text-xs font-bold">{pending}</Text>
                    </View>
                  )}
                  <Text className="text-gray-300 text-lg">›</Text>
                </View>
              </Pressable>
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#6366f1"
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No chatbots yet"
              subtitle="Create a chatbot at vocui.com to get started"
              icon={<Text style={{ fontSize: 40 }}>🤖</Text>}
            />
          }
          contentContainerStyle={merged.length === 0 ? { flex: 1 } : undefined}
        />
      )}
    </View>
  );
}
