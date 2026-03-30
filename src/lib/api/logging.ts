/**
 * API Logging System
 * Logs all API calls with request/response details for debugging and auditing
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { getAppSettings } from '@/lib/settings';

export interface APILogEntry {
  user_id?: string;
  endpoint: string;
  method?: string;
  request_body?: Record<string, unknown>;
  response_body?: Record<string, unknown>;
  raw_ai_prompt?: string;
  raw_ai_response?: string;
  status_code?: number;
  provider?: string;
  model?: string;
  tokens_input?: number;
  tokens_output?: number;
  tokens_billed?: number;
  duration_ms?: number;
  ip_address?: string;
  user_agent?: string;
  error_message?: string;
}

/**
 * Log an API call to the database and increment usage.credits_used for the
 * user's current billing period if tokens were consumed on a successful call.
 */
export async function logAPICall(entry: APILogEntry): Promise<void> {
  try {
    // Use admin client to avoid session/cookie issues with API key auth
    const supabase = createAdminClient();

    const tokensInput = entry.tokens_input || 0;
    const tokensOutput = entry.tokens_output || 0;
    const tokensTotal = tokensInput + tokensOutput;

    await (supabase as any).from('api_logs').insert({
      user_id: entry.user_id,
      endpoint: entry.endpoint,
      method: entry.method || 'POST',
      request_body: entry.request_body,
      response_body: entry.response_body,
      raw_ai_prompt: entry.raw_ai_prompt,
      raw_ai_response: entry.raw_ai_response,
      status_code: entry.status_code,
      provider: entry.provider,
      model: entry.model,
      tokens_input: tokensInput,
      tokens_output: tokensOutput,
      // tokens_total is a GENERATED ALWAYS column (tokens_input + tokens_output) — not written here
      tokens_billed: entry.tokens_billed || 0,
      duration_ms: entry.duration_ms,
      ip_address: entry.ip_address,
      user_agent: entry.user_agent,
      error_message: entry.error_message,
    });

    // Increment usage.credits_used for successful calls with token consumption.
    // Only for authenticated users (user_id present), non-error responses, and
    // calls that actually consumed tokens.
    const isSuccess = !entry.status_code || entry.status_code < 400;
    if (entry.user_id && isSuccess && tokensTotal > 0) {
      const now = new Date().toISOString();
      const { data: usageRow } = await (supabase as any)
        .from('usage')
        .select('id, credits_used')
        .eq('user_id', entry.user_id)
        .lte('period_start', now)
        .gt('period_end', now)
        .maybeSingle();

      if (usageRow) {
        await (supabase as any)
          .from('usage')
          .update({ credits_used: (usageRow.credits_used || 0) + tokensTotal })
          .eq('id', usageRow.id);
      }
    }
  } catch (error) {
    // Don't fail the request if logging fails
    console.error('Failed to log API call:', error);
  }
}

/**
 * Calculate billed tokens by applying the multiplier
 */
export async function calculateBilledTokens(rawTokens: number): Promise<number> {
  const settings = await getAppSettings();
  const multiplier = settings?.token_multiplier || 1;
  return Math.ceil(rawTokens * multiplier);
}

/**
 * Get the current token multiplier
 */
export async function getTokenMultiplier(): Promise<number> {
  const settings = await getAppSettings();
  return settings?.token_multiplier || 1;
}
