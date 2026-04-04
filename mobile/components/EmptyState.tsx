import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {icon && <View className="mb-4 opacity-50">{icon}</View>}
      <Text className="text-base font-semibold text-gray-700 text-center">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-gray-500 text-center mt-2">{subtitle}</Text>
      )}
    </View>
  );
}
