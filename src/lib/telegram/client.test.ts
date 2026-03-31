import { describe, it, expect } from 'vitest';
import { splitTelegramMessage } from './client';

describe('splitTelegramMessage', () => {
  it('returns single-element array for short messages', () => {
    const result = splitTelegramMessage('Hello world');
    expect(result).toEqual(['Hello world']);
  });

  it('returns single-element array for exactly maxLength chars', () => {
    const text = 'a'.repeat(4000);
    const result = splitTelegramMessage(text);
    expect(result).toEqual([text]);
  });

  it('returns empty string as single-element array', () => {
    const result = splitTelegramMessage('');
    expect(result).toEqual(['']);
  });

  it('splits at nearest newline boundary', () => {
    // Build a message with a newline before the 4000 limit
    const firstPart = 'a'.repeat(3990);
    const secondPart = 'b'.repeat(100);
    const text = `${firstPart}\n${secondPart}`;

    const result = splitTelegramMessage(text);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(firstPart);
    expect(result[1]).toBe(secondPart);
  });

  it('splits at nearest space when no newline found', () => {
    const firstPart = 'a'.repeat(3990);
    const secondPart = 'b'.repeat(100);
    const text = `${firstPart} ${secondPart}`;

    const result = splitTelegramMessage(text);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(firstPart);
    expect(result[1]).toBe(secondPart);
  });

  it('hard-splits when no whitespace found', () => {
    const text = 'a'.repeat(5000);
    const result = splitTelegramMessage(text);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('a'.repeat(4000));
    expect(result[1]).toBe('a'.repeat(1000));
  });

  it('handles multiple splits for very long messages', () => {
    const text = 'a'.repeat(12000);
    const result = splitTelegramMessage(text);
    expect(result).toHaveLength(3);
    expect(result[0]).toBe('a'.repeat(4000));
    expect(result[1]).toBe('a'.repeat(4000));
    expect(result[2]).toBe('a'.repeat(4000));
  });

  it('respects custom maxLength parameter', () => {
    const text = 'a'.repeat(200);
    const result = splitTelegramMessage(text, 100);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('a'.repeat(100));
    expect(result[1]).toBe('a'.repeat(100));
  });

  it('trims leading whitespace from subsequent chunks', () => {
    const firstPart = 'a'.repeat(3990);
    const secondPart = 'b'.repeat(50);
    // Space at split point, plus leading spaces on next chunk
    const text = `${firstPart}   ${secondPart}`;

    const result = splitTelegramMessage(text);
    expect(result).toHaveLength(2);
    // Second chunk should not have leading spaces
    expect(result[1]).toBe(secondPart);
  });
});
