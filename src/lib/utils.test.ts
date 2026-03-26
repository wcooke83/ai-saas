import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  truncate,
  slugify,
  isEmpty,
  capitalize,
  formatBytes,
  safeJSONParse,
  pick,
  omit,
  debounce,
  throttle,
  formatCurrency,
  formatNumber,
  deepClone,
} from './utils';

describe('truncate', () => {
  it('returns string as-is if under limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns string as-is at exact limit', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates with ellipsis', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world');
  });

  it('removes leading/trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a   b___c---d')).toBe('a-b-c-d');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });
});

describe('isEmpty', () => {
  it('returns true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('returns true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('returns true for whitespace-only string', () => {
    expect(isEmpty('   ')).toBe(true);
  });

  it('returns true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('returns true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('returns false for zero', () => {
    expect(isEmpty(0)).toBe(false);
  });

  it('returns false for false', () => {
    expect(isEmpty(false)).toBe(false);
  });

  it('returns false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('returns false for non-empty array', () => {
    expect(isEmpty([1])).toBe(false);
  });

  it('returns false for non-empty object', () => {
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('handles single character', () => {
    expect(capitalize('h')).toBe('H');
  });

  it('handles already capitalized', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('formatBytes', () => {
  it('returns "0 Bytes" for 0', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats bytes', () => {
    expect(formatBytes(500)).toBe('500 Bytes');
  });

  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats megabytes', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('formats gigabytes', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  it('respects decimals parameter', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
  });
});

describe('safeJSONParse', () => {
  it('parses valid JSON', () => {
    expect(safeJSONParse('{"a":1}', {})).toEqual({ a: 1 });
  });

  it('returns fallback for invalid JSON', () => {
    expect(safeJSONParse('not json', { default: true })).toEqual({ default: true });
  });

  it('returns fallback for empty string', () => {
    expect(safeJSONParse('', null)).toBe(null);
  });

  it('parses arrays', () => {
    expect(safeJSONParse('[1,2,3]', [])).toEqual([1, 2, 3]);
  });
});

describe('pick', () => {
  it('picks specified keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('ignores missing keys', () => {
    expect(pick({ a: 1 } as any, ['a', 'b'])).toEqual({ a: 1 });
  });
});

describe('omit', () => {
  it('omits specified keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('returns full object when no keys omitted', () => {
    expect(omit({ a: 1 }, [])).toEqual({ a: 1 });
  });
});

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(19.99)).toBe('$19.99');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('formatNumber', () => {
  it('formats with commas', () => {
    expect(formatNumber(1000000)).toBe('1,000,000');
  });
});

describe('deepClone', () => {
  it('creates a deep copy', () => {
    const original = { a: { b: [1, 2, 3] } };
    const cloned = deepClone(original);
    cloned.a.b.push(4);
    expect(original.a.b).toEqual([1, 2, 3]);
  });
});

describe('debounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('delays execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('resets timer on subsequent calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledOnce();
  });
});

describe('throttle', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('executes immediately on first call', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledOnce();
  });

  it('blocks calls within delay window', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledOnce();
  });

  it('allows calls after delay expires', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    vi.advanceTimersByTime(100);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
