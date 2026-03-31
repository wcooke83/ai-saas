import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkDiscordRateLimit } from './rate-limit';

let testId = 0;
function uniqueKey() {
  testId++;
  return { chatbotId: `bot-${testId}`, userId: `discord-user-${testId}` };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkDiscordRateLimit', () => {
  it('allows messages under the limit', () => {
    const { chatbotId, userId } = uniqueKey();
    const result = checkDiscordRateLimit(chatbotId, userId);
    expect(result).toEqual({ allowed: true });
  });

  it('allows up to 10 messages in the window', () => {
    const { chatbotId, userId } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      const result = checkDiscordRateLimit(chatbotId, userId);
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks the 11th message', () => {
    const { chatbotId, userId } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      checkDiscordRateLimit(chatbotId, userId);
    }
    const result = checkDiscordRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('returns retryAfterSeconds when blocked', () => {
    const { chatbotId, userId } = uniqueKey();
    for (let i = 0; i < 10; i++) {
      checkDiscordRateLimit(chatbotId, userId);
    }
    const result = checkDiscordRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(false);
    expect(typeof result.retryAfterSeconds).toBe('number');
    expect(result.retryAfterSeconds).toBeLessThanOrEqual(60);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('different users have separate limits', () => {
    const { chatbotId } = uniqueKey();
    const userA = 'discord-a';
    const userB = 'discord-b';

    for (let i = 0; i < 10; i++) {
      checkDiscordRateLimit(chatbotId, userA);
    }
    expect(checkDiscordRateLimit(chatbotId, userA).allowed).toBe(false);
    expect(checkDiscordRateLimit(chatbotId, userB).allowed).toBe(true);
  });

  it('different chatbots have separate limits', () => {
    const userId = 'discord-shared';
    const botA = 'bot-sep-a';
    const botB = 'bot-sep-b';

    for (let i = 0; i < 10; i++) {
      checkDiscordRateLimit(botA, userId);
    }
    expect(checkDiscordRateLimit(botA, userId).allowed).toBe(false);
    expect(checkDiscordRateLimit(botB, userId).allowed).toBe(true);
  });

  it('resets after the window expires', () => {
    const { chatbotId, userId } = uniqueKey();

    for (let i = 0; i < 10; i++) {
      checkDiscordRateLimit(chatbotId, userId);
    }
    expect(checkDiscordRateLimit(chatbotId, userId).allowed).toBe(false);

    vi.advanceTimersByTime(61_000);

    const result = checkDiscordRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(true);
  });

  it('slides the window - oldest messages expire first', () => {
    const { chatbotId, userId } = uniqueKey();

    for (let i = 0; i < 5; i++) {
      checkDiscordRateLimit(chatbotId, userId);
    }

    vi.advanceTimersByTime(30_000);
    for (let i = 0; i < 5; i++) {
      checkDiscordRateLimit(chatbotId, userId);
    }

    expect(checkDiscordRateLimit(chatbotId, userId).allowed).toBe(false);

    vi.advanceTimersByTime(31_000);

    const result = checkDiscordRateLimit(chatbotId, userId);
    expect(result.allowed).toBe(true);
  });
});
