import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatbotEntry {
  id: string;
  name: string;
  isOwner: boolean;
  can_handle_conversations: boolean;
  can_modify_settings: boolean;
  can_manage_knowledge: boolean;
  can_view_analytics: boolean;
}

interface ChatbotsStore {
  chatbots: ChatbotEntry[];
  pendingCounts: Record<string, number>;
  setChatbots: (entries: ChatbotEntry[]) => void;
  updatePendingCount: (chatbotId: string, count: number) => void;
  getPermissions: (chatbotId: string) => ChatbotEntry | undefined;
}

export const useChatbotsStore = create<ChatbotsStore>()(
  persist(
    (set, get) => ({
      chatbots: [],
      pendingCounts: {},
      setChatbots: (entries) => set({ chatbots: entries }),
      updatePendingCount: (chatbotId, count) =>
        set((state) => ({
          pendingCounts: { ...state.pendingCounts, [chatbotId]: count },
        })),
      getPermissions: (chatbotId) =>
        get().chatbots.find((c) => c.id === chatbotId),
    }),
    {
      name: 'vocui-chatbots',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        chatbots: state.chatbots,
        pendingCounts: state.pendingCounts,
      }),
    },
  ),
);

/**
 * Backward-compat selector for hooks that previously destructured `chatbotIds`.
 * Usage: const chatbotIds = useChatbotIds();
 */
export function useChatbotIds(): string[] {
  return useChatbotsStore((s) => s.chatbots.map((c) => c.id));
}
