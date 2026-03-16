/**
 * Knowledge Source Processor
 * Processes uploaded documents, URLs, and text into vector embeddings
 */

import { createAdminClient } from '@/lib/supabase/admin';
import type { KnowledgeSource } from '../types';
import { chunkText } from './chunker';
import { generateEmbeddings } from './embeddings';
import { extractPDF } from './extractors/pdf';
import { extractDOCX } from './extractors/docx';
import { extractURL } from './extractors/url';
import { crawlWebsite } from './crawler';

// Use admin client for all processor operations (runs as background task, no user session)
function getAdminClient() {
  return createAdminClient() as any;
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

async function createChildSource(source: Record<string, unknown>): Promise<KnowledgeSource> {
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
  const supabase = createAdminClient() as any;

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

    // Chunk the content
    const chunks = chunkText(content, {
      maxTokens: 500,
      overlap: 50,
      preserveHeaders: true,
    });

    if (chunks.length === 0) {
      throw new Error('No chunks generated from content');
    }

    // Generate embeddings in batches
    const BATCH_SIZE = 20;
    let totalChunksCreated = 0;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const texts = batch.map((c) => c.content);

      // Generate embeddings for batch
      const embeddings = await generateEmbeddings(texts);

      // Store chunks with embeddings
      const chunkInserts = batch.map((chunk, index) => ({
        source_id: sourceId,
        chatbot_id: source.chatbot_id,
        content: chunk.content,
        embedding: JSON.stringify(embeddings[index]),
        chunk_index: i + index,
        token_count: chunk.tokenCount,
        metadata: chunk.metadata,
      }));

      const { error } = await supabase.from('knowledge_chunks').insert(chunkInserts);

      if (error) {
        throw new Error(`Failed to store chunks: ${error.message}`);
      }

      totalChunksCreated += batch.length;
    }

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

  // Extract based on file type
  switch (fileType?.toLowerCase()) {
    case 'pdf':
    case 'application/pdf':
      return extractPDF(buffer);

    case 'docx':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractDOCX(buffer);

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
  const supabase = createAdminClient() as any;

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
