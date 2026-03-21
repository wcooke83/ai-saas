/**
 * Conversation Memory System
 * Provides persistent cross-session memory for chatbot visitors.
 * Extracts key facts from conversations and stores them for future sessions.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { generate } from '@/lib/ai/provider';
import type { Message, ConversationMemory } from './types';

type SupabaseAny = any;

// ============================================
// RETRIEVE MEMORY
// ============================================

/**
 * Get stored memory for a visitor + chatbot pair.
 * Returns null if no memory exists or if memory has expired.
 */
export async function getUserMemory(
  visitorId: string,
  chatbotId: string,
  memoryDays: number = 30,
  supabaseClient?: SupabaseAny
): Promise<ConversationMemory | null> {
  const supabase = supabaseClient || createAdminClient() as SupabaseAny;

  const { data, error } = await supabase
    .from('conversation_memory')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .eq('visitor_id', visitorId)
    .single();

  if (error || !data) return null;

  // Check if memory has expired
  if (memoryDays > 0) {
    const lastAccessed = new Date(data.last_accessed);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - memoryDays);
    if (lastAccessed < expiryDate) {
      // Memory expired — clean it up
      await supabase
        .from('conversation_memory')
        .delete()
        .eq('id', data.id);
      return null;
    }
  }

  // Update last_accessed timestamp (fire-and-forget, don't block return)
  supabase
    .from('conversation_memory')
    .update({ last_accessed: new Date().toISOString() })
    .eq('id', data.id)
    .then(() => {})
    .catch(() => {});

  return {
    ...data,
    key_facts: Array.isArray(data.key_facts) ? data.key_facts : [],
  } as ConversationMemory;
}

// ============================================
// FORMAT MEMORY FOR PROMPT
// ============================================

/**
 * Format stored memory into a string suitable for injection into the system prompt.
 */
export function formatMemoryForPrompt(memory: ConversationMemory): string {
  const parts: string[] = [];

  if (memory.key_facts && memory.key_facts.length > 0) {
    parts.push('Key facts about this visitor from previous conversations:');
    memory.key_facts.forEach((fact) => {
      parts.push(`- ${fact}`);
    });
  }

  if (memory.summary) {
    parts.push('');
    parts.push(`Previous conversation summary: ${memory.summary}`);
  }

  return parts.join('\n');
}

// ============================================
// EXTRACT & STORE MEMORY
// ============================================

/**
 * Extract key facts and summary from a conversation and store/update memory.
 * This should be called asynchronously after a conversation exchange.
 */
export async function extractAndStoreMemory(
  visitorId: string,
  chatbotId: string,
  messages: Message[],
  existingMemory: ConversationMemory | null,
  supabaseClient?: SupabaseAny
): Promise<void> {
  const supabase = supabaseClient || createAdminClient() as SupabaseAny;

  // Need at least 2 messages (1 user + 1 assistant) to extract meaningful memory
  const relevantMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  );
  if (relevantMessages.length < 2) return;

  try {
    const extraction = await extractMemoryFromMessages(relevantMessages, existingMemory);
    if (!extraction) return;

    const now = new Date().toISOString();

    // Upsert memory record
    const { error } = await supabase
      .from('conversation_memory')
      .upsert(
        {
          chatbot_id: chatbotId,
          visitor_id: visitorId,
          key_facts: extraction.keyFacts,
          summary: extraction.summary,
          last_accessed: now,
          updated_at: now,
        },
        { onConflict: 'chatbot_id,visitor_id' }
      );

    if (error) {
      console.error('[Memory] Failed to store memory:', error.message);
    } else {
      console.log(`[Memory] Stored ${extraction.keyFacts.length} facts for visitor ${visitorId}`);
    }
  } catch (err: any) {
    console.error('[Memory] Memory extraction failed:', err?.message || err);
  }
}

interface MemoryExtraction {
  keyFacts: string[];
  summary: string;
}

/**
 * Use AI to extract key facts and a summary from conversation messages.
 */
async function extractMemoryFromMessages(
  messages: Message[],
  existingMemory: ConversationMemory | null
): Promise<MemoryExtraction | null> {
  // Format recent messages for the extraction prompt
  const recentMessages = messages.slice(-20); // Last 20 messages max
  const conversationText = recentMessages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const existingFactsText = existingMemory?.key_facts?.length
    ? `\nExisting known facts about this user:\n${existingMemory.key_facts.map((f) => `- ${f}`).join('\n')}`
    : '';

  const prompt = `Analyze this conversation and extract useful information to remember about the user for future conversations.

${existingFactsText}

Recent conversation:
${conversationText}

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "key_facts": ["fact 1", "fact 2"],
  "summary": "Brief 1-2 sentence summary of what was discussed"
}

Rules for key_facts:
- Extract the user's name, preferences, interests, and any personal details they shared
- Include specific business/product questions or needs they expressed
- Merge with existing facts if provided — update outdated ones, remove duplicates
- Maximum 10 facts total
- Each fact should be a short, clear statement
- Only include facts explicitly stated or clearly implied by the user
- Do NOT include generic observations like "user asked questions"`;

  try {
    const result = await generate(prompt, {
      provider: 'claude',
      model: 'fast',
      temperature: 0.1,
      maxTokens: 500,
    });

    // Parse the JSON response
    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[Memory] Could not parse extraction response');
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const keyFacts = Array.isArray(parsed.key_facts)
      ? parsed.key_facts.filter((f: unknown) => typeof f === 'string').slice(0, 10)
      : [];
    const summary = typeof parsed.summary === 'string' ? parsed.summary : '';

    if (keyFacts.length === 0 && !summary) return null;

    return { keyFacts, summary };
  } catch (err: any) {
    console.error('[Memory] AI extraction failed:', err?.message || err);
    return null;
  }
}

// ============================================
// CONVERSATION SUMMARIZATION
// ============================================

/**
 * Generate a summary for a conversation and store it.
 * Called when a conversation is completed or after significant exchanges.
 */
export async function summarizeConversation(
  conversationId: string,
  messages: Message[],
  supabaseClient?: SupabaseAny
): Promise<string | null> {
  const supabase = supabaseClient || createAdminClient() as SupabaseAny;

  const relevantMessages = messages.filter(
    (m) => m.role === 'user' || m.role === 'assistant'
  );
  if (relevantMessages.length < 2) return null;

  const conversationText = relevantMessages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  try {
    const result = await generate(
      `Summarize this conversation in 1-2 sentences. Focus on what the user needed and whether it was resolved.\n\n${conversationText}`,
      {
        provider: 'claude',
        model: 'fast',
        temperature: 0.1,
        maxTokens: 200,
      }
    );

    const summary = result.content.trim();

    // Store summary on the conversation
    await supabase
      .from('conversations')
      .update({ summary })
      .eq('id', conversationId);

    return summary;
  } catch (err: any) {
    console.error('[Memory] Summarization failed:', err?.message || err);
    return null;
  }
}

// ============================================
// CLEANUP
// ============================================

/**
 * Delete expired memory entries for a chatbot.
 * Should be called periodically (e.g., via cron or on chatbot load).
 */
export async function cleanupExpiredMemory(
  chatbotId: string,
  memoryDays: number,
  supabaseClient?: SupabaseAny
): Promise<number> {
  if (memoryDays <= 0) return 0; // 0 = unlimited retention

  const supabase = supabaseClient || createAdminClient() as SupabaseAny;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() - memoryDays);

  const { data, error } = await supabase
    .from('conversation_memory')
    .delete()
    .eq('chatbot_id', chatbotId)
    .lt('last_accessed', expiryDate.toISOString())
    .select('id');

  if (error) {
    console.error('[Memory] Cleanup failed:', error.message);
    return 0;
  }

  const count = data?.length || 0;
  if (count > 0) {
    console.log(`[Memory] Cleaned up ${count} expired memory entries for chatbot ${chatbotId}`);
  }
  return count;
}
