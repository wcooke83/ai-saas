/**
 * PDF Content Extractor
 */

// pdf-parse requires CommonJS-style import
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require('pdf-parse');

/**
 * Extract text content from a PDF buffer
 */
export async function extractPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);

    // Clean up the extracted text
    let text = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+/g, ' ')
      .replace(/\n /g, '\n')
      .trim();

    // If very little text was extracted, the PDF might be image-based
    if (text.length < 100) {
      console.warn('PDF appears to contain mostly images or scanned content');
    }

    return text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(
      `Failed to extract PDF content: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
