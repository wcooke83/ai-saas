/**
 * Knowledge Source Processor
 * Processes uploaded documents, URLs, and text into vector embeddings
 */

import { createAdminClient } from '@/lib/supabase/admin';
import {
  getKnowledgeSource,
  updateKnowledgeSourceStatus,
} from '../api';
import { chunkText } from './chunker';
import { generateEmbeddings } from './embeddings';
import { extractPDF } from './extractors/pdf';
import { extractDOCX } from './extractors/docx';
import { extractURL } from './extractors/url';

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
    const source = await getKnowledgeSource(sourceId);
    if (!source) {
      return { success: false, chunksCreated: 0, error: 'Source not found' };
    }

    // Update status to processing
    await updateKnowledgeSourceStatus(sourceId, 'processing');

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
    await updateKnowledgeSourceStatus(sourceId, 'completed', undefined, totalChunksCreated);

    return {
      success: true,
      chunksCreated: totalChunksCreated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Update source status to failed
    await updateKnowledgeSourceStatus(sourceId, 'failed', errorMessage);

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
