import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  Dimensions,
  Animated,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { getAnalytics } from '@/lib/api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 32;

const PERIODS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
] as const;

type Period = typeof PERIODS[number]['days'];

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonBox({ className }: { className?: string }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{ opacity }}
      className={`bg-gray-200 rounded-2xl ${className ?? ''}`}
    />
  );
}

function StatsSkeleton() {
  return (
    <View className="flex-row flex-wrap gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonBox key={i} className="flex-1 min-w-[140px] h-20" />
      ))}
      <SkeletonBox className="w-full h-48 mt-2" />
    </View>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <View className={`flex-1 min-w-[140px] rounded-2xl p-4 border ${accent}`}>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      <Text className="text-xs text-gray-500 mt-1">{label}</Text>
    </View>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function AnalyticsScreen() {
  const { chatbotId } = useLocalSearchParams<{ chatbotId: string }>();
  const [days, setDays] = useState<Period>(30);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['analytics', chatbotId, days],
    queryFn: () => getAnalytics(chatbotId, days),
    enabled: !!chatbotId,
    staleTime: 120_000,
  });

  const dailyData = data?.daily_data ?? [];

  const chartLabels = dailyData.length > 0
    ? dailyData
        .filter((_: unknown, i: number) =>
          i === 0 || i === Math.floor((dailyData.length - 1) / 2) || i === dailyData.length - 1
        )
        .map((d: { date: string }) => {
          const dt = new Date(d.date);
          return `${dt.getMonth() + 1}/${dt.getDate()}`;
        })
    : [];

  const chartDataset = {
    labels: chartLabels,
    datasets: [{ data: dailyData.map((d: { conversations: number }) => d.conversations) }],
  };

  const satisfactionPct =
    data?.satisfaction_rate != null
      ? `${Math.round(data.satisfaction_rate * 100)}%`
      : '—';

  return (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching && !isLoading}
          onRefresh={() => refetch()}
          tintColor="#6366f1"
        />
      }
    >
      <View className="px-4 py-4">
        {/* Period selector */}
        <View className="flex-row gap-2 mb-5">
          {PERIODS.map((p) => (
            <Pressable
              key={p.days}
              onPress={() => setDays(p.days)}
              className={`px-4 py-1.5 rounded-full border ${
                days === p.days
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  days === p.days ? 'text-white' : 'text-gray-600'
                }`}
              >
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <>
            {/* Stats grid */}
            <View className="flex-row flex-wrap gap-3 mb-5">
              <StatCard
                label="Conversations"
                value={data?.total_conversations ?? 0}
                accent="bg-indigo-50 border-indigo-200"
              />
              <StatCard
                label="Messages"
                value={data?.total_messages ?? 0}
                accent="bg-blue-50 border-blue-200"
              />
              <StatCard
                label="Unique visitors"
                value={data?.unique_visitors ?? 0}
                accent="bg-purple-50 border-purple-200"
              />
              <StatCard
                label="Avg messages/conv"
                value={
                  data?.avg_messages_per_conversation != null
                    ? data.avg_messages_per_conversation.toFixed(1)
                    : '—'
                }
                accent="bg-cyan-50 border-cyan-200"
              />
              <StatCard
                label="Satisfaction"
                value={satisfactionPct}
                accent="bg-green-50 border-green-200"
              />
            </View>

            {/* Line chart */}
            {dailyData.length > 1 ? (
              <View className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <View className="px-4 pt-4 pb-1">
                  <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Conversations per day
                  </Text>
                </View>
                <LineChart
                  data={chartDataset}
                  width={CHART_WIDTH}
                  height={200}
                  withDots={false}
                  withInnerLines={true}
                  withOuterLines={false}
                  chartConfig={{
                    backgroundColor: '#f9fafb',
                    backgroundGradientFrom: '#f9fafb',
                    backgroundGradientTo: '#f9fafb',
                    decimalPlaces: 0,
                    color: () => '#6366f1',
                    labelColor: () => '#9ca3af',
                    propsForBackgroundLines: { stroke: '#f3f4f6' },
                    fillShadowGradientFrom: '#eef2ff',
                    fillShadowGradientTo: '#ffffff',
                    fillShadowGradientOpacity: 1,
                  }}
                  bezier
                  style={{ borderRadius: 0 }}
                />
              </View>
            ) : (
              <View className="bg-gray-50 rounded-2xl border border-gray-200 p-8 items-center">
                <Text className="text-sm text-gray-400 text-center">
                  Not enough data to show a chart for this period.
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
