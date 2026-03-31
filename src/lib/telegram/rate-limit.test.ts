import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkTelegramRateLimit } from './rate-limit';

// Each test uses unique chatbotId/userId to avoid cross-test state leakage
// from the module-level in-memory Map.
let testId = 0;
function uniqueKey() {
  testId++;
  return { chatbotId: `bot-${testId}`, userId: testId * 1000 };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkTelegramRateLimit', () => {
  it('allows messages under the limit', () => {
    const { chatbotId, userId } = uniqueKey();
    const result = checkTelegramRateLimit(chatbotId, userId);
    expect(result).toEqual({ allowed: true });
  });

  it('allows up to 10 messages in the window', () => {
    const { chatbotId, userId } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      const result = checkTelegramRateLimit(chatbotId, userId);
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks the 11th message', () => {
    const { chatbotId, userId } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      checkTelegramRateLimit(chatbotId, userId);
    }
    const result = checkTelegramRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('returns retryAfterSeconds when blocked', () => {
    const { chatbotId, userId } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      checkTelegramRateLimit(chatbotId, userId);
    }
    const result = checkTelegramRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(false);
    expect(typeof result.retryAfterSeconds).toBe('number');
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(60);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('different users have separate limits', () => {
    const { chatbotId } = uniqueKey();
    const userA = 1001;
    const userB = 1002;

    // Fill up userA's limit
    for (let i = 0; i < 10; i++) {
      checkTelegramRateLimit(chatbotId, userA);
    }
    expect(checkTelegramRateLimit(chatbotId, userA).allowed).toBe(false);

    // userB should still be allowed
    expect(checkTelegramRateLimit(chatbotId, userB).allowed).toBe(true);
  });

  it('different chatbots have separate limits', () => {
    const userId = 9999;
    const botA = 'bot-sep-a';
    const botB = 'bot-sep-b';

    // Fill up botA's limit for this user
    for (let i = 0; i < 10; i++) {
      checkTelegramRateLimit(botA, userId);
    }
    expect(checkTelegramRateLimit(botA, userId).allowed).toBe(false);

    // Same user on botB should still be allowed
    expect(checkTelegramRateLimit(botB, userId).allowed).toBe(true);
  });

  it('resets after the window expires', () => {
    const { chatbotId, userId } = uniqueKey();

    // Use up all 10 messages
    for (let i = 0; i < 10; i++) {
      checkTelegramRateLimit(chatbotId, userId);
    }
    expect(checkTelegramRateLimit(chatbotId, userId).allowed).toBe(false);

    // Advance time past the 60-second window
    vi.advanceTimersByTime(61_000);

    const result = checkTelegramRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(true);
  });

  it('slides the window - oldest messages expire first', () => {
    const { chatbotId, userId } = uniqueKey();

    // Send 5 messages at t=0
    for (let i = 0; i < 5; i++) {
      checkTelegramRateLimit(chatbotId, userId);
    }

    // Advance 30 seconds and send 5 more
    vi.advanceTimersByTime(30_000);
    for (let i = 0; i < 5; i++) {
      checkTelegramRateLimit(chatbotId, userId);
    }

    // Now at limit (10 messages total in window)
    expect(checkTelegramRateLimit(chatbotId, userId).allowed).toBe(false);

    // Advance 31 seconds — the first 5 messages (from t=0) expire
    vi.advanceTimersByTime(31_000);

    // Should have room again (only 5 messages remain in window)
    const result = checkTelegramRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(true);
  });
});
