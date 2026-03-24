/**
 * Help Article Generation
 * Generates structured help articles from knowledge source chunks via AI.
 * Also feeds generated articles back into the knowledge base as embedded chunks
 * so the chatbot can answer questions without live-fetching URLs.
 */

import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { generate } from '@/lib/ai/provider';
import { extractURL } from '@/lib/chatbots/knowledge/extractors/url';
import { chunkText } from '@/lib/chatbots/knowledge/chunker';
import { generateEmbeddings, resolveEmbeddingConfig } from '@/lib/chatbots/knowledge/embeddings';
import type { Json } from '@/types/database';

// Prompt-targeted generation: searches all knowledge for the answer to one specific question
const TARGETED_PROMPT = `You are a technical writer. You will be given a specific question and knowledge source content.
Your job is to find the answer to the question within the content and write a focused help article about it.

If the content does NOT contain relevant information to answer the question, respond with exactly: {"skip": true}

Otherwise, return a JSON object with exactly these fields:
- "title": A concise, descriptive title (under 100 chars)
- "summary": 1-2 sentence summary answering the question directly
- "body": Comprehensive article body in markdown format

Write clearly and concisely for end-users seeking self-service support.`;

// Fallback: generic article generation (used when no extraction prompts exist)
const GENERIC_PROMPT = `You are a technical writer. Given the following knowledge source content, generate a structured help article.

Return a JSON object with exactly these fields:
- "title": A concise, descriptive title (under 100 chars)
- "summary": 1-2 sentence summary
- "body": Comprehensive article body in markdown format

The article should be helpful for end-users seeking self-service support. Write clearly and concisely.

Knowledge source content:
`;

export interface GenerateResult {
  count: number;
  sourcesUsed: number;
  promptsUsed: number;
  chunksCreated: number;
}

function contentHash(text: string): string {
  return createHash('sha256').update(text.trim().toLowerCase()).digest('hex').slice(0, 16);
}

function parseArticleJson(content: string): { title: string; summary: string; body: string; skip?: boolean } | null {
  try {
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

interface ExtractionPrompt {
  id: string;
  question: string;
  enabled: boolean;
  sort_order: number;
}

async function fetchEnabledPrompts(supabase: ReturnType<typeof createAdminClient>, chatbotId: string): Promise<ExtractionPrompt[]> {
  const { data } = await (supabase.from as any)('article_extraction_prompts')
    .select('id, question, enabled, sort_order')
    .eq('chatbot_id', chatbotId)
    .eq('enabled', true)
    .order('sort_order', { ascending: true });
  return (data || []) as ExtractionPrompt[];
}

function truncateContent(content: string, maxLen = 8000): string {
  return content.length > maxLen
    ? content.slice(0, maxLen) + '\n\n[Content truncated]'
    : content;
}

/**
 * Embed generated articles back into the knowledge base.
 * Creates a knowledge_source of type "text" for the batch, then chunks + embeds each article.
 * This allows the chatbot to answer questions from articles without live-fetching.
 */
async function embedArticlesAsKnowledge(
  chatbotId: string,
  articles: Array<{ title: string; summary: string; body: string }>,
  sourceLabel: string
): Promise<number> {
  if (articles.length === 0) return 0;

  const supabase = createAdminClient();
  const embeddingConfig = await resolveEmbeddingConfig();
  if (!embeddingConfig) {
    console.warn('[Articles] No embedding provider available — skipping knowledge chunk creation');
    return 0;
  }

  // Create a knowledge source to group these article chunks
  const { data: source, error: sourceError } = await supabase
    .from('knowledge_sources')
    .insert({
      chatbot_id: chatbotId,
      name: sourceLabel,
      type: 'text',
      status: 'processing',
      chunks_count: 0,
    })
    .select()
    .single();

  if (sourceError || !source) {
    console.error('[Articles] Failed to create knowledge source:', sourceError);
    return 0;
  }

  let totalChunks = 0;

  try {
    // Combine each article into a chunking-friendly format
    for (const article of articles) {
      const articleText = `# ${article.title}\n\n${article.summary}\n\n${article.body}`;
      const chunks = chunkText(articleText);
      if (chunks.length === 0) continue;

      // Dedup against existing chunks in this chatbot
      const hashes = chunks.map(c => contentHash(c.content));
      const { data: existing } = await supabase
        .from('knowledge_chunks')
        .select('content_hash')
        .eq('chatbot_id', chatbotId)
        .in('content_hash', hashes);
      const existingSet = new Set((existing || []).map((r: any) => r.content_hash as string));
      const newChunks = chunks.filter((_, i) => !existingSet.has(hashes[i]));
      const newHashes = hashes.filter(h => !existingSet.has(h));

      if (newChunks.length === 0) continue;

      // Embed in batches
      const BATCH = 20;
      for (let i = 0; i < newChunks.length; i += BATCH) {
        const batch = newChunks.slice(i, i + BATCH);
        const batchHashes = newHashes.slice(i, i + BATCH);
        const embeddings = await generateEmbeddings(batch.map(c => c.content), embeddingConfig);

        const inserts = batch.map((chunk, idx) => ({
          source_id: source.id,
          chatbot_id: chatbotId,
          content: chunk.content,
          content_hash: batchHashes[idx],
          embedding: JSON.stringify(embeddings[idx]),
          chunk_index: totalChunks + i + idx,
          token_count: chunk.tokenCount,
          metadata: (chunk.metadata || {}) as Json,
        }));

        const { error } = await supabase.from('knowledge_chunks').insert(inserts);
        if (error) {
          console.error('[Articles] Failed to insert chunks:', error.message);
          continue;
        }
        totalChunks += batch.length;
      }
    }

    // Update source as completed
    await supabase
      .from('knowledge_sources')
      .update({
        status: 'completed',
        chunks_count: totalChunks,
        embedding_provider: embeddingConfig.provider,
        embedding_model: embeddingConfig.model,
      })
      .eq('id', source.id);
  } catch (error) {
    console.error('[Articles] Knowledge embedding failed:', error);
    await supabase
      .from('knowledge_sources')
      .update({ status: 'failed', error_message: error instanceof Error ? error.message : 'Unknown error' })
      .eq('id', source.id);
  }

  return totalChunks;
}

/**
 * Generate articles using extraction prompts against all knowledge chunks.
 * Each enabled prompt searches the full knowledge base and produces one focused article.
 * Articles are also embedded back into the knowledge base for the chatbot to use.
 */
export async function generateHelpArticles(chatbotId: string): Promise<GenerateResult> {
  const supabase = createAdminClient();

  // Fetch extraction prompts
  const prompts = await fetchEnabledPrompts(supabase, chatbotId);

  // Fetch all knowledge chunks for this chatbot (exclude article-generated sources to avoid circular refs)
  const { data: articleSources } = await supabase
    .from('knowledge_sources')
    .select('id')
    .eq('chatbot_id', chatbotId)
    .like('name', 'Generated Articles:%');

  const articleSourceIds = new Set((articleSources || []).map(s => s.id));

  const { data: allChunks } = await supabase
    .from('knowledge_chunks')
    .select('id, content, source_id')
    .eq('chatbot_id', chatbotId)
    .order('chunk_index', { ascending: true });

  // Filter out chunks from previously generated article sources
  const relevantChunks = (allChunks || []).filter(c => !articleSourceIds.has(c.source_id));

  const { count: sourcesCount } = await supabase
    .from('knowledge_sources')
    .select('*', { count: 'exact', head: true })
    .eq('chatbot_id', chatbotId)
    .eq('status', 'completed');

  if (relevantChunks.length === 0) {
    return { count: 0, sourcesUsed: sourcesCount || 0, promptsUsed: 0, chunksCreated: 0 };
  }

  // Delete existing articles and their knowledge sources
  await supabase.from('help_articles').delete().eq('chatbot_id', chatbotId);
  // Clean up old article-generated knowledge sources
  for (const sid of articleSourceIds) {
    await supabase.from('knowledge_chunks').delete().eq('source_id', sid);
    await supabase.from('knowledge_sources').delete().eq('id', sid);
  }

  const combinedContent = truncateContent(relevantChunks.map(c => c.content).join('\n\n'));
  let articleCount = 0;
  const generatedArticles: Array<{ title: string; summary: string; body: string }> = [];

  // If we have extraction prompts, use targeted generation
  if (prompts && prompts.length > 0) {
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      try {
        const result = await generate(
          `Question: ${prompt.question}\n\nKnowledge source content:\n${combinedContent}`,
          { maxTokens: 2048, temperature: 0.3, systemPrompt: TARGETED_PROMPT }
        );

        const article = parseArticleJson(result.content);
        if (!article || article.skip) continue;

        await (supabase.from as any)('help_articles').insert({
          chatbot_id: chatbotId,
          title: article.title,
          summary: article.summary,
          body: article.body,
          source_chunk_ids: relevantChunks.map(c => c.id).slice(0, 50),
          extraction_prompt_id: prompt.id,
          sort_order: i,
          published: false,
        });

        generatedArticles.push(article);
        articleCount++;
      } catch (error) {
        console.error(`[Articles] Failed for prompt "${prompt.question}":`, error);
      }
    }
  } else {
    // Fallback: one article per source
    const { data: sources } = await supabase
      .from('knowledge_sources')
      .select('id, name, type')
      .eq('chatbot_id', chatbotId)
      .eq('status', 'completed');

    for (let i = 0; i < (sources || []).length; i++) {
      const source = sources![i];
      const sourceChunks = relevantChunks.filter(c => c.source_id === source.id);
      if (sourceChunks.length === 0) continue;

      const content = truncateContent(sourceChunks.map(c => c.content).join('\n\n'));

      try {
        const result = await generate(GENERIC_PROMPT + content, {
          maxTokens: 2048,
          temperature: 0.3,
          systemPrompt: 'You are a help article generator. Always respond with valid JSON only, no markdown code blocks.',
        });

        const article = parseArticleJson(result.content) || {
          title: source.name || `Help Article ${i + 1}`,
          summary: content.slice(0, 200),
          body: content,
        };

        await (supabase.from as any)('help_articles').insert({
          chatbot_id: chatbotId,
          title: article.title,
          summary: article.summary,
          body: article.body,
          source_chunk_ids: sourceChunks.map(c => c.id),
          sort_order: i,
          published: false,
        });

        generatedArticles.push(article);
        articleCount++;
      } catch (error) {
        console.error(`[Articles] Failed for source ${source.id}:`, error);
      }
    }
  }

  // Embed articles as knowledge chunks for RAG
  const chunksCreated = await embedArticlesAsKnowledge(
    chatbotId,
    generatedArticles,
    `Generated Articles: Knowledge Base (${new Date().toISOString().slice(0, 10)})`
  );

  await supabase
    .from('chatbots')
    .update({ article_last_generated_at: new Date().toISOString() } as any)
    .eq('id', chatbotId);

  return {
    count: articleCount,
    sourcesUsed: sourcesCount || 0,
    promptsUsed: prompts?.length || 0,
    chunksCreated,
  };
}

/**
 * Generate articles from a URL using extraction prompts.
 * Scrapes the URL, generates articles, and embeds them as knowledge chunks.
 */
export async function generateArticlesFromUrl(chatbotId: string, url: string): Promise<GenerateResult> {
  const supabase = createAdminClient();

  // Scrape the URL
  const content = await extractURL(url);
  if (!content || content.trim().length < 50) {
    throw new Error('Could not extract sufficient content from the URL');
  }

  const truncated = truncateContent(content);

  // Fetch extraction prompts
  const prompts = await fetchEnabledPrompts(supabase, chatbotId);

  const generatedArticles: Array<{ title: string; summary: string; body: string }> = [];

  if (prompts.length === 0) {
    // No prompts: generate one generic article from the URL
    const result = await generate(GENERIC_PROMPT + truncated, {
      maxTokens: 2048,
      temperature: 0.3,
      systemPrompt: 'You are a help article generator. Always respond with valid JSON only, no markdown code blocks.',
    });

    const article = parseArticleJson(result.content) || {
      title: `Article from ${new URL(url).hostname}`,
      summary: truncated.slice(0, 200),
      body: truncated,
    };

    await (supabase.from as any)('help_articles').insert({
      chatbot_id: chatbotId,
      title: article.title,
      summary: article.summary,
      body: article.body,
      source_url: url,
      sort_order: 0,
      published: false,
    });

    generatedArticles.push(article);
  } else {
    // Get current max sort_order
    const { data: existingArticles } = await supabase
      .from('help_articles')
      .select('sort_order')
      .eq('chatbot_id', chatbotId)
      .order('sort_order', { ascending: false })
      .limit(1);

    const baseOrder = existingArticles && existingArticles.length > 0
      ? existingArticles[0].sort_order + 1
      : 0;

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      try {
        const result = await generate(
          `Question: ${prompt.question}\n\nWebsite content from ${url}:\n${truncated}`,
          { maxTokens: 2048, temperature: 0.3, systemPrompt: TARGETED_PROMPT }
        );

        const article = parseArticleJson(result.content);
        if (!article || article.skip) continue;

        await (supabase.from as any)('help_articles').insert({
          chatbot_id: chatbotId,
          title: article.title,
          summary: article.summary,
          body: article.body,
          source_url: url,
          extraction_prompt_id: prompt.id,
          sort_order: baseOrder + i,
          published: false,
        });

        generatedArticles.push(article);
      } catch (error) {
        console.error(`[Articles:URL] Failed for prompt "${prompt.question}":`, error);
      }
    }
  }

  // Embed articles as knowledge chunks
  const hostname = new URL(url).hostname;
  const chunksCreated = await embedArticlesAsKnowledge(
    chatbotId,
    generatedArticles,
    `Generated Articles: ${hostname} (${new Date().toISOString().slice(0, 10)})`
  );

  await supabase
    .from('chatbots')
    .update({ article_last_generated_at: new Date().toISOString() } as any)
    .eq('id', chatbotId);

  return {
    count: generatedArticles.length,
    sourcesUsed: 1,
    promptsUsed: prompts?.length || 0,
    chunksCreated,
  };
}
