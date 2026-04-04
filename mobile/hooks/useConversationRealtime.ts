import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { AgentMessage } from '@/lib/api';

export function useConversationRealtime(conversationId: string | null) {
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const conversationIdRef = useRef<string | null>(conversationId);
  conversationIdRef.current = conversationId;

  function subscribe(convId: string) {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`agent-messages-${convId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${convId}`,
        },
        (payload) => {
          const raw = payload.new as Record<string, unknown>;
          const newMsg: AgentMessage = {
            id: raw.id as string,
            conversation_id: raw.conversation_id as string,
            role: raw.role as 'user' | 'assistant' | 'system',
            content: raw.content as string,
            metadata: raw.metadata as Record<string, unknown> | null,
            created_at: raw.created_at as string,
          };

          queryClient.setQueryData<AgentMessage[]>(
            ['messages', convId],
            (prev) => {
              if (!prev) return [newMsg];
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            },
          );
        },
      )
      .subscribe();

    channelRef.current = channel;
  }

  useEffect(() => {
    if (!conversationId) return;
    subscribe(conversationId);
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Re-subscribe on foreground
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active' && conversationIdRef.current) {
        subscribe(conversationIdRef.current);
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
