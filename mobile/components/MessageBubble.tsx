import { memo } from 'react';
import { View, Text } from 'react-native';
import type { AgentMessage } from '@/lib/api';

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface MessageBubbleProps {
  message: AgentMessage;
}

export const MessageBubble = memo(function MessageBubble({ message: msg }: MessageBubbleProps) {
  const isAgent = msg.metadata?.is_human_agent === true;
  const isSystem = msg.role === 'system';
  const isBot = msg.role === 'assistant' && !isAgent;
  const isUser = msg.role === 'user';

  if (isSystem) {
    return (
      <View className="items-center my-1">
        <View className="bg-gray-100 rounded-full px-3 py-1">
          <Text className="text-xs text-gray-500">{msg.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`flex-row my-1 ${isUser ? 'justify-start' : 'justify-end'}`}>
      {isUser && (
        <View className="w-7 h-7 rounded-full bg-gray-200 items-center justify-center mr-2 mt-1">
          <Text className="text-xs text-gray-600 font-bold">V</Text>
        </View>
      )}
      <View
        className={`max-w-[75%] rounded-2xl px-3 py-2 ${
          isUser
            ? 'bg-gray-100 rounded-tl-sm'
            : isAgent
            ? 'bg-purple-600 rounded-tr-sm'
            : 'bg-primary-500 rounded-tr-sm'
        }`}
      >
        {(isAgent || isBot) && (
          <Text
            className={`text-xs mb-0.5 font-medium ${
              isAgent ? 'text-purple-200' : 'text-primary-100'
            }`}
          >
            {isAgent
              ? `${(msg.metadata as Record<string, unknown>)?.agent_name as string ?? 'Agent'}`
              : 'AI'}
          </Text>
        )}
        <Text
          className={`text-sm leading-5 ${
            isUser ? 'text-gray-900' : 'text-white'
          }`}
        >
          {msg.content}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            isUser ? 'text-gray-400' : 'text-white/60'
          }`}
        >
          {formatTime(msg.created_at)}
        </Text>
      </View>
      {!isUser && isAgent && (
        <View className="w-7 h-7 rounded-full bg-purple-600 items-center justify-center ml-2 mt-1">
          <Text className="text-xs text-white font-bold">A</Text>
        </View>
      )}
      {!isUser && isBot && (
        <View className="w-7 h-7 rounded-full bg-primary-500 items-center justify-center ml-2 mt-1">
          <Text className="text-xs text-white font-bold">AI</Text>
        </View>
      )}
    </View>
  );
});
