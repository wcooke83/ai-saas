'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ScrollText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface APILog {
  id: string;
  user_id: string | null;
  endpoint: string;
  method: string;
  request_body: Record<string, unknown> | null;
  response_body: Record<string, unknown> | null;
  raw_ai_prompt: string | null;
  raw_ai_response: string | null;
  status_code: number;
  provider: string | null;
  model: string | null;
  tokens_input: number;
  tokens_output: number;
  tokens_billed: number;
  duration_ms: number | null;
  ip_address: string | null;
  user_agent: string | null;
  error_message: string | null;
  created_at: string;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}

function formatDuration(ms: number | null): string {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatJsonString(str: string): string {
  try {
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed, null, 2);
  } catch {
    // Not valid JSON, return as-is
    return str;
  }
}

function LogEntry({ log, isExpanded, onToggle }: { log: APILog; isExpanded: boolean; onToggle: () => void }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const statusColor = log.status_code >= 200 && log.status_code < 300
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    : log.status_code >= 400
    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';

  return (
    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
              {log.status_code}
            </span>
            <span className="font-mono text-sm text-secondary-900 dark:text-secondary-100">
              {log.endpoint}
            </span>
            {log.provider && (
              <Badge variant="outline" className="text-xs">
                {log.provider} / {log.model}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {log.tokens_input + log.tokens_output} tokens
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(log.duration_ms)}
            </span>
            <span>{formatTime(log.created_at)}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-secondary-200 dark:border-secondary-700 p-4 space-y-4 bg-secondary-50 dark:bg-secondary-900/50">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-secondary-500 dark:text-secondary-400">User ID</p>
              <p className="font-mono text-xs text-secondary-900 dark:text-secondary-100 truncate">
                {log.user_id || 'Anonymous'}
              </p>
            </div>
            <div>
              <p className="text-secondary-500 dark:text-secondary-400">IP Address</p>
              <p className="font-mono text-xs text-secondary-900 dark:text-secondary-100">
                {log.ip_address || '-'}
              </p>
            </div>
            <div>
              <p className="text-secondary-500 dark:text-secondary-400">Tokens (In/Out/Billed)</p>
              <p className="font-mono text-xs text-secondary-900 dark:text-secondary-100">
                {log.tokens_input} / {log.tokens_output} / {log.tokens_billed}
              </p>
            </div>
            <div>
              <p className="text-secondary-500 dark:text-secondary-400">Duration</p>
              <p className="font-mono text-xs text-secondary-900 dark:text-secondary-100">
                {formatDuration(log.duration_ms)}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {log.error_message && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Error</p>
              </div>
              <pre className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs font-mono text-red-800 dark:text-red-300 overflow-x-auto">
                {log.error_message}
              </pre>
            </div>
          )}

          {/* Request Body */}
          {log.request_body && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Request Body</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => copyToClipboard(JSON.stringify(log.request_body, null, 2), 'request')}
                >
                  {copiedField === 'request' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <pre className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-xs font-mono text-secondary-800 dark:text-secondary-200 overflow-x-auto max-h-48">
                {JSON.stringify(log.request_body, null, 2)}
              </pre>
            </div>
          )}

          {/* Raw AI Prompt */}
          {log.raw_ai_prompt && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Raw AI Prompt</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => copyToClipboard(log.raw_ai_prompt!, 'prompt')}
                >
                  {copiedField === 'prompt' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <pre className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs font-mono text-blue-800 dark:text-blue-200 overflow-x-auto max-h-64 whitespace-pre-wrap">
                {log.raw_ai_prompt}
              </pre>
            </div>
          )}

          {/* Raw AI Response */}
          {log.raw_ai_response && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Raw AI Response</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => copyToClipboard(formatJsonString(log.raw_ai_response!), 'response')}
                >
                  {copiedField === 'response' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <pre className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-xs font-mono text-green-800 dark:text-green-200 overflow-x-auto max-h-96 whitespace-pre-wrap">
                {formatJsonString(log.raw_ai_response)}
              </pre>
            </div>
          )}

          {/* User Agent */}
          {log.user_agent && (
            <div>
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">User Agent</p>
              <p className="text-xs font-mono text-secondary-500 dark:text-secondary-400 break-all">
                {log.user_agent}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<APILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'errors'>('all');

  const supabase = createClient();

  const fetchLogs = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const { data, error } = await (supabase as any)
        .from('api_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'errors') return log.status_code >= 400;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-secondary-100 dark:bg-secondary-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-1 -ml-2 mr-1">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <ScrollText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">API Logs</h1>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm">
              Raw AI requests and responses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'errors')}
            className="text-sm border border-secondary-200 dark:border-secondary-700 text-secondary-900 dark:text-secondary-100 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
          >
            <option value="all">All Requests</option>
            <option value="errors">Errors Only</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLogs(true)}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Requests</p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">{logs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">Errors</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {logs.filter((l) => l.status_code >= 400).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">Total Tokens</p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {logs.reduce((sum, l) => sum + l.tokens_input + l.tokens_output, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">Avg Duration</p>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white">
              {logs.length > 0
                ? formatDuration(
                    logs.reduce((sum, l) => sum + (l.duration_ms || 0), 0) / logs.length
                  )
                : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>Last 100 API calls with full request/response data</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <ScrollText className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
              <p className="text-secondary-500 dark:text-secondary-400">No logs found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <LogEntry
                  key={log.id}
                  log={log}
                  isExpanded={expandedIds.has(log.id)}
                  onToggle={() => toggleExpanded(log.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
