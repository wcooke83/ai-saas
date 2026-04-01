import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { signPayload, deliverWebhook } from './deliver';
import { createHmac } from 'crypto';
import type { WebhookEvent } from './types';

// Mock URL validation to skip DNS resolution in unit tests
vi.mock('./url-validation', () => ({
  validateWebhookURL: vi.fn().mockResolvedValue({ valid: true }),
}));

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock crypto.randomUUID for deterministic delivery IDs
vi.mock('crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('crypto')>();
  return {
    ...actual,
    randomUUID: vi.fn().mockReturnValue('test-delivery-id'),
  };
});

beforeEach(() => {
  vi.useFakeTimers();
  mockFetch.mockReset();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── signPayload ───────────────────────────────────────────────────

describe('signPayload', () => {
  it('produces a valid HMAC-SHA256 hex digest', () => {
    const body = '{"event":"test"}';
    const secret = 'webhook-secret';
    const timestamp = '1700000000';

    const result = signPayload(body, secret, timestamp);

    // Verify against Node's crypto directly
    const expected = createHmac('sha256', secret)
      .update(`${timestamp}.${body}`)
      .digest('hex');

    expect(result).toBe(expected);
  });

  it('produces different signatures for different bodies', () => {
    const secret = 'same-secret';
    const ts = '1700000000';

    const sig1 = signPayload('body-one', secret, ts);
    const sig2 = signPayload('body-two', secret, ts);

    expect(sig1).not.toBe(sig2);
  });

  it('produces different signatures for different secrets', () => {
    const body = 'same-body';
    const ts = '1700000000';

    const sig1 = signPayload(body, 'secret-1', ts);
    const sig2 = signPayload(body, 'secret-2', ts);

    expect(sig1).not.toBe(sig2);
  });

  it('produces different signatures for different timestamps', () => {
    const body = 'same-body';
    const secret = 'same-secret';

    const sig1 = signPayload(body, secret, '1700000000');
    const sig2 = signPayload(body, secret, '1700000001');

    expect(sig1).not.toBe(sig2);
  });

  it('signature format is hex string', () => {
    const result = signPayload('body', 'secret', '123');
    expect(result).toMatch(/^[0-9a-f]{64}$/);
  });
});

// ── deliverWebhook ────────────────────────────────────────────────

describe('deliverWebhook', () => {
  const subscription = {
    id: 'wh-1',
    url: 'https://example.com/webhook',
    secret: 'test-secret',
    failure_count: 0,
  };
  const event: WebhookEvent = 'message.sent';
  const chatbotId = 'bot-1';
  const data = {
    conversation_id: 'conv-1',
    message: {
      id: 'msg-1',
      role: 'assistant' as const,
      content: 'Hello',
      created_at: '2024-01-01T00:00:00Z',
    },
  };

  it('returns success on 200 response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

    const result = await deliverWebhook(subscription, event, chatbotId, data);

    expect(result.success).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.attempts).toBe(1);
    expect(result.deliveryId).toBe('test-delivery-id');
  });

  it('sends correct headers', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

    await deliverWebhook(subscription, event, chatbotId, data);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://example.com/webhook');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers['X-VocUI-Event']).toBe('message.sent');
    expect(options.headers['X-VocUI-Signature']).toMatch(/^sha256=[0-9a-f]{64}$/);
    expect(options.headers['X-VocUI-Delivery-ID']).toBe('test-delivery-id');
    expect(options.headers['X-VocUI-Timestamp']).toBeDefined();
    expect(options.headers['User-Agent']).toBe('VocUI-Webhooks/1.0');
  });

  it('sends envelope with correct structure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

    await deliverWebhook(subscription, event, chatbotId, data);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.event).toBe('message.sent');
    expect(body.chatbot_id).toBe('bot-1');
    expect(body.delivery_id).toBe('test-delivery-id');
    expect(body.version).toBe('v1');
    expect(body.data).toEqual(data);
    expect(body.timestamp).toBeDefined();
  });

  it('retries on 5xx errors', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500, text: async () => 'Server Error' })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    const resultPromise = deliverWebhook(subscription, event, chatbotId, data);

    // Advance past first retry backoff (1s)
    await vi.advanceTimersByTimeAsync(1_000);

    const result = await resultPromise;
    expect(result.success).toBe(true);
    expect(result.attempts).toBe(2);
  });

  it('retries on 429 (rate limited)', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 429, text: async () => 'Too Many Requests' })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    const resultPromise = deliverWebhook(subscription, event, chatbotId, data);
    await vi.advanceTimersByTimeAsync(1_000);

    const result = await resultPromise;
    expect(result.success).toBe(true);
    expect(result.attempts).toBe(2);
  });

  it('does not retry on 4xx errors (except 429)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Bad Request',
    });

    const result = await deliverWebhook(subscription, event, chatbotId, data);

    expect(result.success).toBe(false);
    expect(result.attempts).toBe(1);
    expect(result.error).toBe('HTTP 400');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry on 404', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => 'Not Found',
    });

    const result = await deliverWebhook(subscription, event, chatbotId, data);

    expect(result.success).toBe(false);
    expect(result.attempts).toBe(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries on network errors', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('fetch failed'))
      .mockResolvedValueOnce({ ok: true, status: 200 });

    const resultPromise = deliverWebhook(subscription, event, chatbotId, data);
    await vi.advanceTimersByTimeAsync(1_000);

    const result = await resultPromise;
    expect(result.success).toBe(true);
    expect(result.attempts).toBe(2);
  });

  it('fails after max retries', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 503, text: async () => 'Unavailable' });

    const resultPromise = deliverWebhook(subscription, event, chatbotId, data);

    // Advance through all retry backoffs: 1s + 2s + 4s
    await vi.advanceTimersByTimeAsync(1_000);
    await vi.advanceTimersByTimeAsync(2_000);
    await vi.advanceTimersByTimeAsync(4_000);

    const result = await resultPromise;
    expect(result.success).toBe(false);
    expect(result.attempts).toBe(4); // MAX_RETRIES = 4
    expect(result.error).toBe('HTTP 503');
  });

  it('uses exponential backoff between retries', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, text: async () => 'Error' });

    const promise = deliverWebhook(subscription, event, chatbotId, data);

    // Flush microtasks so the async validateWebhookURL resolves and first fetch fires
    await vi.advanceTimersByTimeAsync(0);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // After 1s: second attempt (2^0 * 1000)
    await vi.advanceTimersByTimeAsync(1_000);
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // After 2s: third attempt (2^1 * 1000)
    await vi.advanceTimersByTimeAsync(2_000);
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // After 4s: fourth attempt (2^2 * 1000)
    await vi.advanceTimersByTimeAsync(4_000);
    expect(mockFetch).toHaveBeenCalledTimes(4);

    await promise;
  });

  it('captures network error messages', async () => {
    mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

    const resultPromise = deliverWebhook(subscription, event, chatbotId, data);

    // Advance through all backoffs
    await vi.advanceTimersByTimeAsync(1_000);
    await vi.advanceTimersByTimeAsync(2_000);
    await vi.advanceTimersByTimeAsync(4_000);

    const result = await resultPromise;
    expect(result.success).toBe(false);
    expect(result.error).toBe('ECONNREFUSED');
  });
});
