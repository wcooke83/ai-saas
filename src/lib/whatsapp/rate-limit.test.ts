import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkWhatsAppRateLimit } from './rate-limit';

let testId = 0;
function uniqueKey() {
  testId++;
  return { chatbotId: `bot-${testId}`, phone: `+1555000${testId}` };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkWhatsAppRateLimit', () => {
  it('allows messages under the limit', () => {
    const { chatbotId, phone } = uniqueKey();
    const result = checkWhatsAppRateLimit(chatbotId, phone);
    expect(result).toEqual({ allowed: true });
  });

  it('allows up to 10 messages in the window', () => {
    const { chatbotId, phone } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      const result = checkWhatsAppRateLimit(chatbotId, phone);
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks the 11th message', () => {
    const { chatbotId, phone } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      checkWhatsAppRateLimit(chatbotId, phone);
    }
    const result = checkWhatsAppRateLimit(chatbotId, phone);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('returns retryAfterSeconds when blocked', () => {
    const { chatbotId, phone } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      checkWhatsAppRateLimit(chatbotId, phone);
    }
    const result = checkWhatsAppRateLimit(chatbotId, phone);
    expect(result.allowed).toBe(false);
    expect(typeof result.retryAfterSeconds).toBe('number');
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(60);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('different phones have separate limits', () => {
    const { chatbotId } = uniqueKey();
    const phoneA = '+15550001111';
    const phoneB = '+15550002222';

    for (let i = 0; i < 10; i++) {
      checkWhatsAppRateLimit(chatbotId, phoneA);
    }
    expect(checkWhatsAppRateLimit(chatbotId, phoneA).allowed).toBe(false);
    expect(checkWhatsAppRateLimit(chatbotId, phoneB).allowed).toBe(true);
  });

  it('different chatbots have separate limits', () => {
    const phone = '+15550009999';
    const botA = 'bot-sep-a';
    const botB = 'bot-sep-b';

    for (let i = 0; i < 10; i++) {
      checkWhatsAppRateLimit(botA, phone);
    }
    expect(checkWhatsAppRateLimit(botA, phone).allowed).toBe(false);
    expect(checkWhatsAppRateLimit(botB, phone).allowed).toBe(true);
  });

  it('resets after the window expires', () => {
    const { chatbotId, phone } = uniqueKey();

    for (let i = 0; i < 10; i++) {
      checkWhatsAppRateLimit(chatbotId, phone);
    }
    expect(checkWhatsAppRateLimit(chatbotId, phone).allowed).toBe(false);

    vi.advanceTimersByTime(61_000);

    const result = checkWhatsAppRateLimit(chatbotId, phone);
    expect(result.allowed).toBe(true);
  });

  it('slides the window - oldest messages expire first', () => {
    const { chatbotId, phone } = uniqueKey();

    // Send 5 messages at t=0
    for (let i = 0; i < 5; i++) {
      checkWhatsAppRateLimit(chatbotId, phone);
    }

    // Advance 30 seconds and send 5 more
    vi.advanceTimersByTime(30_000);
    for (let i = 0; i < 5; i++) {
      checkWhatsAppRateLimit(chatbotId, phone);
    }

    expect(checkWhatsAppRateLimit(chatbotId, phone).allowed).toBe(false);

    // Advance 31 seconds -- the first 5 messages (from t=0) expire
    vi.advanceTimersByTime(31_000);

    const result = checkWhatsAppRateLimit(chatbotId, phone);
    expect(result.allowed).toBe(true);
  });
});
