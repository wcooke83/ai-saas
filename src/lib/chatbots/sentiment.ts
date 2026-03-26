/**
 * Sentiment & Loyalty Analysis Module
 * Analyzes completed conversations for sentiment and tracks visitor loyalty over time.
 * Owner-triggered: processes only unanalyzed conversations on demand.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import type { TypedSupabaseClient } from '@/lib/supabase/admin';
import { generate } from '@/lib/ai/provider';
import { getSentimentModel } from '@/lib/settings';
import type { Message, SentimentLabel, LoyaltyTrend } from './types';


// ============================================
// TYPES
// ============================================

export interface SentimentResult {
  score: number; // 1-5
  label: SentimentLabel;
  summary: string;
}

export interface ProcessResult {
  processed: number;
  failed: number;
  total_unanalyzed: number;
}

// ============================================
// ANALYZE A SINGLE CONVERSATION
// ============================================

/**
 * Use AI to analyze the sentiment of a conversation.
 * Returns a score (1-5), label, and short summary.
 */
export async function analyzeConversationSentiment(
  messages: Message[]
): Promise<SentimentResult | null> {
  const relevantMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  );

  // Need at least 2 messages to analyze meaningfully
  if (relevantMessages.length < 2) return null;

  const conversationText = relevantMessages
    .slice(-30) // Cap at 30 messages to control token usage
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `Analyze the sentiment of this customer conversation. Focus on the USER's emotional state, satisfaction level, and whether their issue was resolved.

Conversation:
${conversationText}

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "score": 3,
  "label": "neutral",
  "summary": "Brief 1-sentence explanation of the user's sentiment and outcome"
}

Scoring guide:
- 1 (very_negative): User is angry, frustrated, or left with their issue completely unresolved
- 2 (negative): User is dissatisfied, mildly frustrated, or issue only partially addressed
- 3 (neutral): User shows no strong emotion, or interaction was purely informational
- 4 (positive): User seems satisfied, issue was resolved, or they expressed thanks
- 5 (very_positive): User is enthusiastic, very grateful, or expressed strong satisfaction

Rules:
- Focus ONLY on the user's messages and tone, not the assistant's
- Consider whether the user's question/issue was actually resolved
- A short conversation with a quick factual answer is typically neutral (3)
- If the user said "thank you" or similar, lean positive (4)
- Only use extremes (1 or 5) for clearly strong emotions`;

  try {
    // Use admin-configured sentiment model, or fall back to system default
    const sentimentModel = await getSentimentModel();

    const result = await generate(prompt, {
      ...(sentimentModel ? { specificModel: sentimentModel } : {}),
      temperature: 0.1,
      maxTokens: 300,
    });

    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[Sentiment] Could not parse AI response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const score = Math.min(5, Math.max(1, Math.round(Number(parsed.score) || 3)));
    const labelMap: Record<number, SentimentLabel> = {
      1: 'very_negative',
      2: 'negative',
      3: 'neutral',
      4: 'positive',
      5: 'very_positive',
    };
    const label = labelMap[score] || 'neutral';
    const summary = typeof parsed.summary === 'string' ? parsed.summary.slice(0, 500) : '';

    return { score, label, summary };
  } catch (err: any) {
    console.error('[Sentiment] AI analysis failed:', err?.message || err);
    return null;
  }
}

// ============================================
// UPDATE VISITOR LOYALTY
// ============================================

/**
 * Recalculate loyalty for a visitor based on all their sentiment-analyzed conversations.
 */
export async function updateVisitorLoyalty(
  chatbotId: string,
  visitorId: string,
  supabaseClient?: TypedSupabaseClient
): Promise<void> {
  const supabase = supabaseClient ||createAdminClient();

  // Fetch all sentiment-analyzed conversations for this visitor, ordered by date
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('sentiment_score, sentiment_analyzed_at')
    .eq('chatbot_id', chatbotId)
    .eq('visitor_id', visitorId)
    .not('sentiment_analyzed_at', 'is', null)
    .order('created_at', { ascending: true });

  if (error || !conversations || conversations.length === 0) return;

  const scores: number[] = conversations
    .map((c: any) => c.sentiment_score)
    .filter((s: any) => typeof s === 'number');

  if (scores.length === 0) return;

  const totalSessions = scores.length;
  const avgSentiment = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
  const lastScore = scores[scores.length - 1];

  // Calculate trend: compare recent sessions vs older sessions
  let trend: LoyaltyTrend = 'stable';
  if (scores.length >= 2) {
    const midpoint = Math.floor(scores.length / 2);
    const olderAvg = scores.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint;
    const newerAvg = scores.slice(midpoint).reduce((a, b) => a + b, 0) / (scores.length - midpoint);
    const diff = newerAvg - olderAvg;

    if (diff >= 0.5) {
      trend = 'improving';
    } else if (diff <= -0.5) {
      trend = 'declining';
    }
  }

  // Convert avg sentiment to loyalty score (1-5)
  const loyaltyScore = Math.min(5, Math.max(1, Math.round(avgSentiment)));

  const now = new Date().toISOString();

  await supabase
    .from('visitor_loyalty')
    .upsert(
      {
        chatbot_id: chatbotId,
        visitor_id: visitorId,
        loyalty_score: loyaltyScore,
        loyalty_trend: trend,
        total_sessions: totalSessions,
        avg_sentiment: parseFloat(avgSentiment.toFixed(2)),
        last_sentiment_score: lastScore,
        updated_at: now,
      },
      { onConflict: 'chatbot_id,visitor_id' }
    );
}

// ============================================
// PROCESS UNANALYZED CONVERSATIONS
// ============================================

/**
 * Find and analyze all unprocessed conversations for a chatbot.
 * Called on demand by the chatbot owner from the dashboard.
 */
export async function processUnanalyzedConversations(
  chatbotId: string,
  supabaseClient?: TypedSupabaseClient
): Promise<ProcessResult> {
  const supabase = supabaseClient ||createAdminClient();

  // Find conversations without sentiment analysis that have at least 2 messages
  const { data: conversations, error: fetchError } = await supabase
    .from('conversations')
    .select('id, visitor_id, message_count')
    .eq('chatbot_id', chatbotId)
    .is('sentiment_analyzed_at', null)
    .gte('message_count', 2)
    .order('created_at', { ascending: false })
    .limit(50); // Process in batches of 50 to avoid timeouts

  if (fetchError || !conversations) {
    console.error('[Sentiment] Failed to fetch unanalyzed conversations:', fetchError?.message);
    return { processed: 0, failed: 0, total_unanalyzed: 0 };
  }

  const totalUnanalyzed = conversations.length;
  let processed = 0;
  let failed = 0;

  // Track unique visitors that were analyzed for loyalty updates
  const analyzedVisitors = new Set<string>();

  for (const conversation of conversations) {
    try {
      // Fetch messages for this conversation
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('id, role, content, created_at')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (msgError || !messages || messages.length < 2) {
        failed++;
        continue;
      }

      const result = await analyzeConversationSentiment(messages as Message[]);
      if (!result) {
        failed++;
        continue;
      }

      // Store sentiment on the conversation
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          sentiment_score: result.score,
          sentiment_label: result.label,
          sentiment_summary: result.summary,
          sentiment_analyzed_at: new Date().toISOString(),
        })
        .eq('id', conversation.id);

      if (updateError) {
        console.error(`[Sentiment] Failed to update conversation ${conversation.id}:`, updateError.message);
        failed++;
        continue;
      }

      processed++;

      // Track visitor for loyalty update
      if (conversation.visitor_id) {
        analyzedVisitors.add(conversation.visitor_id);
      }

      console.log(`[Sentiment] Analyzed conversation ${conversation.id}: score=${result.score} (${result.label})`);
    } catch (err: any) {
      console.error(`[Sentiment] Error processing conversation ${conversation.id}:`, err?.message || err);
      failed++;
    }
  }

  // Update loyalty for all affected visitors
  for (const visitorId of analyzedVisitors) {
    try {
      await updateVisitorLoyalty(chatbotId, visitorId, supabase);
    } catch (err: any) {
      console.error(`[Sentiment] Loyalty update failed for visitor ${visitorId}:`, err?.message || err);
    }
  }

  console.log(`[Sentiment] Batch complete: ${processed} processed, ${failed} failed, ${totalUnanalyzed} total`);
  return { processed, failed, total_unanalyzed: totalUnanalyzed };
}

// ============================================
// QUERY HELPERS
// ============================================

/**
 * Get count of unanalyzed conversations for a chatbot.
 */
export async function getUnanalyzedCount(
  chatbotId: string,
  supabaseClient?: TypedSupabaseClient
): Promise<number> {
  const supabase = supabaseClient ||createAdminClient();

  const { count, error } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbotId)
    .is('sentiment_analyzed_at', null)
    .gte('message_count', 2);

  if (error) return 0;
  return count || 0;
}

/**
 * Get sentiment summary stats for a chatbot.
 */
export async function getSentimentStats(
  chatbotId: string,
  supabaseClient?: TypedSupabaseClient
): Promise<{
  total_analyzed: number;
  avg_score: number;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
}> {
  const supabase = supabaseClient ||createAdminClient();

  const { data, error } = await supabase
    .from('conversations')
    .select('sentiment_score, sentiment_label')
    .eq('chatbot_id', chatbotId)
    .not('sentiment_analyzed_at', 'is', null);

  if (error || !data || data.length === 0) {
    return { total_analyzed: 0, avg_score: 0, positive_pct: 0, neutral_pct: 0, negative_pct: 0 };
  }

  const scores = data.map((d: any) => d.sentiment_score).filter((s: any) => typeof s === 'number');
  const total = scores.length;
  const avg = scores.reduce((a: number, b: number) => a + b, 0) / total;

  const positive = data.filter((d: any) => d.sentiment_label === 'positive' || d.sentiment_label === 'very_positive').length;
  const neutral = data.filter((d: any) => d.sentiment_label === 'neutral').length;
  const negative = data.filter((d: any) => d.sentiment_label === 'negative' || d.sentiment_label === 'very_negative').length;

  return {
    total_analyzed: total,
    avg_score: parseFloat(avg.toFixed(2)),
    positive_pct: total > 0 ? parseFloat(((positive / total) * 100).toFixed(1)) : 0,
    neutral_pct: total > 0 ? parseFloat(((neutral / total) * 100).toFixed(1)) : 0,
    negative_pct: total > 0 ? parseFloat(((negative / total) * 100).toFixed(1)) : 0,
  };
}
