'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type HandoffStatus = 'pending' | 'active' | 'resolved';

export interface AgentConversation {
  handoff_id: string;
  conversation_id: string;
  handoff_status: HandoffStatus;
  agent_name: string | null;
  agent_source: string | null;
  handoff_created_at: string;
  resolved_at: string | null;
  visitor_name: string | null;
  visitor_email: string | null;
  message_count: number;
  last_message_at: string | null;
  last_message: {
    content: string;
    role: string;
    is_agent: boolean;
    created_at: string;
  } | null;
  language: string | null;
  escalation_reason: string | null;
  escalation_details: string | null;
}

export interface AgentMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ConversationStats {
  pending: number;
  active: number;
  resolved: number;
}

interface UseAgentConsoleOptions {
  chatbotId: string;
  apiKey?: string; // For embedded mode
  authMode: 'session' | 'apikey';
}

export interface VisitorPresenceInfo {
  online: boolean;
  page_url: string | null;
  page_title: string | null;
}

export function useAgentConsole({ chatbotId, apiKey, authMode }: UseAgentConsoleOptions) {
  const [conversations, setConversations] = useState<AgentConversation[]>([]);
  const [stats, setStats] = useState<ConversationStats>({ pending: 0, active: 0, resolved: 0 });
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [filter, setFilter] = useState<HandoffStatus | 'all'>('all');
  const [sending, setSending] = useState(false);
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [visitorPresence, setVisitorPresence] = useState<VisitorPresenceInfo>({ online: false, page_url: null, page_title: null });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handoffChannelRef = useRef<RealtimeChannel | null>(null);
  const messagesChannelRef = useRef<RealtimeChannel | null>(null);
  const conversationChannelRef = useRef<RealtimeChannel | null>(null);
  const selectedConversationIdRef = useRef<string | null>(null);
  const prevPendingCountRef = useRef<number>(0);
  const visitorTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAgentTypingBroadcastRef = useRef<number>(0);

  // Keep ref in sync for use in Realtime callbacks
  selectedConversationIdRef.current = selectedConversationId;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authMode === 'apikey' && apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const baseUrl = `/api/widget/${chatbotId}`;

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const res = await fetch(`${baseUrl}/agent-conversations?limit=50${statusParam}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.success) {
        setConversations(data.data.conversations);
        setStats(data.data.stats);
        prevPendingCountRef.current = data.data.stats.pending;
      }
    } catch (err) {
      console.error('[AgentConsole] Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [chatbotId, filter, apiKey, authMode]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/conversations?conversationId=${conversationId}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      if (data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (err) {
      console.error('[AgentConsole] Failed to fetch messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  }, [chatbotId, apiKey, authMode]);

  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
    fetchMessages(conversationId);
  }, [fetchMessages]);

  // Send a reply — Realtime subscription will add the message to the list
  const sendReply = useCallback(async (content: string) => {
    if (!selectedConversationId || !content.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${baseUrl}/agent-reply`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          conversation_id: selectedConversationId,
          content: content.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to send reply');
    } catch (err) {
      console.error('[AgentConsole] Failed to send reply:', err);
      throw err;
    } finally {
      setSending(false);
    }
  }, [selectedConversationId, sending, chatbotId, apiKey, authMode]);

  // Perform an action (take_over, resolve, return_to_ai)
  const performAction = useCallback(async (conversationId: string, action: 'take_over' | 'resolve' | 'return_to_ai') => {
    try {
      const res = await fetch(`${baseUrl}/agent-actions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ conversation_id: conversationId, action }),
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);

      // Realtime will pick up the handoff status change; also refresh conversations list
      await fetchConversations();
      return true;
    } catch (err) {
      console.error(`[AgentConsole] Failed to ${action}:`, err);
      return false;
    }
  }, [chatbotId, apiKey, authMode, fetchConversations]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Subscribe to handoff session changes for this chatbot via Supabase Realtime
  useEffect(() => {
    const supabase = getClient();

    const channel = supabase
      .channel(`agent-handoffs-${chatbotId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'telegram_handoff_sessions',
        filter: `chatbot_id=eq.${chatbotId}`,
      }, () => {
        // Re-fetch the full conversation list on any handoff change
        fetchConversations().then(() => {
          // Notify agent when a new pending conversation arrives
          if (stats.pending > prevPendingCountRef.current) {
            try {
              // Play a notification sound using Web Audio API
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              osc.type = 'sine';
              gain.gain.value = 0.15;
              osc.start();
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
              osc.stop(ctx.currentTime + 0.3);
            } catch { /* audio not available */ }

            // Flash the page title
            const originalTitle = document.title;
            document.title = `(${stats.pending + 1}) New handoff request!`;
            setTimeout(() => { document.title = originalTitle; }, 3000);
          }
        });
      })
      .subscribe();

    handoffChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      handoffChannelRef.current = null;
    };
  }, [chatbotId, fetchConversations]);

  // Subscribe to messages for the selected conversation via Supabase Realtime
  useEffect(() => {
    // Clean up previous messages channel
    if (messagesChannelRef.current) {
      const supabase = getClient();
      supabase.removeChannel(messagesChannelRef.current);
      messagesChannelRef.current = null;
    }

    if (!selectedConversationId) return;

    const supabase = getClient();

    const channel = supabase
      .channel(`agent-messages-${selectedConversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversationId}`,
      }, (payload) => {
        const msg = payload.new as Record<string, unknown>;
        const newMessage: AgentMessage = {
          id: msg.id as string,
          conversation_id: msg.conversation_id as string,
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content as string,
          metadata: msg.metadata as Record<string, unknown> | null,
          created_at: msg.created_at as string,
        };

        setMessages(prev => {
          // Deduplicate: skip if we already have this message
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      })
      .subscribe();

    messagesChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      messagesChannelRef.current = null;
    };
  }, [selectedConversationId]);

  // Broadcast agent typing (throttled to 2s)
  const broadcastAgentTyping = useCallback((isTyping: boolean) => {
    const channel = conversationChannelRef.current;
    if (!channel) return;
    const now = Date.now();
    if (isTyping && now - lastAgentTypingBroadcastRef.current < 2000) return;
    lastAgentTypingBroadcastRef.current = now;
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { typing: isTyping, role: 'agent' },
    });
  }, []);

  // Conversation channel: typing indicators + presence for selected conversation
  useEffect(() => {
    // Clean up previous conversation channel
    if (conversationChannelRef.current) {
      const supabase = getClient();
      supabase.removeChannel(conversationChannelRef.current);
      conversationChannelRef.current = null;
    }
    setVisitorTyping(false);
    setVisitorPresence({ online: false, page_url: null, page_title: null });

    if (!selectedConversationId) return;

    const supabase = getClient();

    const channel = supabase.channel(`conversation:${selectedConversationId}`, {
      config: { presence: { key: `agent-${chatbotId}` } },
    });

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload?.role === 'visitor') {
          if (payload.typing) {
            setVisitorTyping(true);
            if (visitorTypingTimeoutRef.current) clearTimeout(visitorTypingTimeoutRef.current);
            visitorTypingTimeoutRef.current = setTimeout(() => setVisitorTyping(false), 3000);
          } else {
            setVisitorTyping(false);
            if (visitorTypingTimeoutRef.current) {
              clearTimeout(visitorTypingTimeoutRef.current);
              visitorTypingTimeoutRef.current = null;
            }
          }
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        let found = false;
        for (const key of Object.keys(state)) {
          const presences = state[key] as Array<Record<string, unknown>>;
          for (const p of presences) {
            if (p.role === 'visitor') {
              setVisitorPresence({
                online: true,
                page_url: (p.page_url as string) || null,
                page_title: (p.page_title as string) || null,
              });
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (!found) {
          setVisitorPresence({ online: false, page_url: null, page_title: null });
        }
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const visitorLeft = (leftPresences as Array<Record<string, unknown>>).some(p => p.role === 'visitor');
        if (visitorLeft) {
          setVisitorPresence({ online: false, page_url: null, page_title: null });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            role: 'agent',
            agent_name: 'Agent',
          });
        }
      });

    conversationChannelRef.current = channel;

    return () => {
      if (visitorTypingTimeoutRef.current) {
        clearTimeout(visitorTypingTimeoutRef.current);
        visitorTypingTimeoutRef.current = null;
      }
      supabase.removeChannel(channel);
      conversationChannelRef.current = null;
    };
  }, [selectedConversationId, chatbotId]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Agent presence heartbeat — lets the widget know agents are available
  useEffect(() => {
    const sendHeartbeat = () => {
      fetch(`${baseUrl}/agent-heartbeat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ agent_name: 'Agent' }),
      }).catch(() => {});
    };

    // Send immediately on mount
    sendHeartbeat();

    // Then every 30 seconds
    const interval = setInterval(sendHeartbeat, 30_000);

    // Clean up on unmount
    const handleUnload = () => {
      navigator.sendBeacon?.(
        `${baseUrl}/agent-heartbeat`,
        new Blob([JSON.stringify({ _method: 'DELETE' })], { type: 'application/json' })
      );
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
      // Best-effort cleanup
      fetch(`${baseUrl}/agent-heartbeat`, { method: 'DELETE', headers }).catch(() => {});
    };
  }, [chatbotId]);

  return {
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
    fetchConversations,
    broadcastAgentTyping,
  };
}
