import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationsStore {
  expoPushToken: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set) => ({
      expoPushToken: null,
      setToken: (token) => set({ expoPushToken: token }),
      clearToken: () => set({ expoPushToken: null }),
    }),
    {
      name: 'vocui-notifications',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
