/**
 * DOCX Content Extractor
 */

import mammoth from 'mammoth';

/**
 * Extract text content from a DOCX buffer
 */
export async function extractDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });

    // Clean up the extracted text
    const text = result.value
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Log any warnings
    if (result.messages.length > 0) {
      console.warn('DOCX extraction warnings:', result.messages);
    }

    return text;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error(
      `Failed to extract DOCX content: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
