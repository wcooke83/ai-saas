import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { getChatbot, updateChatbot } from '@/lib/api';
import type { ChatbotUpdatePayload } from '@/lib/types';
import { LoadingScreen } from '@/components/LoadingScreen';
import { SectionHeader } from '@/components/SectionHeader';
import { Toast, useToast } from '@/components/Toast';

const STATUSES = ['draft', 'active', 'paused'] as const;
type Status = typeof STATUSES[number];

const MODELS = [
  { value: 'claude-3-5-haiku-20241022', label: 'Haiku' },
  { value: 'claude-3-5-sonnet-20241022', label: 'Sonnet' },
  { value: 'claude-opus-4-5', label: 'Opus' },
] as const;

type FormState = {
  name: string;
  description: string;
  status: Status;
  welcome_message: string;
  placeholder_text: string;
  language: string;
  system_prompt: string;
  model: string;
  temperature: number;
  memory_enabled: boolean;
  memory_days: string;
  enable_prompt_protection: boolean;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="px-4 py-3 border-b border-gray-100">
      <Text className="text-xs text-gray-500 mb-1.5">{label}</Text>
      {children}
    </View>
  );
}

export default function ChatbotSettingsScreen() {
  const { chatbotId } = useLocalSearchParams<{ chatbotId: string }>();
  const queryClient = useQueryClient();
  const { toastState, show: showToast, hide: hideToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['chatbot', chatbotId],
    queryFn: () => getChatbot(chatbotId),
    enabled: !!chatbotId,
    staleTime: 120_000,
  });

  const [form, setForm] = useState<FormState>({
    name: '',
    description: '',
    status: 'active',
    welcome_message: '',
    placeholder_text: '',
    language: '',
    system_prompt: '',
    model: 'claude-3-5-haiku-20241022',
    temperature: 0.7,
    memory_enabled: false,
    memory_days: '7',
    enable_prompt_protection: false,
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name ?? '',
        description: data.description ?? '',
        status: (data.status as Status) ?? 'active',
        welcome_message: data.welcome_message ?? '',
        placeholder_text: data.placeholder_text ?? '',
        language: data.language ?? '',
        system_prompt: data.system_prompt ?? '',
        model: data.model ?? 'claude-3-5-haiku-20241022',
        temperature: data.temperature ?? 0.7,
        memory_enabled: data.memory_enabled ?? false,
        memory_days: String(data.memory_days ?? 7),
        enable_prompt_protection: data.enable_prompt_protection ?? false,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<ChatbotUpdatePayload>) => updateChatbot(chatbotId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['chatbot', chatbotId], updated);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast('Settings saved', 'success');
    },
    onError: (err: Error) => {
      showToast(err.message ?? 'Save failed', 'error');
    },
  });

  function handleSave() {
    const payload: Partial<ChatbotUpdatePayload> = {
      name: form.name,
      description: form.description,
      status: form.status,
      welcome_message: form.welcome_message,
      placeholder_text: form.placeholder_text,
      language: form.language,
      system_prompt: form.system_prompt,
      model: form.model,
      temperature: form.temperature,
      memory_enabled: form.memory_enabled,
      memory_days: parseInt(form.memory_days, 10) || 7,
      enable_prompt_protection: form.enable_prompt_protection,
    };
    mutation.mutate(payload);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <SectionHeader title="General" />

        <Field label="Name">
          <TextInput
            className="text-sm text-gray-900 py-1"
            value={form.name}
            onChangeText={(v) => set('name', v)}
            placeholder="Chatbot name"
            placeholderTextColor="#9ca3af"
          />
        </Field>

        <Field label="Description">
          <TextInput
            className="text-sm text-gray-900 py-1"
            value={form.description}
            onChangeText={(v) => set('description', v)}
            placeholder="Short description"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={2}
          />
        </Field>

        <Field label="Status">
          <View className="flex-row gap-2 mt-1">
            {STATUSES.map((s) => (
              <Pressable
                key={s}
                onPress={() => set('status', s)}
                className={`px-3 py-1.5 rounded-full border ${
                  form.status === s
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text
                  className={`text-xs font-medium capitalize ${
                    form.status === s ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <SectionHeader title="Conversation" />

        <Field label="Welcome message">
          <TextInput
            className="text-sm text-gray-900 py-1"
            value={form.welcome_message}
            onChangeText={(v) => set('welcome_message', v)}
            placeholder="Hi! How can I help you today?"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={2}
          />
        </Field>

        <Field label="Placeholder text">
          <TextInput
            className="text-sm text-gray-900 py-1"
            value={form.placeholder_text}
            onChangeText={(v) => set('placeholder_text', v)}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
          />
        </Field>

        <Field label="Language">
          <TextInput
            className="text-sm text-gray-900 py-1"
            value={form.language}
            onChangeText={(v) => set('language', v)}
            placeholder="e.g. English"
            placeholderTextColor="#9ca3af"
          />
        </Field>

        <SectionHeader title="AI" />

        <Field label="System prompt">
          <TextInput
            className="text-sm text-gray-900 py-1"
            value={form.system_prompt}
            onChangeText={(v) => set('system_prompt', v)}
            placeholder="You are a helpful assistant..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={{ minHeight: 120 }}
          />
        </Field>

        <Field label="Model">
          <View className="flex-row gap-2 mt-1">
            {MODELS.map((m) => (
              <Pressable
                key={m.value}
                onPress={() => set('model', m.value)}
                className={`px-3 py-1.5 rounded-full border ${
                  form.model === m.value
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    form.model === m.value ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label={`Temperature — ${form.temperature.toFixed(2)}`}>
          <Slider
            style={{ width: '100%', height: 36 }}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={form.temperature}
            onValueChange={(v) => set('temperature', v)}
            minimumTrackTintColor="#6366f1"
            maximumTrackTintColor="#e5e7eb"
            thumbTintColor="#6366f1"
          />
          <View className="flex-row justify-between mt-0.5">
            <Text className="text-xs text-gray-400">Precise</Text>
            <Text className="text-xs text-gray-400">Creative</Text>
          </View>
        </Field>

        <Field label="Prompt protection">
          <View className="flex-row items-center justify-between py-1">
            <Text className="text-sm text-gray-700">Block jailbreak attempts</Text>
            <Switch
              value={form.enable_prompt_protection}
              onValueChange={(v) => set('enable_prompt_protection', v)}
              trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
              thumbColor="#fff"
            />
          </View>
        </Field>

        <SectionHeader title="Memory" />

        <Field label="Enable memory">
          <View className="flex-row items-center justify-between py-1">
            <Text className="text-sm text-gray-700">Remember past conversations</Text>
            <Switch
              value={form.memory_enabled}
              onValueChange={(v) => set('memory_enabled', v)}
              trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
              thumbColor="#fff"
            />
          </View>
        </Field>

        {form.memory_enabled && (
          <Field label="Memory days">
            <TextInput
              className="text-sm text-gray-900 py-1"
              value={form.memory_days}
              onChangeText={(v) => set('memory_days', v.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              placeholder="7"
              placeholderTextColor="#9ca3af"
            />
          </Field>
        )}

        {/* Bottom padding so save button doesn't overlap last field */}
        <View className="h-28" />
      </ScrollView>

      {/* Sticky save button */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-3 bg-white border-t border-gray-100">
        <Pressable
          onPress={handleSave}
          disabled={mutation.isPending}
          className={`rounded-2xl py-3.5 items-center ${
            mutation.isPending ? 'bg-indigo-300' : 'bg-indigo-500'
          }`}
        >
          <Text className="text-white font-semibold text-base">
            {mutation.isPending ? 'Saving...' : 'Save changes'}
          </Text>
        </Pressable>
      </View>

      <Toast
        message={toastState.message}
        type={toastState.type}
        visible={toastState.visible}
        onHide={hideToast}
      />
    </KeyboardAvoidingView>
  );
}
