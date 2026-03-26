import { describe, it, expect } from 'vitest';
import { APIError } from './utils';

describe('APIError', () => {
  it('creates an error with defaults', () => {
    const err = new APIError('Something broke');
    expect(err.message).toBe('Something broke');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBeUndefined();
    expect(err.name).toBe('APIError');
    expect(err).toBeInstanceOf(Error);
  });

  it('creates an error with custom status and code', () => {
    const err = new APIError('Nope', 418, 'TEAPOT');
    expect(err.statusCode).toBe(418);
    expect(err.code).toBe('TEAPOT');
  });

  describe('static factories', () => {
    it('badRequest -> 400', () => {
      const err = APIError.badRequest('bad input');
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('BAD_REQUEST');
      expect(err.message).toBe('bad input');
    });

    it('badRequest with custom code', () => {
      const err = APIError.badRequest('bad', 'CUSTOM');
      expect(err.code).toBe('CUSTOM');
    });

    it('unauthorized -> 401', () => {
      const err = APIError.unauthorized();
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('UNAUTHORIZED');
      expect(err.message).toBe('Unauthorized');
    });

    it('unauthorized with custom message', () => {
      const err = APIError.unauthorized('No token');
      expect(err.message).toBe('No token');
    });

    it('forbidden -> 403', () => {
      const err = APIError.forbidden();
      expect(err.statusCode).toBe(403);
      expect(err.code).toBe('FORBIDDEN');
    });

    it('notFound -> 404', () => {
      const err = APIError.notFound();
      expect(err.statusCode).toBe(404);
      expect(err.code).toBe('NOT_FOUND');
    });

    it('rateLimited -> 429', () => {
      const err = APIError.rateLimited();
      expect(err.statusCode).toBe(429);
      expect(err.code).toBe('RATE_LIMITED');
    });

    it('internal -> 500', () => {
      const err = APIError.internal();
      expect(err.statusCode).toBe(500);
      expect(err.code).toBe('INTERNAL_ERROR');
    });

    it('usageLimitReached -> 403 with USAGE_LIMIT_REACHED code', () => {
      const err = APIError.usageLimitReached();
      expect(err.statusCode).toBe(403);
      expect(err.code).toBe('USAGE_LIMIT_REACHED');
    });

    it('usageLimitReached with custom message', () => {
      const err = APIError.usageLimitReached('Out of credits');
      expect(err.message).toBe('Out of credits');
    });
  });
});
