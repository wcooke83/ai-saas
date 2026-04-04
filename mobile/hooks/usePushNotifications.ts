import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useNotificationsStore } from '@/stores/notifications';
import { registerPushToken } from '@/lib/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const { setToken } = useNotificationsStore();
  const responseListenerRef = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      // Request permissions
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') return;

      // Android channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
        });
      }

      // Get token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) return;

      try {
        const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
        if (cancelled) return;
        setToken(token);
        await registerPushToken(token, Platform.OS).catch(() => {
          // Backend endpoint may not exist yet — don't crash
        });
      } catch {
        // Device may not support push (simulator)
      }
    }

    setup();

    // Handle notification taps → deep link to conversation
    responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<string, string> | null;
        if (data?.conversation_id && data?.chatbot_id) {
          router.push(
            `/conversation/${data.conversation_id}?chatbotId=${data.chatbot_id}`,
          );
        }
      },
    );

    return () => {
      cancelled = true;
      responseListenerRef.current?.remove();
    };
  }, [setToken]);
}
