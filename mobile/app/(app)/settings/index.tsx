import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import { useChatbotsStore } from '@/stores/chatbots';
import { useNotificationsStore } from '@/stores/notifications';
import { deregisterPushToken } from '@/lib/api';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, agentName, setAgentName, clear: clearAuth } = useAuthStore();
  const { setChatbots, pendingCounts } = useChatbotsStore();
  const { expoPushToken, clearToken } = useNotificationsStore();

  const [nameInput, setNameInput] = useState(agentName);
  const [nameSaved, setNameSaved] = useState(false);

  function handleSaveName() {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setAgentName(trimmed);
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          if (expoPushToken) {
            await deregisterPushToken(expoPushToken).catch(() => {});
            clearToken();
          }
          await supabase.auth.signOut();
          clearAuth();
          setChatbots([]);
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  async function checkNotificationStatus(): Promise<string> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  function openNotificationSettings() {
    Linking.openSettings();
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
    >
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
      </View>

      {/* Account */}
      <View className="px-4 mt-6">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Account
        </Text>
        <View className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
          <Text className="text-xs text-gray-500 mb-0.5">Email</Text>
          <Text className="text-sm font-medium text-gray-900">{user?.email ?? '—'}</Text>
        </View>
      </View>

      {/* Display name */}
      <View className="px-4 mt-5">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Display Name
        </Text>
        <Text className="text-xs text-gray-500 mb-2">
          Shown to visitors when you send messages as an agent.
        </Text>
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-white"
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="e.g. Sarah from Support"
            placeholderTextColor="#9ca3af"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSaveName}
          />
          <Pressable
            onPress={handleSaveName}
            className="bg-primary-500 rounded-xl px-4 py-3 active:bg-primary-600"
          >
            <Text className="text-white font-medium text-sm">
              {nameSaved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Notifications */}
      <View className="px-4 mt-5">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Notifications
        </Text>
        <View className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
          <View className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
            <Text className="text-sm text-gray-700">Push token registered</Text>
            <View
              className={`w-2.5 h-2.5 rounded-full ${expoPushToken ? 'bg-green-500' : 'bg-gray-300'}`}
            />
          </View>
          <Pressable
            onPress={openNotificationSettings}
            className="px-4 py-3 flex-row items-center justify-between active:bg-gray-100"
          >
            <Text className="text-sm text-primary-600">Open Notification Settings</Text>
            <Text className="text-gray-400">›</Text>
          </Pressable>
        </View>
      </View>

      {/* Sign out */}
      <View className="px-4 mt-8">
        <Pressable
          onPress={handleSignOut}
          className="border border-red-300 rounded-2xl py-4 items-center active:bg-red-50"
        >
          <Text className="text-red-600 font-semibold text-base">Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
