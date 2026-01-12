'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';

export interface UserAPILog {
  id: string;
  endpoint: string;
  status_code: number;
  provider: string | null;
  model: string | null;
  tokens_input: number;
  tokens_output: number;
  tokens_billed: number;
  duration_ms: number | null;
  error_message: string | null;
  request_body: Record<string, unknown> | null;
  created_at: string;
}

interface UserLogEntryProps {
  log: UserAPILog;
  isExpanded: boolean;
  onToggle: () => void;
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

function getToolName(endpoint: string): string {
  const match = endpoint.match(/\/api\/tools\/([^/]+)/);
  if (match) {
    return match[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return endpoint;
}

export function UserLogEntry({ log, isExpanded, onToggle }: UserLogEntryProps) {
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
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
              {log.status_code}
            </span>
            <span className="font-medium text-sm text-secondary-900 dark:text-secondary-100">
              {getToolName(log.endpoint)}
            </span>
            {log.provider && (
              <Badge variant="outline" className="text-xs">
                {log.provider}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" aria-hidden="true" />
              {(log.tokens_input + log.tokens_output).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {formatDuration(log.duration_ms)}
            </span>
            <span className="hidden sm:inline">{formatTime(log.created_at)}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-secondary-200 dark:border-secondary-700 p-4 space-y-4 bg-secondary-50 dark:bg-secondary-900/50">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-secondary-500 dark:text-secondary-400">Tokens (In/Out)</p>
              <p className="font-mono text-xs text-secondary-900 dark:text-secondary-100">
                {log.tokens_input.toLocaleString()} / {log.tokens_output.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-secondary-500 dark:text-secondary-400">Billed Tokens</p>
              <p className="font-mono text-xs text-secondary-900 dark:text-secondary-100">
                {log.tokens_billed.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-secondary-500 dark:text-secondary-400">Model</p>
              <p className="font-mono text-xs text-secondary-900 dark:text-secondary-100">
                {log.model || '-'}
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
                <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />
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
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Request</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(JSON.stringify(log.request_body, null, 2), 'request');
                  }}
                >
                  {copiedField === 'request' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <pre className="p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-xs font-mono text-secondary-800 dark:text-secondary-200 overflow-x-auto max-h-48">
                {JSON.stringify(log.request_body, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
