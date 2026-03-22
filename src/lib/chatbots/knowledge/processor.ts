/**
 * Knowledge Source Processor
 * Processes uploaded documents, URLs, and text into vector embeddings
 */

import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/database';
import type { KnowledgeSource, KnowledgeSourceInsert } from '../types';
import { chunkText } from './chunker';
import { generateEmbeddings, resolveEmbeddingConfig } from './embeddings';

function contentHash(text: string): string {
  return createHash('sha256').update(text.trim().toLowerCase()).digest('hex').slice(0, 16);
}

// Use admin client for all processor operations (runs as background task, no user session)
function getAdminClient() {
  return createAdminClient();
}

async function getSourceById(sourceId: string): Promise<KnowledgeSource | null> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('id', sourceId)
    .single();
  if (error) return null;
  return data as KnowledgeSource;
}

async function updateSourceStatus(
  sourceId: string,
  status: string,
  errorMessage?: string,
  chunksCount?: number
): Promise<void> {
  const supabase = getAdminClient();
  const updates: Record<string, unknown> = { status };
  if (errorMessage !== undefined) updates.error_message = errorMessage;
  if (chunksCount !== undefined) updates.chunks_count = chunksCount;
  await supabase.from('knowledge_sources').update(updates).eq('id', sourceId);
}

async function createChildSource(source: KnowledgeSourceInsert): Promise<KnowledgeSource> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('knowledge_sources')
    .insert(source)
    .select()
    .single();
  if (error) throw error;
  return data as KnowledgeSource;
}

export interface ProcessingResult {
  success: boolean;
  chunksCreated: number;
  error?: string;
}

/**
 * Process a knowledge source: extract content, chunk, embed, and store
 */
export async function processKnowledgeSource(
  sourceId: string
): Promise<ProcessingResult> {
  const supabase = createAdminClient();

  try {
    // Get source from database
    const source = await getSourceById(sourceId);
    if (!source) {
      return { success: false, chunksCreated: 0, error: 'Source not found' };
    }

    // Update status to processing
    await updateSourceStatus(sourceId, 'processing');

    // Extract content based on type
    let content: string;

    switch (source.type) {
      case 'document':
        if (!source.file_path) {
          throw new Error('No file path for document source');
        }
        content = await extractDocument(supabase, source.file_path, source.file_type);
        break;

      case 'url':
        if (!source.url) {
          throw new Error('No URL for URL source');
        }
        const { extractURL } = await import('./extractors/url');
        content = await extractURL(source.url);
        break;

      case 'text':
        if (!source.content) {
          throw new Error('No content for text source');
        }
        content = source.content;
        break;

      case 'qa_pair':
        if (!source.question || !source.answer) {
          throw new Error('Missing question or answer for Q&A source');
        }
        // Format Q&A as a single chunk
        content = `Question: ${source.question}\n\nAnswer: ${source.answer}`;
        break;

      default:
        throw new Error(`Unknown source type: ${source.type}`);
    }

    if (!content.trim()) {
      throw new Error('Extracted content is empty');
    }

    // Content quality validation for URL sources
    if (source.type === 'url') {
      const wordCount = content.trim().split(/\s+/).length;
      if (wordCount < 20) {
        throw new Error(`Extracted content too short (${wordCount} words). The page may require authentication or have no useful content.`);
      }
      // Detect common error/gate pages
      const lowerContent = content.toLowerCase();
      const errorPatterns = [
        'access denied', '403 forbidden', '404 not found', 'page not found',
        'enable javascript', 'enable cookies', 'cookie consent',
        'please verify you are a human', 'captcha', 'cloudflare',
        'just a moment', 'checking your browser',
      ];
      const matchedPattern = errorPatterns.find(p => lowerContent.includes(p));
      if (matchedPattern && wordCount < 100) {
        throw new Error(`Page appears to be an error or gate page (detected: "${matchedPattern}"). Content not suitable for knowledge base.`);
      }
    }

    // Chunk the content
    const chunks = chunkText(content, {
      maxTokens: 500,
      overlap: 50,
      preserveHeaders: true,
    });

    if (chunks.length === 0) {
      throw new Error('No chunks generated from content');
    }

    // Resolve embedding config once for all batches
    const embeddingConfig = await resolveEmbeddingConfig();
    if (!embeddingConfig) {
      throw new Error('No embedding-capable AI provider available');
    }

    // Dedup: compute hashes and check for existing chunks in this chatbot
    const chunkHashes = chunks.map((c) => contentHash(c.content));
    const { data: existingHashes } = await supabase
      .from('knowledge_chunks')
      .select('content_hash')
      .eq('chatbot_id', source.chatbot_id)
      .in('content_hash', chunkHashes);
    const existingHashSet = new Set((existingHashes || []).map((r: { content_hash: string }) => r.content_hash));

    // Filter out duplicate chunks
    const dedupedChunks = chunks.filter((_, i) => !existingHashSet.has(chunkHashes[i]));
    const dedupedHashes = chunkHashes.filter((h) => !existingHashSet.has(h));
    const skipped = chunks.length - dedupedChunks.length;
    if (skipped > 0) {
      console.log(`[Processor] Skipped ${skipped} duplicate chunks for chatbot ${source.chatbot_id}`);
    }

    // Generate embeddings in batches
    const BATCH_SIZE = 20;
    let totalChunksCreated = 0;

    for (let i = 0; i < dedupedChunks.length; i += BATCH_SIZE) {
      const batch = dedupedChunks.slice(i, i + BATCH_SIZE);
      const batchHashes = dedupedHashes.slice(i, i + BATCH_SIZE);
      const texts = batch.map((c) => c.content);

      // Generate embeddings for batch using the resolved config
      const embeddings = await generateEmbeddings(texts, embeddingConfig);

      // Store chunks with embeddings and content hash
      const chunkInserts = batch.map((chunk, index) => ({
        source_id: sourceId,
        chatbot_id: source.chatbot_id,
        content: chunk.content,
        content_hash: batchHashes[index],
        embedding: JSON.stringify(embeddings[index]),
        chunk_index: i + index,
        token_count: chunk.tokenCount,
        metadata: chunk.metadata as Json,
      }));

      const { error } = await supabase.from('knowledge_chunks').insert(chunkInserts);

      if (error) {
        throw new Error(`Failed to store chunks: ${error.message}`);
      }

      totalChunksCreated += batch.length;
    }

    // Record which embedding model was used, then mark completed
    await supabase
      .from('knowledge_sources')
      .update({
        embedding_provider: embeddingConfig.provider,
        embedding_model: embeddingConfig.model,
      })
      .eq('id', sourceId);

    // Update source status to completed
    await updateSourceStatus(sourceId, 'completed', undefined, totalChunksCreated);

    return {
      success: true,
      chunksCreated: totalChunksCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Update source status to failed
    await updateSourceStatus(sourceId, 'failed', errorMessage);

    return {
      success: false,
      chunksCreated: 0,
      error: errorMessage,
    };
  }
}

/**
 * Extract content from a document file
 */
async function extractDocument(
  supabase: any,
  filePath: string,
  fileType: string | null
): Promise<string> {
  // Download file from Supabase Storage
  const { data, error } = await supabase.storage
    .from('chatbot-knowledge')
    .download(filePath);

  if (error || !data) {
    throw new Error(`Failed to download file: ${error?.message || 'Unknown error'}`);
  }

  const buffer = Buffer.from(await data.arrayBuffer());

  // Extract based on file type (using dynamic imports to avoid loading pdf-parse on module init)
  switch (fileType?.toLowerCase()) {
    case 'pdf':
    case 'application/pdf': {
      const { extractPDF } = await import('./extractors/pdf');
      return extractPDF(buffer);
    }

    case 'docx':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      const { extractDOCX } = await import('./extractors/docx');
      return extractDOCX(buffer);
    }

    case 'txt':
    case 'text/plain':
    case 'md':
    case 'text/markdown':
      return buffer.toString('utf-8');

    default:
      // Try to read as text
      return buffer.toString('utf-8');
  }
}

/**
 * Process a URL source with crawling enabled.
 * Crawls the website to discover pages, creates a child source for each,
 * and processes them sequentially. The parent source tracks overall progress.
 */
export async function processUrlWithCrawl(
  parentSourceId: string,
  chatbotId: string,
  startUrl: string,
  maxPages: number = 25
): Promise<ProcessingResult> {
  try {
    // Update parent status to processing
    await updateSourceStatus(parentSourceId, 'processing');

    // Crawl the website to discover pages
    console.log(`[Crawler] Starting crawl for source ${parentSourceId}`);
    const { crawlWebsite } = await import('./crawler');
    const pages = await crawlWebsite(startUrl, { maxPages });

    if (pages.length === 0) {
      throw new Error('No pages discovered during crawl');
    }

    console.log(`[Crawler] Discovered ${pages.length} pages, processing each...`);

    let totalChunksCreated = 0;
    let pagesProcessed = 0;
    let pagesFailed = 0;

    for (const page of pages) {
      try {
        // Create a child source for each discovered page
        const pageName = page.title || new URL(page.url).pathname || page.url;
        const childSource = await createChildSource({
          chatbot_id: chatbotId,
          type: 'url',
          name: pageName.substring(0, 255),
          url: page.url,
          metadata: {
            parent_source_id: parentSourceId,
            crawl_depth: page.depth,
          },
        });

        // Process the child source (extract, chunk, embed)
        const result = await processKnowledgeSource(childSource.id);

        if (result.success) {
          totalChunksCreated += result.chunksCreated;
          pagesProcessed++;
        } else {
          pagesFailed++;
          console.warn(`[Crawler] Failed to process ${page.url}: ${result.error}`);
        }
      } catch (err) {
        pagesFailed++;
        console.warn(`[Crawler] Error processing ${page.url}:`, err);
      }
    }

    // Update parent source with summary
    const summaryMessage = `Crawled ${pages.length} pages: ${pagesProcessed} succeeded, ${pagesFailed} failed`;
    console.log(`[Crawler] ${summaryMessage}`);

    await updateSourceStatus(
      parentSourceId,
      pagesFailed === pages.length ? 'failed' : 'completed',
      pagesFailed > 0 ? `${pagesFailed} pages failed` : undefined,
      totalChunksCreated
    );

    return {
      success: pagesProcessed > 0,
      chunksCreated: totalChunksCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await updateSourceStatus(parentSourceId, 'failed', errorMessage);
    return { success: false, chunksCreated: 0, error: errorMessage };
  }
}

/**
 * Reprocess a knowledge source (e.g., after editing)
 */
export async function reprocessKnowledgeSource(sourceId: string): Promise<ProcessingResult> {
  const supabase = createAdminClient();

  // Delete existing chunks
  const { error } = await supabase
    .from('knowledge_chunks')
    .delete()
    .eq('source_id', sourceId);

  if (error) {
    return {
      success: false,
      chunksCreated: 0,
      error: `Failed to delete existing chunks: ${error.message}`,
    };
  }

  // Reprocess
  return processKnowledgeSource(sourceId);
}
