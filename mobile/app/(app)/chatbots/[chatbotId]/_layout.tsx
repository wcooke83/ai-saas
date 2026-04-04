import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Slot, useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatbotsStore } from '@/stores/chatbots';
import { EmptyState } from '@/components/EmptyState';

const ALL_TABS = [
  { key: 'conversations', label: 'Conversations', path: 'conversations', permissionKey: null },
  { key: 'knowledge',     label: 'Knowledge',     path: 'knowledge',     permissionKey: 'can_manage_knowledge' },
  { key: 'analytics',     label: 'Analytics',     path: 'analytics',     permissionKey: 'can_view_analytics' },
  { key: 'settings',      label: 'Settings',      path: 'settings',      permissionKey: 'can_modify_settings' },
] as const;

type TabKey = typeof ALL_TABS[number]['key'];
type PermissionKey = Exclude<typeof ALL_TABS[number]['permissionKey'], null>;

export default function ChatbotLayout() {
  const insets = useSafeAreaInsets();
  const { chatbotId } = useLocalSearchParams<{ chatbotId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('conversations');

  const { getPermissions } = useChatbotsStore();
  const entry = getPermissions(chatbotId);
  const isOwner = entry?.isOwner ?? false;

  function isTabPermitted(permissionKey: PermissionKey | null): boolean {
    if (permissionKey === null) return true; // conversations: always
    if (isOwner) return true;
    if (!entry) return false;
    return entry[permissionKey];
  }

  function navigateTab(tab: typeof ALL_TABS[number]) {
    setActiveTab(tab.key);
    router.push(`/(app)/chatbots/${chatbotId}/${tab.path}`);
  }

  const activeTabDef = ALL_TABS.find((t) => t.key === activeTab);
  const activeTabBlocked =
    activeTabDef && !isTabPermitted(activeTabDef.permissionKey);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-100 flex-row items-center">
        <Pressable onPress={() => router.back()} className="mr-3 p-1">
          <Text className="text-primary-500 text-base">‹ Back</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900 flex-1" numberOfLines={1}>
          Chatbot
        </Text>
      </View>

      {/* Top tab bar — all tabs always rendered */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-100"
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {ALL_TABS.map((tab) => {
          const permitted = isTabPermitted(tab.permissionKey);
          return (
            <Pressable
              key={tab.key}
              onPress={() => navigateTab(tab)}
              className={`px-4 py-3 mr-1 ${
                activeTab === tab.key ? 'border-b-2 border-primary-500' : ''
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  activeTab === tab.key
                    ? 'text-primary-600'
                    : permitted
                    ? 'text-gray-500'
                    : 'text-gray-300'
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {activeTabBlocked ? (
        <EmptyState
          title="Permission required"
          subtitle="You don't have permission to view this section."
          icon={<Text style={{ fontSize: 40 }}>🔒</Text>}
        />
      ) : (
        <Slot />
      )}
    </View>
  );
}
