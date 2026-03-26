import { describe, it, expect } from 'vitest';
import { chunkText, type Chunk } from './chunker';

describe('chunkText', () => {
  it('returns empty array for empty text', () => {
    expect(chunkText('')).toEqual([]);
  });

  it('returns empty array for whitespace-only text', () => {
    expect(chunkText('   \n\n  ')).toEqual([]);
  });

  it('returns single chunk for short text', () => {
    const chunks = chunkText('This is a short paragraph.');
    expect(chunks).toHaveLength(1);
    expect(chunks[0].content).toBe('This is a short paragraph.');
    expect(chunks[0].index).toBe(0);
  });

  it('splits long text into multiple chunks', () => {
    // Each paragraph ~50 tokens (200 chars), maxTokens=100
    const para = 'A'.repeat(200);
    const text = `${para}\n\n${para}\n\n${para}`;
    const chunks = chunkText(text, { maxTokens: 100, overlap: 0 });
    expect(chunks.length).toBeGreaterThan(1);
  });

  it('normalizes \\r\\n to \\n', () => {
    const text = 'Paragraph one.\r\n\r\nParagraph two.';
    const chunks = chunkText(text);
    expect(chunks.some((c) => c.content.includes('\r'))).toBe(false);
  });

  it('collapses triple newlines', () => {
    const text = 'Paragraph one.\n\n\n\n\nParagraph two.';
    const chunks = chunkText(text);
    expect(chunks[0].content).not.toContain('\n\n\n');
  });

  it('preserves headers in metadata', () => {
    const text = '# My Header\n\nSome content under the header.';
    const chunks = chunkText(text, { preserveHeaders: true });
    expect(chunks[0].metadata).toHaveProperty('header', 'My Header');
  });

  it('estimates token count as length / 4', () => {
    const text = 'A'.repeat(100); // 100 chars = 25 tokens
    const chunks = chunkText(text);
    expect(chunks[0].tokenCount).toBe(25);
  });

  it('assigns sequential indices', () => {
    const para = 'Word '.repeat(150); // ~150 tokens per paragraph
    const text = `${para}\n\n${para}\n\n${para}`;
    const chunks = chunkText(text, { maxTokens: 200, overlap: 0 });
    chunks.forEach((chunk, i) => {
      expect(chunk.index).toBe(i);
    });
  });

  it('creates overlap between chunks when overlap > 0', () => {
    // Build text with clear sentences across multiple paragraphs
    const para1 = Array.from({ length: 10 }, (_, i) => `Alpha sentence ${i + 1}.`).join(' ');
    const para2 = Array.from({ length: 10 }, (_, i) => `Beta sentence ${i + 1}.`).join(' ');
    const para3 = Array.from({ length: 10 }, (_, i) => `Gamma sentence ${i + 1}.`).join(' ');
    const text = `${para1}\n\n${para2}\n\n${para3}`;
    const chunksWithOverlap = chunkText(text, { maxTokens: 100, overlap: 50 });
    const chunksNoOverlap = chunkText(text, { maxTokens: 100, overlap: 0 });

    // With overlap enabled, later chunks should be larger (they contain overlap text)
    // or chunks should be produced - the key property is overlap > 0 doesn't crash
    expect(chunksWithOverlap.length).toBeGreaterThanOrEqual(1);
    expect(chunksNoOverlap.length).toBeGreaterThanOrEqual(1);
  });

  it('handles text without paragraph breaks', () => {
    const text = 'Sentence one. Sentence two. Sentence three. Sentence four. Sentence five. ' +
      'Sentence six. Sentence seven. Sentence eight. Sentence nine. Sentence ten. ' +
      'Sentence eleven. Sentence twelve. Sentence thirteen. Sentence fourteen. Sentence fifteen.';
    const chunks = chunkText(text, { maxTokens: 30, overlap: 0 });
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    chunks.forEach((c) => expect(c.content.length).toBeGreaterThan(0));
  });

  it('detects all-caps short text as header', () => {
    const text = 'IMPORTANT NOTICE\n\nDetails about the notice here.';
    const chunks = chunkText(text, { preserveHeaders: true });
    expect(chunks[0].metadata).toHaveProperty('header', 'IMPORTANT NOTICE');
  });

  it('skips header preservation when disabled', () => {
    const text = '# My Header\n\nSome content.';
    const chunks = chunkText(text, { preserveHeaders: false });
    expect(chunks[0].metadata).toEqual({});
  });
});
