import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  Switch,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import {
  getKnowledgeSources,
  addKnowledgeSource,
  updateKnowledgeSource,
  deleteKnowledgeSource,
} from '@/lib/api';
import type { AddSourcePayload, KnowledgeSource } from '@/lib/types';
import { EmptyState } from '@/components/EmptyState';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Toast, useToast } from '@/components/Toast';

// ── Icons (text-based to avoid icon lib dep) ─────────────────────────────────

const TYPE_ICON: Record<string, string> = {
  url: '↗',
  text: '≡',
  qa_pair: '?',
  pdf: '⊞',
  docx: '⊡',
};

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  ready:      { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Ready' },
  processing: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Processing' },
  error:      { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Error' },
  pending:    { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Pending' },
};

// ── Add-source modal ─────────────────────────────────────────────────────────

type TabType = 'url' | 'text' | 'qa_pair';

function AddSourceModal({
  chatbotId,
  visible,
  onClose,
  onAdded,
}: {
  chatbotId: string;
  visible: boolean;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [tab, setTab] = useState<TabType>('url');

  // URL fields
  const [url, setUrl] = useState('');
  const [urlName, setUrlName] = useState('');
  const [crawl, setCrawl] = useState(false);
  const [maxPages, setMaxPages] = useState('5');

  // Text fields
  const [textName, setTextName] = useState('');
  const [textContent, setTextContent] = useState('');

  // Q&A fields
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function reset() {
    setTab('url');
    setUrl(''); setUrlName(''); setCrawl(false); setMaxPages('5');
    setTextName(''); setTextContent('');
    setQuestion(''); setAnswer('');
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    setError('');
    let payload: AddSourcePayload;

    if (tab === 'url') {
      if (!url.trim()) { setError('URL is required'); return; }
      payload = {
        type: 'url',
        url: url.trim(),
        ...(urlName.trim() ? { name: urlName.trim() } : {}),
        ...(crawl ? { crawl: true, maxPages: parseInt(maxPages, 10) || 5 } : {}),
      };
    } else if (tab === 'text') {
      if (!textContent.trim()) { setError('Content is required'); return; }
      payload = {
        type: 'text',
        content: textContent.trim(),
        ...(textName.trim() ? { name: textName.trim() } : {}),
      };
    } else {
      if (!question.trim() || !answer.trim()) { setError('Question and answer are required'); return; }
      payload = { type: 'qa_pair', question: question.trim(), answer: answer.trim() };
    }

    setSaving(true);
    try {
      await addKnowledgeSource(chatbotId, payload);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      reset();
      onAdded();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add source');
    } finally {
      setSaving(false);
    }
  }

  const TABS: { key: TabType; label: string }[] = [
    { key: 'url', label: 'URL' },
    { key: 'text', label: 'Text' },
    { key: 'qa_pair', label: 'Q&A' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-5 pb-3 border-b border-gray-100">
          <Pressable onPress={handleClose}>
            <Text className="text-indigo-500 text-base">Cancel</Text>
          </Pressable>
          <Text className="text-base font-semibold text-gray-900">Add source</Text>
          <Pressable onPress={handleSubmit} disabled={saving}>
            <Text className={`text-base font-semibold ${saving ? 'text-indigo-300' : 'text-indigo-500'}`}>
              {saving ? 'Adding...' : 'Add'}
            </Text>
          </Pressable>
        </View>

        {/* Tab selector */}
        <View className="flex-row px-4 py-3 gap-2">
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl items-center border ${
                tab === t.key ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium ${tab === t.key ? 'text-white' : 'text-gray-600'}`}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
          {tab === 'url' && (
            <View className="gap-4 pt-2">
              <View>
                <Text className="text-xs text-gray-500 mb-1">URL *</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
                  value={url}
                  onChangeText={setUrl}
                  placeholder="https://example.com/page"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-1">Name (optional)</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
                  value={urlName}
                  onChangeText={setUrlName}
                  placeholder="My page"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View className="flex-row items-center justify-between py-2">
                <View>
                  <Text className="text-sm text-gray-800">Web crawl</Text>
                  <Text className="text-xs text-gray-500">Follow links from this page</Text>
                </View>
                <Switch
                  value={crawl}
                  onValueChange={setCrawl}
                  trackColor={{ false: '#e5e7eb', true: '#6366f1' }}
                  thumbColor="#fff"
                />
              </View>
              {crawl && (
                <View>
                  <Text className="text-xs text-gray-500 mb-1">Max pages</Text>
                  <TextInput
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
                    value={maxPages}
                    onChangeText={(v) => setMaxPages(v.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    placeholder="5"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              )}
            </View>
          )}

          {tab === 'text' && (
            <View className="gap-4 pt-2">
              <View>
                <Text className="text-xs text-gray-500 mb-1">Name (optional)</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
                  value={textName}
                  onChangeText={setTextName}
                  placeholder="My document"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-1">Content *</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
                  value={textContent}
                  onChangeText={setTextContent}
                  placeholder="Paste or type content here..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                  style={{ minHeight: 160 }}
                />
              </View>
            </View>
          )}

          {tab === 'qa_pair' && (
            <View className="gap-4 pt-2">
              <View>
                <Text className="text-xs text-gray-500 mb-1">Question *</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="What are your business hours?"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={2}
                />
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-1">Answer *</Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="We're open Monday to Friday, 9am–5pm."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ minHeight: 100 }}
                />
              </View>
            </View>
          )}

          {!!error && (
            <View className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200">
              <Text className="text-sm text-red-700">{error}</Text>
            </View>
          )}

          <View className="h-16" />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Source row ───────────────────────────────────────────────────────────────

function SourceRow({
  item,
  chatbotId,
  onDeleted,
  onToast,
}: {
  item: KnowledgeSource;
  chatbotId: string;
  onDeleted: () => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}) {
  const queryClient = useQueryClient();
  const swipeableRef = useRef<Swipeable>(null);
  const [expanded, setExpanded] = useState(false);

  const icon = TYPE_ICON[item.type] ?? '⊙';
  const statusKey = item.status ?? 'pending';
  const style = STATUS_STYLE[statusKey] ?? STATUS_STYLE.pending;

  const priorityMutation = useMutation({
    mutationFn: (is_priority: boolean) =>
      updateKnowledgeSource(chatbotId, item.id, { is_priority }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', chatbotId] });
    },
  });

  const reprocessMutation = useMutation({
    mutationFn: () => updateKnowledgeSource(chatbotId, item.id, { action: 'reprocess' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', chatbotId] });
      onToast('Reprocessing started', 'success');
    },
    onError: (e: Error) => onToast(e.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteKnowledgeSource(chatbotId, item.id),
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['knowledge', chatbotId] });
      onDeleted();
    },
    onError: (e: Error) => onToast(e.message, 'error'),
  });

  function confirmDelete() {
    swipeableRef.current?.close();
    Alert.alert(
      'Delete source',
      `Delete "${item.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ],
    );
  }

  function handleLongPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(item.name, undefined, [
      { text: 'Reprocess', onPress: () => reprocessMutation.mutate() },
      {
        text: item.is_priority ? 'Remove priority' : 'Mark as priority',
        onPress: () => priorityMutation.mutate(!item.is_priority),
      },
      { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function renderRightActions(_: unknown, dragX: Animated.AnimatedInterpolation<number>) {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={confirmDelete}
          className="bg-red-500 w-20 justify-center items-center"
        >
          <Text className="text-white text-xs font-semibold">Delete</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      <Pressable
        onLongPress={handleLongPress}
        onPress={() => item.error_message && setExpanded((e) => !e)}
        className="bg-white"
      >
        <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
          {/* Type icon */}
          <View className="w-8 h-8 rounded-full bg-indigo-50 items-center justify-center mr-3">
            <Text className="text-indigo-500 text-sm font-bold">{icon}</Text>
          </View>

          {/* Name + type */}
          <View className="flex-1 mr-3">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm font-medium text-gray-900 flex-1" numberOfLines={1}>
                {item.name}
              </Text>
              {item.is_priority && (
                <View className="bg-orange-100 rounded-full px-1.5 py-0.5">
                  <Text className="text-orange-600 text-xs font-semibold">Priority</Text>
                </View>
              )}
            </View>
            <View className="flex-row items-center gap-2 mt-0.5">
              <Text className="text-xs text-gray-400 capitalize">{item.type.replace('_', ' ')}</Text>
              {item.chunk_count != null && (
                <Text className="text-xs text-gray-400">{item.chunk_count} chunks</Text>
              )}
            </View>
          </View>

          {/* Status + priority toggle */}
          <View className="items-end gap-2">
            <View className={`${style.bg} rounded-full px-2 py-0.5`}>
              <Text className={`${style.text} text-xs font-medium`}>{style.label}</Text>
            </View>
            <Switch
              value={item.is_priority ?? false}
              onValueChange={(v) => priorityMutation.mutate(v)}
              trackColor={{ false: '#e5e7eb', true: '#f97316' }}
              thumbColor="#fff"
              style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
            />
          </View>
        </View>

        {/* Error message — collapsible */}
        {item.error_message && expanded && (
          <View className="px-4 pb-3 bg-red-50 border-b border-gray-100">
            <Text className="text-xs text-red-700 mt-2">{item.error_message}</Text>
          </View>
        )}
        {item.error_message && !expanded && (
          <View className="px-4 pb-2 border-b border-gray-100">
            <Text className="text-xs text-red-500">Tap to see error</Text>
          </View>
        )}
      </Pressable>
    </Swipeable>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function KnowledgeScreen() {
  const { chatbotId } = useLocalSearchParams<{ chatbotId: string }>();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const { toastState, show: showToast, hide: hideToast } = useToast();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['knowledge', chatbotId],
    queryFn: () => getKnowledgeSources(chatbotId),
    enabled: !!chatbotId,
    staleTime: 60_000,
  });

  const sources = data?.sources ?? [];

  function handleAdded() {
    setModalVisible(false);
    queryClient.invalidateQueries({ queryKey: ['knowledge', chatbotId] });
    showToast('Source added', 'success');
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={sources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SourceRow
            item={item}
            chatbotId={chatbotId}
            onDeleted={() => showToast('Source deleted', 'success')}
            onToast={showToast}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor="#6366f1"
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No knowledge sources"
            subtitle="Tap + to add a URL, text, or Q&A pair"
            icon={<Text style={{ fontSize: 40 }}>📚</Text>}
          />
        }
        contentContainerStyle={sources.length === 0 ? { flex: 1 } : undefined}
      />

      {/* FAB */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setModalVisible(true);
        }}
        className="absolute bottom-6 right-5 w-14 h-14 bg-indigo-500 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 6 }}
      >
        <Text className="text-white text-3xl" style={{ lineHeight: 36 }}>+</Text>
      </Pressable>

      <AddSourceModal
        chatbotId={chatbotId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdded={handleAdded}
      />

      <Toast
        message={toastState.message}
        type={toastState.type}
        visible={toastState.visible}
        onHide={hideToast}
      />
    </View>
  );
}
