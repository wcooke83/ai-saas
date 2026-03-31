import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkTeamsRateLimit } from './rate-limit';

let testId = 0;
function uniqueKey() {
  testId++;
  return { chatbotId: `bot-${testId}`, userId: `user-${testId}` };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkTeamsRateLimit', () => {
  it('allows messages under the limit', () => {
    const { chatbotId, userId } = uniqueKey();
    const result = checkTeamsRateLimit(chatbotId, userId);
    expect(result).toEqual({ allowed: true });
  });

  it('allows up to 10 messages in the window', () => {
    const { chatbotId, userId } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      const result = checkTeamsRateLimit(chatbotId, userId);
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks the 11th message', () => {
    const { chatbotId, userId } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      checkTeamsRateLimit(chatbotId, userId);
    }
    const result = checkTeamsRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('returns retryAfterSeconds when blocked', () => {
    const { chatbotId, userId } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      checkTeamsRateLimit(chatbotId, userId);
    }
    const result = checkTeamsRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(false);
    expect(typeof result.retryAfterSeconds).toBe('number');
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(60);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('different users have separate limits', () => {
    const { chatbotId } = uniqueKey();
    const userA = 'user-a';
    const userB = 'user-b';

    for (let i = 0; i < 10; i++) {
      checkTeamsRateLimit(chatbotId, userA);
    }
    expect(checkTeamsRateLimit(chatbotId, userA).allowed).toBe(false);
    expect(checkTeamsRateLimit(chatbotId, userB).allowed).toBe(true);
  });

  it('different chatbots have separate limits', () => {
    const userId = 'user-shared';
    const botA = 'bot-sep-a';
    const botB = 'bot-sep-b';

    for (let i = 0; i < 10; i++) {
      checkTeamsRateLimit(botA, userId);
    }
    expect(checkTeamsRateLimit(botA, userId).allowed).toBe(false);
    expect(checkTeamsRateLimit(botB, userId).allowed).toBe(true);
  });

  it('resets after the window expires', () => {
    const { chatbotId, userId } = uniqueKey();

    for (let i = 0; i < 10; i++) {
      checkTeamsRateLimit(chatbotId, userId);
    }
    expect(checkTeamsRateLimit(chatbotId, userId).allowed).toBe(false);

    vi.advanceTimersByTime(61_000);

    const result = checkTeamsRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(true);
  });

  it('slides the window - oldest messages expire first', () => {
    const { chatbotId, userId } = uniqueKey();

    for (let i = 0; i < 5; i++) {
      checkTeamsRateLimit(chatbotId, userId);
    }

    vi.advanceTimersByTime(30_000);
    for (let i = 0; i < 5; i++) {
      checkTeamsRateLimit(chatbotId, userId);
    }

    expect(checkTeamsRateLimit(chatbotId, userId).allowed).toBe(false);

    vi.advanceTimersByTime(31_000);

    const result = checkTeamsRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(true);
  });
});
