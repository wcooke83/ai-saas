import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useChatbotsStore, useChatbotIds } from '@/stores/chatbots';

export function useRealtimeManager() {
  const queryClient = useQueryClient();
  const chatbotIds = useChatbotIds();
  const { updatePendingCount } = useChatbotsStore();
  const channelsRef = useRef<RealtimeChannel[]>([]);
  const chatbotIdsRef = useRef<string[]>(chatbotIds);

  // Keep ref up to date
  chatbotIdsRef.current = chatbotIds;

  function subscribe(ids: string[]) {
    // Clean up first
    channelsRef.current.forEach((ch) => supabase.removeChannel(ch));
    channelsRef.current = [];

    ids.forEach((chatbotId) => {
      const channel = supabase
        .channel(`agent-handoffs-${chatbotId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'telegram_handoff_sessions',
            filter: `chatbot_id=eq.${chatbotId}`,
          },
          () => {
            // Invalidate conversation list queries for this chatbot
            queryClient.invalidateQueries({ queryKey: ['conversations', chatbotId] });

            // Re-fetch stats and update pending count
            queryClient
              .fetchQuery<{ stats: { pending: number } }>({
                queryKey: ['conversations', chatbotId, 'pending'],
                staleTime: 0,
              })
              .then((data) => {
                if (data?.stats) {
                  updatePendingCount(chatbotId, data.stats.pending);
                }
              })
              .catch(() => {
                // Invalidation is sufficient; pending count will update on next fetch
              });
          },
        )
        .subscribe();

      channelsRef.current.push(channel);
    });
  }

  // Subscribe on mount / chatbotIds change
  useEffect(() => {
    if (chatbotIds.length === 0) return;
    subscribe(chatbotIds);
    return () => {
      channelsRef.current.forEach((ch) => supabase.removeChannel(ch));
      channelsRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbotIds.join(',')]);

  // Re-subscribe when app returns to foreground (WebSocket may have died)
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        subscribe(chatbotIdsRef.current);
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
