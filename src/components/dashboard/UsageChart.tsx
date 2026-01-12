'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface UsageDataPoint {
  date: string;
  tokens: number;
  inputTokens?: number;
  outputTokens?: number;
}

interface UsageChartProps {
  data: UsageDataPoint[];
  period: '7d' | '14d' | '30d';
}

export function UsageChart({ data, period }: UsageChartProps) {
  // Fill in missing dates with zero values
  const filledData = useMemo(() => {
    const days = period === '7d' ? 7 : period === '14d' ? 14 : 30;
    const result: UsageDataPoint[] = [];
    const dataMap = new Map(data.map(d => [d.date, d]));

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const existing = dataMap.get(dateStr);

      result.push(existing || {
        date: dateStr,
        tokens: 0,
        inputTokens: 0,
        outputTokens: 0,
      });
    }

    return result;
  }, [data, period]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-lg border p-3 shadow-lg"
          style={{
            backgroundColor: 'rgb(var(--chart-tooltip-bg))',
            borderColor: 'rgb(var(--chart-tooltip-border))',
            color: 'rgb(var(--chart-tooltip-text))',
          }}
        >
          <p className="text-sm font-medium mb-1">{formatDate(label)}</p>
          <p className="text-sm">
            <span className="font-semibold">{payload[0].value.toLocaleString()}</span> tokens
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={filledData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="rgb(var(--chart-primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="rgb(var(--chart-primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgb(var(--chart-grid))"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="rgb(var(--chart-axis))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="rgb(var(--chart-axis))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="tokens"
            stroke="rgb(var(--chart-primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTokens)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
