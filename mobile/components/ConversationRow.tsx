import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import type { AgentConversation } from '@/lib/api';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function PulseDot() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      false,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={animatedStyle}
      className="w-2 h-2 rounded-full bg-orange-500 mr-1"
    />
  );
}

interface ConversationRowProps {
  conversation: AgentConversation;
  chatbotName?: string;
  onPress: () => void;
}

export const ConversationRow = memo(function ConversationRow({
  conversation: conv,
  chatbotName,
  onPress,
}: ConversationRowProps) {
  const visitorLabel = conv.visitor_name || conv.visitor_email || 'Anonymous Visitor';
  const timeLabel = timeAgo(conv.last_message_at || conv.handoff_created_at);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-1">
            {conv.handoff_status === 'pending' && <PulseDot />}
            <Text className="text-sm font-semibold text-gray-900 flex-1" numberOfLines={1}>
              {visitorLabel}
            </Text>
          </View>
          {chatbotName && (
            <View className="self-start bg-primary-100 rounded-full px-2 py-0.5 mb-1">
              <Text className="text-xs text-primary-700 font-medium">{chatbotName}</Text>
            </View>
          )}
          {conv.last_message && (
            <Text className="text-xs text-gray-500 leading-4" numberOfLines={2}>
              {conv.last_message.is_agent ? 'Agent: ' : ''}
              {conv.last_message.content}
            </Text>
          )}
          {conv.escalation_reason && conv.handoff_status === 'pending' && (
            <Text className="text-xs text-orange-600 font-medium mt-1">
              {conv.escalation_reason === 'need_human_help'
                ? 'Requested human support'
                : conv.escalation_reason === 'wrong_answer'
                ? 'Reported wrong answer'
                : conv.escalation_reason === 'offensive_content'
                ? 'Reported offensive content'
                : 'Other issue'}
            </Text>
          )}
        </View>
        <View className="items-end gap-1">
          <StatusBadge status={conv.handoff_status} />
          <Text className="text-xs text-gray-400">{timeLabel}</Text>
          <Text className="text-xs text-gray-400">{conv.message_count} msgs</Text>
        </View>
      </View>
    </Pressable>
  );
});
