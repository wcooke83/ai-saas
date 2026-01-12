/**
 * Text Chunker
 * Splits text into chunks suitable for embedding
 */

export interface Chunk {
  content: string;
  index: number;
  tokenCount: number;
  metadata: Record<string, unknown>;
}

export interface ChunkOptions {
  maxTokens?: number;
  overlap?: number;
  preserveHeaders?: boolean;
}

// Rough token estimation (4 chars = 1 token average)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Split text into chunks with optional overlap
 */
export function chunkText(
  text: string,
  options: ChunkOptions = {}
): Chunk[] {
  const {
    maxTokens = 500,
    overlap = 50,
    preserveHeaders = true,
  } = options;

  // Clean and normalize text
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!cleanedText) {
    return [];
  }

  const chunks: Chunk[] = [];

  // Split by paragraphs first
  const paragraphs = cleanedText.split(/\n\n+/);
  let currentChunk = '';
  let currentHeader = '';
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    // Check if this is a header (starts with # or is all caps and short)
    const isHeader =
      trimmedParagraph.startsWith('#') ||
      (trimmedParagraph.length < 100 && trimmedParagraph === trimmedParagraph.toUpperCase());

    if (isHeader && preserveHeaders) {
      currentHeader = trimmedParagraph.replace(/^#+\s*/, '');
    }

    // Would adding this paragraph exceed the limit?
    const potentialChunk = currentChunk
      ? `${currentChunk}\n\n${trimmedParagraph}`
      : trimmedParagraph;

    if (estimateTokens(potentialChunk) > maxTokens && currentChunk) {
      // Save current chunk
      chunks.push({
        content: currentChunk,
        index: chunkIndex,
        tokenCount: estimateTokens(currentChunk),
        metadata: currentHeader ? { header: currentHeader } : {},
      });
      chunkIndex++;

      // Start new chunk with overlap
      if (overlap > 0) {
        // Get last few sentences for overlap
        const sentences = currentChunk.match(/[^.!?]+[.!?]+/g) || [currentChunk];
        const overlapText = sentences.slice(-2).join(' ').trim();

        if (estimateTokens(overlapText) <= overlap) {
          currentChunk = overlapText + '\n\n' + trimmedParagraph;
        } else {
          currentChunk = trimmedParagraph;
        }
      } else {
        currentChunk = trimmedParagraph;
      }
    } else {
      currentChunk = potentialChunk;
    }

    // If a single paragraph is too long, split it by sentences
    if (estimateTokens(currentChunk) > maxTokens * 1.5) {
      const sentences = currentChunk.match(/[^.!?]+[.!?]+/g) || [currentChunk];
      let sentenceChunk = '';

      for (const sentence of sentences) {
        const potentialSentenceChunk = sentenceChunk
          ? `${sentenceChunk} ${sentence.trim()}`
          : sentence.trim();

        if (estimateTokens(potentialSentenceChunk) > maxTokens && sentenceChunk) {
          chunks.push({
            content: sentenceChunk,
            index: chunkIndex,
            tokenCount: estimateTokens(sentenceChunk),
            metadata: currentHeader ? { header: currentHeader } : {},
          });
          chunkIndex++;
          sentenceChunk = sentence.trim();
        } else {
          sentenceChunk = potentialSentenceChunk;
        }
      }
      currentChunk = sentenceChunk;
    }
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      index: chunkIndex,
      tokenCount: estimateTokens(currentChunk.trim()),
      metadata: currentHeader ? { header: currentHeader } : {},
    });
  }

  return chunks;
}

/**
 * Split text by fixed character count (simpler approach)
 */
export function chunkByCharacters(
  text: string,
  maxChars: number = 2000,
  overlapChars: number = 200
): Chunk[] {
  const chunks: Chunk[] = [];
  let start = 0;
  let index = 0;

  while (start < text.length) {
    let end = start + maxChars;

    // Try to break at a sentence or paragraph boundary
    if (end < text.length) {
      const lastParagraph = text.lastIndexOf('\n\n', end);
      const lastSentence = text.lastIndexOf('. ', end);

      if (lastParagraph > start + maxChars / 2) {
        end = lastParagraph;
      } else if (lastSentence > start + maxChars / 2) {
        end = lastSentence + 1;
      }
    }

    const content = text.slice(start, end).trim();
    if (content) {
      chunks.push({
        content,
        index,
        tokenCount: estimateTokens(content),
        metadata: {},
      });
      index++;
    }

    start = end - overlapChars;
  }

  return chunks;
}
