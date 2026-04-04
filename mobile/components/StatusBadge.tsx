import { View, Text } from 'react-native';
import type { HandoffStatus } from '@/lib/api';

const CONFIG: Record<HandoffStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending' },
  active: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Active' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
};

interface StatusBadgeProps {
  status: HandoffStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, text, label } = CONFIG[status];
  return (
    <View className={`${bg} rounded-full px-2 py-0.5`}>
      <Text className={`${text} text-xs font-medium`}>{label}</Text>
    </View>
  );
}
