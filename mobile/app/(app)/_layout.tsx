import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useRealtimeManager } from '@/hooks/useRealtimeManager';
import { useChatbotsStore } from '@/stores/chatbots';

function InboxTabIcon({ focused }: { focused: boolean }) {
  const { pendingCounts } = useChatbotsStore();
  const totalPending = Object.values(pendingCounts).reduce((a, b) => a + b, 0);

  return (
    <View className="items-center justify-center">
      <View
        className={`w-6 h-6 items-center justify-center ${focused ? 'opacity-100' : 'opacity-50'}`}
      >
        <Text className="text-xl">📥</Text>
      </View>
      {totalPending > 0 && (
        <View className="absolute -top-1 -right-2 bg-orange-500 rounded-full min-w-[16px] h-4 items-center justify-center px-0.5">
          <Text className="text-white text-[10px] font-bold">
            {totalPending > 99 ? '99+' : totalPending}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function AppLayout() {
  usePushNotifications();
  useRealtimeManager();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { borderTopColor: '#e5e7eb' },
      }}
    >
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ focused }) => <InboxTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chatbots"
        options={{
          title: 'Chatbots',
          tabBarIcon: ({ focused }) => (
            <Text className={`text-xl ${focused ? 'opacity-100' : 'opacity-50'}`}>🤖</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Text className={`text-xl ${focused ? 'opacity-100' : 'opacity-50'}`}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
}
