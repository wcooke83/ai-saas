/**
 * RAG (Retrieval Augmented Generation) System
 * Retrieves relevant context from knowledge base and builds prompts
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { generateQueryEmbedding, isEmbeddingsAvailable } from './knowledge/embeddings';
import type { Chatbot, Message, KnowledgeChunkMatch } from './types';

export interface RAGContext {
  chunks: KnowledgeChunkMatch[];
  systemPrompt: string;
  contextText: string;
}

/**
 * Get relevant context for a user query using vector similarity search
 */
export async function getRAGContext(
  chatbot: Chatbot,
  query: string,
  maxChunks: number = 5,
  similarityThreshold: number = 0.7
): Promise<RAGContext> {
  // Skip RAG if embeddings are not available (no valid OpenAI key)
  if (!isEmbeddingsAvailable()) {
    console.log('[RAG] Skipping RAG - embeddings not available (no valid OpenAI API key)');
    return {
      chunks: [],
      systemPrompt: chatbot.system_prompt,
      contextText: '',
    };
  }

  const supabase = createAdminClient() as any;

  // Generate embedding for the query
  const queryEmbedding = await generateQueryEmbedding(query);

  // Search for similar chunks using the database function
  const { data: chunks, error } = await supabase.rpc('match_knowledge_chunks', {
    p_chatbot_id: chatbot.id,
    p_query_embedding: JSON.stringify(queryEmbedding),
    p_match_threshold: similarityThreshold,
    p_match_count: maxChunks,
  });

  if (error) {
    console.error('RAG search error:', error);
    // Return empty context on error, let the chatbot still respond
    return {
      chunks: [],
      systemPrompt: chatbot.system_prompt,
      contextText: '',
    };
  }

  // Format context text from retrieved chunks
  const contextText = chunks && chunks.length > 0
    ? chunks
        .map((chunk: KnowledgeChunkMatch, i: number) =>
          `[${i + 1}] ${chunk.content}`
        )
        .join('\n\n')
    : '';

  return {
    chunks: chunks || [],
    systemPrompt: chatbot.system_prompt,
    contextText,
  };
}

/**
 * Build a prompt with RAG context for the AI model
 */
export function buildRAGPrompt(
  context: RAGContext,
  conversationHistory: Message[],
  userMessage: string
): string {
  const parts: string[] = [];

  // Add context if available
  if (context.contextText) {
    parts.push(`## Relevant Knowledge Base Context

The following information from the knowledge base may be helpful for answering the user's question:

${context.contextText}

---

Use this context to inform your response when relevant. If the context doesn't contain the answer, you can still respond based on your general knowledge, but indicate that you're not certain.`);
  }

  // Add conversation history
  if (conversationHistory.length > 0) {
    parts.push(`## Conversation History

${conversationHistory
  .slice(-10) // Keep last 10 messages to avoid token limits
  .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
  .join('\n\n')}`);
  }

  // Add current user message
  parts.push(`## Current Message

User: ${userMessage}`);

  return parts.join('\n\n');
}

/**
 * Build the full system prompt with context instructions
 */
export function buildSystemPrompt(chatbot: Chatbot, hasContext: boolean): string {
  let systemPrompt = chatbot.system_prompt;

  if (hasContext) {
    systemPrompt += `

## Instructions for Using Context

When the user asks a question:
1. First check if the provided knowledge base context contains relevant information
2. If it does, use that information to formulate your response
3. If the context is partially relevant, combine it with your general knowledge
4. If the context doesn't help, respond based on your training but mention you're not certain
5. Always maintain a helpful and conversational tone
6. If you truly don't know the answer, say so honestly rather than making things up`;
  }

  return systemPrompt;
}

/**
 * Format conversation history for AI model
 */
export function formatConversationHistory(
  messages: Message[]
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
    .map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));
}

/**
 * Check if a chatbot has any trained knowledge
 */
export async function hasKnowledgeBase(chatbotId: string): Promise<boolean> {
  const supabase = createAdminClient() as any;

  const { count, error } = await supabase
    .from('knowledge_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbotId);

  if (error) {
    console.error('Error checking knowledge base:', error);
    return false;
  }

  return (count ?? 0) > 0;
}

/**
 * Get a summary of the knowledge base for a chatbot
 */
export async function getKnowledgeBaseSummary(chatbotId: string): Promise<{
  totalSources: number;
  totalChunks: number;
  completedSources: number;
}> {
  const supabase = createAdminClient() as any;

  const [sourcesResult, chunksResult] = await Promise.all([
    supabase
      .from('knowledge_sources')
      .select('status', { count: 'exact' })
      .eq('chatbot_id', chatbotId),
    supabase
      .from('knowledge_chunks')
      .select('*', { count: 'exact', head: true })
      .eq('chatbot_id', chatbotId),
  ]);

  const sources = (sourcesResult.data || []) as Array<{ status: string }>;
  const completedSources = sources.filter((s) => s.status === 'completed').length;

  return {
    totalSources: sourcesResult.count || 0,
    totalChunks: chunksResult.count || 0,
    completedSources,
  };
}
