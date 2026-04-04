import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Session } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  session: Session | null;
  agentName: string;
  setSession: (session: Session | null) => void;
  setAgentName: (name: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      agentName: '',
      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
        }),
      setAgentName: (agentName) => set({ agentName }),
      clear: () => set({ user: null, session: null, agentName: '' }),
    }),
    {
      name: 'vocui-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        agentName: state.agentName,
        // session is managed by supabase AsyncStorage adapter — don't double-persist
      }),
    },
  ),
);
