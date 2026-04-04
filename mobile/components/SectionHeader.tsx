import { Text } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2 bg-gray-50">
      {title}
    </Text>
  );
}
