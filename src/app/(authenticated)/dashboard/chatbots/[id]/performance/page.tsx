'use client';

import { useState, useEffect, use, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Timer, Info, X, AlertTriangle } from 'lucide-react';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import { MessagePreview } from '@/components/performance/MessagePreview';
import { PerformanceFilterBar, type PerformanceFilters, DEFAULT_FILTERS } from '@/components/performance/PerformanceFilterBar';
import { PerformancePagination } from '@/components/performance/PerformancePagination';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import type { StageSpan } from '@/lib/chatbots/rag';

interface PerformancePageProps {
  params: Promise<{ id: string }>;
}

interface PerfRow {
  created_at: string;
  chatbot_loaded_ms: number | null;
  conversation_ready_ms: number | null;
  history_msg_handoff_ms: number | null;
  rag_embedding_ms: number | null;
  rag_similarity_ms: number | null;
  rag_live_fetch_ms: number | null;
  rag_total_ms: number | null;
  prompts_built_ms: number | null;
  first_token_ms: number | null;
  stream_complete_ms: number | null;
  total_ms: number | null;
  model: string | null;
  rag_chunks_count: number;
  rag_confidence: number;
  live_fetch_triggered: boolean;
  message_length: number;
  response_length: number;
  is_streaming: boolean;
  pipeline_timings: Record<string, StageSpan> | null;
  user_message: string | null;
  assistant_response: string | null;
}

interface PerfData {
  total_requests: number;
  page: number;
  page_size: number;
  total_pages: number;
  averages: Record<string, number | null>;
  p95_total_ms: number | null;
  available_models: string[];
  hourly: Array<Record<string, any>>;
  recent: PerfRow[];
}

const STAGE_LABELS: Record<string, { label: string; color: string; tooltip: string }> = {
  chatbot_loaded_ms: { label: 'Load Chatbot', color: '#94a3b8', tooltip: 'Time to fetch chatbot config, system prompt, and knowledge source metadata from the database' },
  conversation_ready_ms: { label: 'Get Conversation', color: '#a78bfa', tooltip: 'Time to find or create the conversation record and load visitor session context' },
  history_msg_handoff_ms: { label: 'History + Save + Handoff', color: '#818cf8', tooltip: 'Time to load recent message history, save the incoming user message, and check live handoff status' },
  rag_embedding_ms: { label: 'RAG: Embedding', color: '#f59e0b', tooltip: 'Time to generate a vector embedding of the user\'s message via the OpenAI embeddings API' },
  rag_similarity_ms: { label: 'RAG: Similarity Search', color: '#f97316', tooltip: 'Time to query pgvector for the most relevant knowledge chunks using cosine similarity' },
  rag_live_fetch_ms: { label: 'RAG: Live Fetch', color: '#ef4444', tooltip: 'Time to fetch live content from URLs when knowledge chunks have low confidence. Only triggered when similarity scores are below threshold' },
  rag_total_ms: { label: 'RAG Total', color: '#dc2626', tooltip: 'Combined time for the entire retrieval pipeline: embedding + similarity search + live fetch (if triggered)' },
  prompts_built_ms: { label: 'Build Prompts', color: '#10b981', tooltip: 'Time to assemble the system prompt, inject knowledge context, conversation memory, and message history into the final prompt' },
  first_token_ms: { label: 'First Token (TTFT)', color: '#0ea5e9', tooltip: 'Time from sending the request to the AI model until the first token of the response is received. Key latency metric for perceived responsiveness' },
  stream_complete_ms: { label: 'Stream Complete', color: '#6366f1', tooltip: 'Time from first token until the full AI response has finished streaming' },
  total_ms: { label: 'Total', color: '#0f172a', tooltip: 'End-to-end time from receiving the user message to completing the response, including all pipeline stages' },
};

/**
 * Pipeline stages for the Firefox-style waterfall.
 * Each stage gets its own row. Parallel stages overlap horizontally.
 *
 * pipeline_timings JSONB keys from the API:
 *   chatbot_loaded, conversation_ready,
 *   get_history, save_message, check_handoff,    ← parallel group
 *   rag_context, lead_lookup, memory_fetch,      ← parallel group
 *   rag_embedding, rag_similarity, rag_live_fetch, ← sequential within rag_context
 *   prompts_built,
 *   first_token, stream_complete (streaming) OR generate (non-streaming)
 */

const WATERFALL_STAGE_ORDER = [
  { key: 'chatbot_loaded', label: 'Load Chatbot', color: '#94a3b8', indent: 0 },
  { key: 'validate_and_parse', label: 'Validate & Parse', color: '#b0bec5', indent: 0 },
  { key: 'conversation_ready', label: 'Get Conversation', color: '#a78bfa', indent: 0 },
  { key: 'setup_pipeline', label: 'Pipeline Setup', color: '#8892a0', indent: 0 },
  // Parallel group: history + save + handoff
  { key: 'get_history', label: 'Get History', color: '#818cf8', indent: 1 },
  { key: 'save_message', label: 'Save Message', color: '#7c3aed', indent: 1 },
  { key: 'check_handoff', label: 'Check Handoff', color: '#a855f7', indent: 1 },
  // Attachments processing (between history and RAG)
  { key: 'attachments', label: 'Process Attachments', color: '#64748b', indent: 0 },
  // Parallel group: RAG sub-stages + lead + memory
  // RAG sub-stages are sequential within the RAG call but run in parallel with lead + memory
  { key: 'rag_embedding', label: 'RAG: Embedding', color: '#f59e0b', indent: 1 },
  { key: 'rag_similarity', label: 'RAG: Similarity Search', color: '#f97316', indent: 1 },
  { key: 'rag_live_fetch', label: 'RAG: Live Fetch', color: '#ef4444', indent: 1 },
  { key: 'rag_formatting', label: 'RAG: Formatting', color: '#fb923c', indent: 1 },
  { key: 'lead_lookup', label: 'Lead Lookup', color: '#8b5cf6', indent: 1 },
  { key: 'memory_fetch', label: 'Memory Fetch', color: '#a78bfa', indent: 1 },
  // Sequential
  { key: 'prompts_built', label: 'Build Prompts', color: '#10b981', indent: 0 },
  { key: 'first_token', label: 'First Token (TTFT)', color: '#0ea5e9', indent: 0 },
  { key: 'stream_complete', label: 'Stream Complete', color: '#6366f1', indent: 0 },
  { key: 'generate', label: 'Generate (non-stream)', color: '#6366f1', indent: 0 },
];

// Parallel group definitions for background shading
const PARALLEL_GROUPS = [
  { keys: ['get_history', 'save_message', 'check_handoff'], label: 'Promise.all' },
  { keys: ['rag_embedding', 'rag_similarity', 'rag_live_fetch', 'rag_formatting', 'lead_lookup', 'memory_fetch'], label: 'Promise.all' },
];

interface WaterfallStageRow {
  key: string;
  label: string;
  color: string;
  indent: number;
  start: number;
  end: number;
  duration: number;
  parallelGroup: number; // -1 if not in a group
}

/**
 * Fallback: synthesize pipeline_timings from legacy _ms columns.
 *
 * IMPORTANT: The legacy columns are CUMULATIVE timestamps from request start,
 * NOT durations. e.g. first_token_ms=1200 means the first token arrived 1200ms
 * into the request, not that TTFT took 1200ms.
 *
 * RAG sub-columns (rag_embedding_ms, rag_similarity_ms, rag_live_fetch_ms)
 * are cumulative from RAG start, not request start.
 */
function synthesizeTimingsFromLegacy(row: PerfRow): Record<string, StageSpan> {
  const pt: Record<string, StageSpan> = {};

  const c = (v: number | null) => v ?? 0; // coerce null to 0

  // Sequential stages — each starts where the previous ended
  const loadEnd = c(row.chatbot_loaded_ms);
  const convEnd = c(row.conversation_ready_ms);
  const histEnd = c(row.history_msg_handoff_ms);
  const promptsEnd = c(row.prompts_built_ms);
  const ttftEnd = c(row.first_token_ms);
  const streamEnd = c(row.stream_complete_ms);

  if (loadEnd > 0)
    pt['chatbot_loaded'] = { start: 0, end: loadEnd };
  if (convEnd > loadEnd)
    pt['conversation_ready'] = { start: loadEnd, end: convEnd };

  // Parallel group: history + save + handoff (combined duration = histEnd - convEnd)
  const histDur = histEnd - convEnd;
  if (histDur > 0) {
    pt['get_history'] = { start: convEnd, end: histEnd };
    pt['save_message'] = { start: convEnd, end: convEnd + Math.round(histDur * 0.7) };
    pt['check_handoff'] = { start: convEnd, end: convEnd + Math.round(histDur * 0.5) };
  }

  // RAG sub-stages — cumulative from RAG start.
  // In the old pipeline, RAG started after history + attachments processing.
  // We don't have a separate attachments_ms, so we compute RAG start by working
  // backwards from prompts_built_ms: ragStart = promptsEnd - ragTotalCum - promptsBuildTime.
  // promptsBuildTime is tiny (~1-5ms), so approximate as promptsEnd - ragTotalCum.
  const embCum = c(row.rag_embedding_ms);   // cumulative from RAG start
  const simCum = c(row.rag_similarity_ms);   // cumulative from RAG start
  const liveCum = c(row.rag_live_fetch_ms);  // cumulative from RAG start
  const ragTotalCum = c(row.rag_total_ms);   // cumulative from RAG start

  // Work backwards: prompts were built right after RAG finished
  const ragStart = ragTotalCum > 0
    ? Math.max(histEnd, promptsEnd - ragTotalCum - 5) // 5ms estimate for prompt building
    : histEnd;

  // Show attachments processing in the gap between history and RAG
  if (ragStart > histEnd + 10) {
    pt['attachments'] = { start: histEnd, end: ragStart };
  }

  if (embCum > 0)
    pt['rag_embedding'] = { start: ragStart, end: ragStart + embCum };
  if (simCum > embCum)
    pt['rag_similarity'] = { start: ragStart + embCum, end: ragStart + simCum };
  if (row.live_fetch_triggered && liveCum > simCum)
    pt['rag_live_fetch'] = { start: ragStart + simCum, end: ragStart + liveCum };

  // Formatting = gap between last RAG sub-stage and RAG total
  const lastRagSub = row.live_fetch_triggered ? liveCum : simCum;
  if (ragTotalCum > lastRagSub)
    pt['rag_formatting'] = { start: ragStart + lastRagSub, end: ragStart + ragTotalCum };

  // Lead + Memory run in parallel with RAG
  if (ragTotalCum > 0) {
    pt['lead_lookup'] = { start: ragStart, end: ragStart + Math.min(Math.round(ragTotalCum * 0.15), 50) };
    pt['memory_fetch'] = { start: ragStart, end: ragStart + Math.min(Math.round(ragTotalCum * 0.1), 30) };
  }

  // Sequential stages after RAG — these are cumulative from request start
  const ragEnd = ragStart + ragTotalCum;
  if (promptsEnd > ragEnd)
    pt['prompts_built'] = { start: ragEnd, end: promptsEnd };
  else if (promptsEnd > 0)
    pt['prompts_built'] = { start: ragEnd, end: ragEnd + 2 }; // minimal bar

  if (ttftEnd > promptsEnd)
    pt['first_token'] = { start: Math.max(promptsEnd, ragEnd), end: ttftEnd };
  if (streamEnd > ttftEnd)
    pt['stream_complete'] = { start: ttftEnd, end: streamEnd };

  return pt;
}

function getWaterfallRows(row: PerfRow): WaterfallStageRow[] {
  // Use pipeline_timings JSONB if available, otherwise synthesize from legacy columns.
  // If pipeline_timings exists but is missing RAG sub-stages (written by older code),
  // supplement it with synthesized data from legacy _ms columns.
  let pt = row.pipeline_timings ? { ...row.pipeline_timings } : null;

  if (pt) {
    // Check if RAG sub-stages are missing from the JSONB data
    const hasRagSubs = pt['rag_embedding'] || pt['rag_similarity'] || pt['rag_live_fetch'];
    if (!hasRagSubs && (row.rag_embedding_ms || row.rag_similarity_ms)) {
      // Synthesize RAG sub-stages from legacy columns and merge them in
      const legacy = synthesizeTimingsFromLegacy(row);
      for (const key of ['rag_embedding', 'rag_similarity', 'rag_live_fetch', 'rag_formatting', 'lead_lookup', 'memory_fetch']) {
        if (legacy[key] && !pt[key]) pt[key] = legacy[key];
      }
    }
    // Also fill in any other missing stages from legacy data
    if (!pt['prompts_built'] && row.prompts_built_ms) {
      const legacy = synthesizeTimingsFromLegacy(row);
      for (const key of ['prompts_built', 'first_token', 'stream_complete']) {
        if (legacy[key] && !pt[key]) pt[key] = legacy[key];
      }
    }
  } else {
    pt = synthesizeTimingsFromLegacy(row);
  }

  if (!pt || Object.keys(pt).length === 0) return [];

  const rows: WaterfallStageRow[] = [];

  for (const stage of WATERFALL_STAGE_ORDER) {
    const span = pt[stage.key];
    if (!span || span.end === undefined) continue;
    // Skip stages with invalid/corrupted timing values
    if (span.start < 0 || span.end < 0 || span.end < span.start) continue;

    // Determine parallel group index
    let parallelGroup = -1;
    PARALLEL_GROUPS.forEach((g, gi) => {
      if (g.keys.includes(stage.key)) parallelGroup = gi;
    });

    rows.push({
      key: stage.key,
      label: stage.label,
      color: stage.color,
      indent: stage.indent,
      start: span.start,
      end: span.end,
      duration: Math.round(span.end - span.start),
      parallelGroup,
    });
  }

  // Detect gaps > 10ms between stages and insert "Overhead" bars
  if (rows.length > 1) {
    const sorted = [...rows].sort((a, b) => a.start - b.start);
    let maxEnd = 0;
    const gaps: Array<{ start: number; end: number }> = [];
    for (const stage of sorted) {
      if (stage.start > maxEnd + 10) {
        gaps.push({ start: maxEnd, end: stage.start });
      }
      maxEnd = Math.max(maxEnd, stage.end);
    }
    // Insert in reverse order to preserve array indices
    for (let gi = gaps.length - 1; gi >= 0; gi--) {
      const gap = gaps[gi];
      const idx = rows.findIndex(s => s.start >= gap.end);
      const overhead: WaterfallStageRow = {
        key: `overhead_${gi}`,
        label: 'Overhead',
        color: '#9ca3af',
        indent: 0,
        start: gap.start,
        end: gap.end,
        duration: Math.round(gap.end - gap.start),
        parallelGroup: -1,
      };
      if (idx >= 0) rows.splice(idx, 0, overhead);
      else rows.push(overhead);
    }
  }

  return rows;
}

// Tooltip descriptions for each waterfall stage
const STAGE_TOOLTIPS: Record<string, string> = {
  chatbot_loaded: 'Fetches chatbot config, system prompt, and knowledge source metadata from the database',
  validate_and_parse: 'Validates request input, checks chatbot publish status and message limits, authenticates API key if provided, and parses the message payload',
  conversation_ready: 'Finds or creates the conversation record, loads visitor session context, and handles welcome/proactive messages',
  setup_pipeline: 'Detects language preferences, awaits RAG pre-work (embedding prework started during chatbot load), and configures the parallel processing pipeline',
  get_history: 'Loads recent message history from the database for conversation context (runs in parallel)',
  save_message: 'Saves the incoming user message to the database (runs in parallel)',
  check_handoff: 'Checks if a live agent handoff is active for this conversation (runs in parallel)',
  attachments: 'Processes uploaded files — fetches images for AI vision and extracts text from PDFs, DOCX, and CSV files',
  rag_embedding: 'Generates a vector embedding of the user\'s message via the OpenAI embeddings API, and looks up priority knowledge sources (runs in parallel)',
  rag_similarity: 'Queries pgvector for the most relevant knowledge chunks using cosine similarity, and fetches priority chunks (runs in parallel)',
  rag_live_fetch: 'Fetches live content from pinned URLs when knowledge chunk confidence is below threshold. Only triggered when similarity scores are low.',
  rag_formatting: 'Merges, deduplicates, and formats knowledge chunks and live content into the final context text for the AI prompt',
  lead_lookup: 'Looks up lead/visitor data from pre-chat form submissions (runs in parallel with RAG)',
  memory_fetch: 'Retrieves conversation memory for returning visitors (runs in parallel with RAG)',
  prompts_built: 'Assembles the full system prompt with knowledge context, conversation memory, user data, language settings, and security rules',
  first_token: 'Time waiting for the AI model to process the prompt and return the first token. This is what the user perceives as "thinking time"',
  stream_complete: 'Time from first token until the full AI response has finished streaming to the user',
  generate: 'Time for the AI model to generate the complete response (non-streaming mode)',
};

// Firefox-style per-request waterfall: each stage = one row, parallel stages overlap on time axis
function RequestWaterfall({
  row,
  onClose,
}: {
  row: PerfRow;
  onClose: () => void;
}) {
  const stages = useMemo(() => getWaterfallRows(row), [row]);
  const total = row.total_ms ?? 1;
  const scaleMax = total * 1.05;

  // Time axis ticks
  const ticks = useMemo(() => {
    const count = 6;
    const step = Math.ceil(scaleMax / count / 50) * 50 || 50;
    const result: number[] = [];
    for (let t = 0; t <= scaleMax; t += step) result.push(t);
    return result;
  }, [scaleMax]);

  const ROW_H = 28;
  const BAR_H = 18;
  const LABEL_W = 180;

  if (stages.length === 0) {
    return (
      <div className="border-t border-secondary-700 pt-4 mt-2 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-secondary-100">
            Request: {new Date(row.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </h4>
          <button onClick={onClose} className="text-secondary-400 hover:text-secondary-200">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-secondary-500">
          No per-stage timing data available for this request. New requests will include detailed pipeline timings.
        </p>
        <RequestMetadata row={row} />
        <MessagePreview userMessage={row.user_message} assistantResponse={row.assistant_response} />
      </div>
    );
  }

  // Identify parallel group row ranges for background shading
  const groupBands: Array<{ startRow: number; endRow: number; groupIdx: number }> = [];
  let currentGroup = -1;
  let bandStart = 0;
  stages.forEach((s, i) => {
    if (s.parallelGroup !== currentGroup) {
      if (currentGroup >= 0) groupBands.push({ startRow: bandStart, endRow: i - 1, groupIdx: currentGroup });
      currentGroup = s.parallelGroup;
      bandStart = i;
    }
  });
  if (currentGroup >= 0) groupBands.push({ startRow: bandStart, endRow: stages.length - 1, groupIdx: currentGroup });

  return (
    <div className="border-t border-secondary-700 pt-4 mt-2 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-secondary-100">
            Request: {new Date(row.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </h4>
          <div className="flex gap-3 text-[10px] text-secondary-500 mt-0.5">
            <Tooltip content="End-to-end time from receiving the user message to completing the full response" side="bottom">
              <span className="cursor-help inline-flex items-center gap-0.5">Total: {total}ms <Info className="w-2.5 h-2.5" /></span>
            </Tooltip>
            <Tooltip content="Time to First Token — the perceived 'thinking time' before text starts streaming" side="bottom">
              <span className="cursor-help inline-flex items-center gap-0.5">TTFT: {row.first_token_ms ?? '—'}ms <Info className="w-2.5 h-2.5" /></span>
            </Tooltip>
            <Tooltip content="Total time for the knowledge retrieval pipeline (embedding + search + live fetch + formatting)" side="bottom">
              <span className="cursor-help inline-flex items-center gap-0.5">RAG: {row.rag_total_ms ?? '—'}ms <Info className="w-2.5 h-2.5" /></span>
            </Tooltip>
          </div>
        </div>
        <button onClick={onClose} className="text-secondary-400 hover:text-secondary-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Waterfall chart — fits container, no horizontal scroll */}
      <div className="flex rounded bg-secondary-100 dark:bg-secondary-900/50 overflow-hidden">
        {/* Left: stage labels with tooltips */}
        <div className="flex-shrink-0" style={{ width: LABEL_W }}>
          <div className="h-5 border-b border-secondary-700" />
          {stages.map((s) => (
            <Tooltip
              key={s.key}
              content={STAGE_TOOLTIPS[s.key] || s.label}
              side="right"
            >
              <div
                className="flex items-center gap-1.5 px-2 border-b border-secondary-200 dark:border-secondary-800/30 cursor-help"
                style={{ height: ROW_H, paddingLeft: 8 + s.indent * 16 }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-secondary-300 truncate">{s.label}</span>
                <Info className="w-2.5 h-2.5 text-secondary-600 flex-shrink-0 ml-auto" />
              </div>
            </Tooltip>
          ))}
        </div>

        {/* Right: time axis + bars — uses percentage positioning, no overflow */}
        <div className="flex-1 min-w-0">
          {/* Time axis */}
          <div className="relative h-5 border-b border-secondary-700">
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute text-[8px] text-secondary-500 -translate-x-1/2"
                style={{ left: `${(t / scaleMax) * 100}%`, top: 3 }}
              >
                {t >= 1000 ? `${(t / 1000).toFixed(1)}s` : `${t}ms`}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="relative" style={{ height: stages.length * ROW_H }}>
            {/* Grid lines */}
            {ticks.map((t) => (
              <div
                key={t}
                className="absolute top-0 bottom-0 border-l border-secondary-200 dark:border-secondary-800/40"
                style={{ left: `${(t / scaleMax) * 100}%` }}
              />
            ))}

            {/* Parallel group background bands */}
            {groupBands.map((band, bi) => (
              <div
                key={bi}
                className="absolute left-0 right-0 bg-blue-500/[0.03]"
                style={{
                  top: band.startRow * ROW_H,
                  height: (band.endRow - band.startRow + 1) * ROW_H,
                }}
              />
            ))}

            {/* Stage bars */}
            {stages.map((s, i) => {
              const leftPct = (s.start / scaleMax) * 100;
              const widthPct = ((s.end - s.start) / scaleMax) * 100;
              const pct = ((s.duration / total) * 100).toFixed(1);

              return (
                <div
                  key={s.key}
                  className="absolute border-b border-secondary-200 dark:border-secondary-800/30"
                  style={{ top: i * ROW_H, height: ROW_H, left: 0, right: 0 }}
                >
                  {/* The bar */}
                  <div
                    className="absolute rounded-sm hover:brightness-125 transition-all cursor-default"
                    style={{
                      left: `${leftPct}%`,
                      width: `${Math.max(0.4, widthPct)}%`,
                      height: BAR_H,
                      top: (ROW_H - BAR_H) / 2,
                      backgroundColor: s.color,
                    }}
                    title={`${s.label}\nStart: ${s.start}ms → End: ${s.end}ms\nDuration: ${s.duration}ms (${pct}% of total)\n\n${STAGE_TOOLTIPS[s.key] || ''}`}
                  />
                  {/* Duration label — positioned inside the bar if wide enough, otherwise to the right */}
                  {widthPct > 5 ? (
                    <span
                      className="absolute text-[8px] font-mono text-white/80 whitespace-nowrap pointer-events-none"
                      style={{
                        left: `${leftPct + 0.5}%`,
                        top: (ROW_H - 10) / 2,
                      }}
                    >
                      {s.duration}ms
                    </span>
                  ) : (
                    <span
                      className="absolute text-[8px] font-mono text-secondary-500 whitespace-nowrap pointer-events-none"
                      style={{
                        left: `${Math.min(leftPct + Math.max(0.4, widthPct) + 0.3, 94)}%`,
                        top: (ROW_H - 10) / 2,
                      }}
                    >
                      {s.duration}ms
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <RequestMetadata row={row} />
      <MessagePreview userMessage={row.user_message} assistantResponse={row.assistant_response} />
    </div>
  );
}

// Shared metadata cards
function RequestMetadata({ row }: { row: PerfRow }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-secondary-100 dark:bg-secondary-800/40 rounded px-3 py-2">
        <p className="text-[10px] text-secondary-400">Model</p>
        <p className="text-xs text-secondary-100 font-mono">{row.model ?? '—'}</p>
      </div>
      <div className="bg-secondary-100 dark:bg-secondary-800/40 rounded px-3 py-2">
        <p className="text-[10px] text-secondary-400">Message</p>
        <p className="text-xs text-secondary-100 font-mono">{row.message_length} chars</p>
      </div>
      <div className="bg-secondary-100 dark:bg-secondary-800/40 rounded px-3 py-2">
        <p className="text-[10px] text-secondary-400">Response</p>
        <p className="text-xs text-secondary-100 font-mono">{row.response_length} chars</p>
      </div>
      <div className="bg-secondary-100 dark:bg-secondary-800/40 rounded px-3 py-2">
        <p className="text-[10px] text-secondary-400">RAG</p>
        <p className="text-xs text-secondary-100 font-mono">
          {row.rag_chunks_count} chunks · {row.rag_confidence?.toFixed(2) ?? '—'} conf
          {row.live_fetch_triggered && <span className="text-red-400 ml-1">· live fetch</span>}
        </p>
      </div>
    </div>
  );
}

// Overview waterfall: one compact row per request, click to expand
function WaterfallOverview({
  rows,
  selectedIndex,
  onSelect,
  avgTotal,
}: {
  rows: PerfRow[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  avgTotal: number;
}) {
  const maxTotal = useMemo(() => Math.max(...rows.map((r) => r.total_ms ?? 0), 1), [rows]);
  const scaleMax = maxTotal * 1.05;

  const ticks = useMemo(() => {
    const count = 6;
    const step = Math.ceil(scaleMax / count / 100) * 100 || 50;
    const result: number[] = [];
    for (let t = 0; t <= scaleMax; t += step) result.push(t);
    return result;
  }, [scaleMax]);

  const ROW_H = 28;
  const BAR_H = 18;

  return (
    <div className="flex">
      {/* Left labels */}
      <div className="flex-shrink-0 w-36">
        <div className="h-6 border-b border-secondary-700" />
        {rows.map((row, i) => {
          const isSelected = selectedIndex === i;
          const isAnomaly = avgTotal > 0 && (row.total_ms ?? 0) > avgTotal * 2;
          return (
            <div
              key={i}
              className={`flex items-center justify-between px-2 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-100 dark:bg-blue-950/30 border-l-2 border-blue-500'
                  : isAnomaly
                    ? 'border-l-2 border-red-500/50 hover:bg-secondary-100 dark:hover:bg-secondary-800/30'
                    : 'border-l-2 border-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800/30'
              }`}
              style={{ height: ROW_H }}
              onClick={() => onSelect(isSelected ? null : i)}
            >
              <span className="text-[10px] text-secondary-400 truncate">
                {new Date(row.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] font-mono text-secondary-300 ml-1 flex items-center gap-0.5">
                {isAnomaly && <AlertTriangle className="w-2.5 h-2.5 text-red-400" />}
                {row.total_ms ?? 0}ms
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart area — no horizontal scroll, percentage-based */}
      <div className="flex-1 min-w-0">
        <div className="relative h-6 border-b border-secondary-700">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute text-[9px] text-secondary-500 -translate-x-1/2"
              style={{ left: `${(t / scaleMax) * 100}%`, top: 4 }}
            >
              {t >= 1000 ? `${(t / 1000).toFixed(1)}s` : `${t}ms`}
            </span>
          ))}
        </div>

        <div className="relative" style={{ height: rows.length * ROW_H }}>
          {/* Avg line */}
          {avgTotal > 0 && (
            <Tooltip content={`Average total response time: ${avgTotal}ms`} side="right">
              <div
                className="absolute top-0 bottom-0 border-l border-dashed border-yellow-500/40 z-10 cursor-help"
                style={{ left: `${(avgTotal / scaleMax) * 100}%` }}
              >
                <span className="absolute -top-5 text-[8px] text-yellow-500/60 -translate-x-1/2 whitespace-nowrap">avg</span>
              </div>
            </Tooltip>
          )}

          {/* Grid */}
          {ticks.map((t) => (
            <div key={t} className="absolute top-0 bottom-0 border-l border-secondary-200 dark:border-secondary-800/50" style={{ left: `${(t / scaleMax) * 100}%` }} />
          ))}

          {rows.map((row, i) => {
            const isSelected = selectedIndex === i;
            const stages = getWaterfallRows(row);

            return (
              <div
                key={i}
                className={`absolute left-0 right-0 cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-100 dark:bg-blue-950/30' : 'hover:bg-secondary-100 dark:hover:bg-secondary-800/30'
                }`}
                style={{ top: i * ROW_H, height: ROW_H }}
                onClick={() => onSelect(isSelected ? null : i)}
              >
                {stages.length > 0 ? (
                  stages.filter((s) => s.parallelGroup < 0 || s.indent <= 1).map((s) => {
                    const leftPct = (s.start / scaleMax) * 100;
                    const widthPct = ((s.end - s.start) / scaleMax) * 100;
                    return (
                      <div
                        key={s.key}
                        className="absolute rounded-sm hover:brightness-125 transition-all"
                        style={{
                          left: `${leftPct}%`,
                          width: `${Math.max(0.3, widthPct)}%`,
                          height: BAR_H,
                          top: (ROW_H - BAR_H) / 2,
                          backgroundColor: s.color,
                        }}
                        title={`${s.label}: ${s.duration}ms (${((s.duration / (row.total_ms ?? 1)) * 100).toFixed(1)}%)\n${s.start}ms → ${s.end}ms\n\n${STAGE_TOOLTIPS[s.key] || ''}`}
                      />
                    );
                  })
                ) : (
                  <div
                    className="absolute rounded-sm bg-secondary-500"
                    style={{
                      left: 0,
                      width: `${((row.total_ms ?? 0) / scaleMax) * 100}%`,
                      height: BAR_H,
                      top: (ROW_H - BAR_H) / 2,
                    }}
                    title={`Total: ${row.total_ms}ms — click to see stage breakdown`}
                  />
                )}

                <div className="absolute left-0 right-0 border-b border-secondary-200 dark:border-secondary-800/30" style={{ bottom: 0 }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Stage legend
function WaterfallLegend() {
  const legendItems = [
    ...WATERFALL_STAGE_ORDER
      .filter((s) => !['generate'].includes(s.key)) // hide non-streaming variant from legend
      .map((s) => ({ key: s.key, label: s.label, color: s.color })),
    { key: 'overhead', label: 'Overhead', color: '#9ca3af' },
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {legendItems.map((s) => (
        <div key={s.key} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
          <span className="text-[10px] text-secondary-400">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// Simple bar chart component
function BarChart({ data, maxValue }: { data: Array<{ label: string; value: number; color: string; tooltip?: string }>; maxValue: number }) {
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          {item.tooltip ? (
            <Tooltip content={item.tooltip} side="top">
              <span className="text-xs text-secondary-500 dark:text-secondary-400 w-40 text-right truncate cursor-help inline-flex items-center justify-end gap-1">
                {item.label} <Info className="w-3 h-3 flex-shrink-0" />
              </span>
            </Tooltip>
          ) : (
            <span className="text-xs text-secondary-500 dark:text-secondary-400 w-40 text-right truncate" title={item.label}>
              {item.label}
            </span>
          )}
          <div className="flex-1 h-6 bg-secondary-100 dark:bg-secondary-800 rounded overflow-hidden">
            <div
              className="h-full rounded transition-all duration-300"
              style={{
                width: `${Math.max(1, (item.value / maxValue) * 100)}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <span className="text-xs font-mono text-secondary-700 dark:text-secondary-300 w-16 text-right">
            {item.value}ms
          </span>
        </div>
      ))}
    </div>
  );
}

// Sparkline-style timeline chart
function TimelineChart({ hourly, field }: { hourly: Array<Record<string, any>>; field: string }) {
  if (hourly.length === 0) return null;

  const values = hourly.map((h) => h[field] ?? 0);
  const max = Math.max(...values, 1);
  const barWidth = Math.max(2, Math.min(12, Math.floor(400 / hourly.length)));

  return (
    <div className="flex items-end gap-px h-16" title={STAGE_LABELS[field]?.label || field}>
      {hourly.map((h, i) => {
        const val = h[field] ?? 0;
        const heightPct = (val / max) * 100;
        return (
          <div
            key={i}
            className="rounded-t transition-all duration-200 hover:opacity-80"
            style={{
              width: barWidth,
              height: `${Math.max(2, heightPct)}%`,
              backgroundColor: STAGE_LABELS[field]?.color || '#6366f1',
            }}
            title={`${h.hour?.substring(5, 16) || ''}: ${val}ms avg (${h.count} reqs)`}
          />
        );
      })}
    </div>
  );
}

function filtersFromSearchParams(sp: URLSearchParams): PerformanceFilters {
  const days = sp.get('days');
  return {
    days: days !== null ? parseInt(days) : (sp.get('from') ? null : DEFAULT_FILTERS.days),
    from: sp.get('from') || null,
    to: sp.get('to') || null,
    models: sp.get('models') ? sp.get('models')!.split(',').filter(Boolean) : [],
    liveFetchTriggered: sp.get('live_fetch') === 'true' ? true : null,
    slowOnly: sp.get('slow') === 'true',
  };
}

function filtersToSearchParams(filters: PerformanceFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.days !== null) params.set('days', String(filters.days));
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.models.length > 0) params.set('models', filters.models.join(','));
  if (filters.liveFetchTriggered === true) params.set('live_fetch', 'true');
  if (filters.slowOnly) params.set('slow', 'true');
  if (page > 1) params.set('page', String(page));
  return params.toString();
}

export default function PerformancePage({ params }: PerformancePageProps) {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    }>
      <PerformancePageInner params={params} />
    </Suspense>
  );
}

function PerformancePageInner({ params }: PerformancePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<PerfData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PerformanceFilters>(() => filtersFromSearchParams(searchParams));
  const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1'));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchData = useCallback(async (f: PerformanceFilters, p: number) => {
    setLoading(true);
    try {
      const apiParams = new URLSearchParams();
      if (f.days !== null) apiParams.set('days', String(f.days));
      if (f.from) apiParams.set('from', f.from);
      if (f.to) apiParams.set('to', f.to);
      if (f.models.length > 0) apiParams.set('models', f.models.join(','));
      if (f.liveFetchTriggered === true) apiParams.set('live_fetch', 'true');
      apiParams.set('page', String(p));

      const res = await fetch(`/api/chatbots/${id}/performance?${apiParams}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();

      // Client-side slow filter (>2x avg)
      if (f.slowOnly && json.data?.averages?.total_ms) {
        const threshold = json.data.averages.total_ms * 2;
        json.data.recent = json.data.recent.filter((r: PerfRow) => (r.total_ms ?? 0) > threshold);
      }

      setData(json.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(filters, page); }, [filters, page, fetchData]);

  const handleFiltersChange = useCallback((newFilters: PerformanceFilters) => {
    setFilters(newFilters);
    setPage(1);
    setSelectedIndex(null);
    router.replace(`?${filtersToSearchParams(newFilters, 1)}`, { scroll: false });
  }, [router]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    setSelectedIndex(null);
    router.replace(`?${filtersToSearchParams(filters, newPage)}`, { scroll: false });
  }, [router, filters]);

  const avgBars = useMemo(() => {
    if (!data?.averages) return [];
    const fields = [
      'chatbot_loaded_ms', 'conversation_ready_ms', 'history_msg_handoff_ms',
      'rag_embedding_ms', 'rag_similarity_ms', 'rag_live_fetch_ms',
      'prompts_built_ms', 'first_token_ms', 'total_ms',
    ];
    return fields
      .filter((f) => data.averages[f] != null)
      .map((f) => ({
        label: STAGE_LABELS[f]?.label || f,
        value: data.averages[f]!,
        color: STAGE_LABELS[f]?.color || '#6366f1',
        tooltip: STAGE_LABELS[f]?.tooltip,
      }));
  }, [data]);

  const maxAvg = useMemo(() => Math.max(...avgBars.map((b) => b.value), 1), [avgBars]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <ChatbotPageHeader chatbotId={id} title="Performance" />
        <p className="text-secondary-600 dark:text-secondary-400 mt-3 mb-4">
          Response time analytics for each pipeline stage
        </p>
        <PerformanceFilterBar
          filters={filters}
          onChange={handleFiltersChange}
          availableModels={data?.available_models ?? []}
          loading={loading}
          onRefresh={() => fetchData(filters, page)}
        />
      </div>

      {!data || data.total_requests === 0 ? (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <Timer className="w-10 h-10 text-secondary-400 mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              No performance data yet
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 max-w-md">
              Send some messages to your chatbot to start collecting timing data.
              Each request automatically logs pipeline stage timings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-4 pb-4">
                <Tooltip content="Total number of chat messages processed matching the current filters" side="bottom">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 inline-flex items-center gap-1 cursor-help">
                    Total Requests <Info className="w-3 h-3" />
                  </p>
                </Tooltip>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{data.total_requests.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <Tooltip content="Average end-to-end response time across all filtered requests" side="bottom">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 inline-flex items-center gap-1 cursor-help">
                    Avg Total <Info className="w-3 h-3" />
                  </p>
                </Tooltip>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {data.averages.total_ms != null ? `${(data.averages.total_ms / 1000).toFixed(1)}s` : '—'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <Tooltip content="95th percentile response time — 95% of requests complete within this time. Better than average for catching outliers" side="bottom">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 inline-flex items-center gap-1 cursor-help">
                    P95 Total <Info className="w-3 h-3" />
                  </p>
                </Tooltip>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {data.p95_total_ms != null ? `${(data.p95_total_ms / 1000).toFixed(1)}s` : '—'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <Tooltip content="Average time until the first token appears. This is what the user perceives as 'thinking time'" side="bottom">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 inline-flex items-center gap-1 cursor-help">
                    Avg TTFT <Info className="w-3 h-3" />
                  </p>
                </Tooltip>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {data.averages.first_token_ms != null ? `${(data.averages.first_token_ms / 1000).toFixed(1)}s` : '—'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <Tooltip content="Average time for the knowledge retrieval pipeline: embedding + search + live fetch" side="bottom">
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 inline-flex items-center gap-1 cursor-help">
                    Avg RAG <Info className="w-3 h-3" />
                  </p>
                </Tooltip>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {data.averages.rag_total_ms != null ? `${data.averages.rag_total_ms}ms` : '—'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Waterfall Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pipeline Waterfall
                <Tooltip content="Network-style waterfall showing each pipeline stage as a horizontal bar along a time axis. Click a row to see detailed breakdown. Rows with a red left border are 2x slower than average." side="right">
                  <span className="cursor-help"><Info className="w-4 h-4 text-secondary-400" /></span>
                </Tooltip>
              </CardTitle>
              <CardDescription>
                Each row is a request. Click to expand the Firefox-style per-stage waterfall showing parallel and sequential stages.
              </CardDescription>
              <WaterfallLegend />
            </CardHeader>
            <CardContent>
              <WaterfallOverview
                rows={data.recent}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                avgTotal={data.averages.total_ms ?? 0}
              />
              {selectedIndex !== null && data.recent[selectedIndex] && (
                <RequestWaterfall
                  row={data.recent[selectedIndex]}
                  onClose={() => setSelectedIndex(null)}
                />
              )}
              <PerformancePagination
                currentPage={page}
                totalPages={data.total_pages}
                totalItems={data.total_requests}
                pageSize={data.page_size}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Average Pipeline Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Average Pipeline Breakdown</CardTitle>
                <CardDescription>Mean time per stage across {data.total_requests.toLocaleString()} requests</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={avgBars} maxValue={maxAvg} />
              </CardContent>
            </Card>

            {/* Timeline Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Total Response Time Over Time</CardTitle>
                <CardDescription>Hourly averages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Tooltip content={STAGE_LABELS.total_ms.tooltip} side="right">
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1 inline-flex items-center gap-1 cursor-help">
                      Total (ms) <Info className="w-3 h-3" />
                    </p>
                  </Tooltip>
                  <TimelineChart hourly={data.hourly} field="total_ms" />
                </div>
                <div>
                  <Tooltip content={STAGE_LABELS.first_token_ms.tooltip} side="right">
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1 inline-flex items-center gap-1 cursor-help">
                      First Token (ms) <Info className="w-3 h-3" />
                    </p>
                  </Tooltip>
                  <TimelineChart hourly={data.hourly} field="first_token_ms" />
                </div>
                <div>
                  <Tooltip content={STAGE_LABELS.rag_total_ms.tooltip} side="right">
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-1 inline-flex items-center gap-1 cursor-help">
                      RAG Total (ms) <Info className="w-3 h-3" />
                    </p>
                  </Tooltip>
                  <TimelineChart hourly={data.hourly} field="rag_total_ms" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Page {page} of {data.total_pages} ({data.total_requests.toLocaleString()} total requests)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-secondary-200 dark:border-secondary-700">
                      <th className="text-left py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">Time</th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="Time to fetch chatbot config and knowledge source metadata from the database" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">Load <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="Time to load message history, save the user message, and check live handoff status" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">History <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="Time to generate a vector embedding of the user's message via the OpenAI API" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">Embed <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="Time to search pgvector for the most relevant knowledge chunks by cosine similarity" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">Search <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="Time to fetch live URL content when knowledge chunks have low confidence. Red values indicate this was triggered" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">Live <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="Combined time for the entire retrieval pipeline (embedding + search + live fetch)" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">RAG <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="Time to First Token — how long until the AI starts streaming its reply. This is the perceived 'thinking time'" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">TTFT <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="End-to-end time from receiving the message to completing the full response" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">Total <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="Number of knowledge chunks retrieved from the vector database for this request" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">Chunks <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-secondary-500 dark:text-secondary-400">
                        <Tooltip content="Confidence score (0-1) of the best matching knowledge chunk. Lower scores may trigger live URL fetching" side="bottom">
                          <span className="inline-flex items-center gap-1 cursor-help">Conf <Info className="w-3 h-3" /></span>
                        </Tooltip>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-secondary-100 dark:border-secondary-800 cursor-pointer transition-colors ${
                          selectedIndex === i
                            ? 'bg-blue-50 dark:bg-blue-100 dark:bg-blue-950/30 border-l-2 border-l-blue-500'
                            : 'hover:bg-secondary-50 dark:hover:bg-secondary-800/50'
                        }`}
                        onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
                      >
                        <td className="py-1.5 px-2 text-secondary-600 dark:text-secondary-400 whitespace-nowrap">
                          {new Date(row.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="text-right py-1.5 px-2 font-mono">{row.chatbot_loaded_ms ?? '—'}</td>
                        <td className="text-right py-1.5 px-2 font-mono">{row.history_msg_handoff_ms ?? '—'}</td>
                        <td className="text-right py-1.5 px-2 font-mono">{row.rag_embedding_ms ?? '—'}</td>
                        <td className="text-right py-1.5 px-2 font-mono">{row.rag_similarity_ms ?? '—'}</td>
                        <td className="text-right py-1.5 px-2 font-mono">
                          {row.live_fetch_triggered ? (
                            <span className="text-red-500">{row.rag_live_fetch_ms ?? '—'}</span>
                          ) : '—'}
                        </td>
                        <td className="text-right py-1.5 px-2 font-mono font-medium">{row.rag_total_ms ?? '—'}</td>
                        <td className="text-right py-1.5 px-2 font-mono font-medium text-blue-600 dark:text-blue-400">{row.first_token_ms ?? '—'}</td>
                        <td className="text-right py-1.5 px-2 font-mono font-bold">{row.total_ms ?? '—'}</td>
                        <td className="text-right py-1.5 px-2">{row.rag_chunks_count}</td>
                        <td className="text-right py-1.5 px-2">{row.rag_confidence?.toFixed(2) ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PerformancePagination
                currentPage={page}
                totalPages={data.total_pages}
                totalItems={data.total_requests}
                pageSize={data.page_size}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
