/**
 * Re-embed Detection
 * Checks whether a chatbot's knowledge sources have mismatched embedding providers.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { resolveEmbeddingConfig } from '@/lib/chatbots/knowledge/embeddings';

export type ReembedReason = 'null_providers' | 'mixed_providers' | 'provider_changed';

export interface ReembedStatus {
  needs_reembed: boolean;
  reembed_reason: ReembedReason | null;
}

const NO_REEMBED: ReembedStatus = { needs_reembed: false, reembed_reason: null };

/**
 * Check whether a single chatbot needs re-embedding.
 */
export async function checkReembedStatus(chatbotId: string): Promise<ReembedStatus> {
  const supabase = createAdminClient();

  const { data: sources } = await supabase
    .from('knowledge_sources')
    .select('embedding_provider')
    .eq('chatbot_id', chatbotId)
    .eq('status', 'completed')
    .gt('chunks_count', 0);

  if (!sources || sources.length === 0) return NO_REEMBED;

  const providers = new Set(sources.map(s => s.embedding_provider));

  if (providers.has(null)) {
    return { needs_reembed: true, reembed_reason: 'null_providers' };
  }

  if (providers.size > 1) {
    return { needs_reembed: true, reembed_reason: 'mixed_providers' };
  }

  // Single provider — check if it matches the currently resolved config
  const currentConfig = await resolveEmbeddingConfig();
  if (currentConfig) {
    const recordedProvider = [...providers][0];
    if (recordedProvider !== currentConfig.provider) {
      return { needs_reembed: true, reembed_reason: 'provider_changed' };
    }
  }

  return NO_REEMBED;
}

/**
 * Batch check re-embed status for multiple chatbots.
 * More efficient than calling checkReembedStatus per chatbot.
 */
export async function checkReembedStatusBatch(chatbotIds: string[]): Promise<Record<string, ReembedStatus>> {
  if (chatbotIds.length === 0) return {};

  const supabase = createAdminClient();

  const { data: rows } = await supabase
    .from('knowledge_sources')
    .select('chatbot_id, embedding_provider')
    .in('chatbot_id', chatbotIds)
    .eq('status', 'completed')
    .gt('chunks_count', 0);

  if (!rows || rows.length === 0) {
    return Object.fromEntries(chatbotIds.map(id => [id, NO_REEMBED]));
  }

  // Group by chatbot
  const grouped: Record<string, Set<string | null>> = {};
  for (const row of rows) {
    if (!grouped[row.chatbot_id]) grouped[row.chatbot_id] = new Set();
    grouped[row.chatbot_id].add(row.embedding_provider);
  }

  const currentConfig = await resolveEmbeddingConfig();
  const result: Record<string, ReembedStatus> = {};

  for (const id of chatbotIds) {
    const providers = grouped[id];
    if (!providers) {
      result[id] = NO_REEMBED;
      continue;
    }

    if (providers.has(null)) {
      result[id] = { needs_reembed: true, reembed_reason: 'null_providers' };
    } else if (providers.size > 1) {
      result[id] = { needs_reembed: true, reembed_reason: 'mixed_providers' };
    } else if (currentConfig && [...providers][0] !== currentConfig.provider) {
      result[id] = { needs_reembed: true, reembed_reason: 'provider_changed' };
    } else {
      result[id] = NO_REEMBED;
    }
  }

  return result;
}
