import { describe, it, expect, vi, beforeEach } from 'vitest';

// -------------------------------------------------------
// Mocks — declared before imports
// -------------------------------------------------------

// Track Supabase operations per-table
type DbOp = { table: string; op: string; args: unknown };
let dbOps: DbOp[] = [];

// Per-table return value overrides: table -> terminal op -> resolved value
let tableReturns: Record<string, Record<string, unknown>> = {};

function makeChain(table: string) {
  const terminal = (op: string, defaultVal: unknown) =>
    vi.fn((...args: unknown[]) => {
      dbOps.push({ table, op, args });
      const override = tableReturns[table]?.[op];
      return Promise.resolve(override !== undefined ? override : defaultVal);
    });

  const chain: any = {
    insert: vi.fn((data: unknown) => {
      dbOps.push({ table, op: 'insert', args: data });
      return Promise.resolve(tableReturns[table]?.insert ?? { data: null, error: null });
    }),
    select: vi.fn((...args: unknown[]) => {
      dbOps.push({ table, op: 'select', args });
      return chain;
    }),
    eq: vi.fn((...args: unknown[]) => {
      dbOps.push({ table, op: 'eq', args });
      return chain;
    }),
    lte: vi.fn((...args: unknown[]) => {
      dbOps.push({ table, op: 'lte', args });
      return chain;
    }),
    gt: vi.fn((...args: unknown[]) => {
      dbOps.push({ table, op: 'gt', args });
      return chain;
    }),
    update: vi.fn((data: unknown) => {
      dbOps.push({ table, op: 'update', args: data });
      return chain;
    }),
    maybeSingle: terminal('maybeSingle', { data: null, error: null }),
    single: terminal('single', { data: null, error: null }),
  };

  return chain;
}

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn((table: string) => makeChain(table)),
  })),
}));

vi.mock('@/lib/settings', () => ({
  getAppSettings: vi.fn().mockResolvedValue({ token_multiplier: 1 }),
}));

import { logAPICall } from './logging';

// -------------------------------------------------------
// Setup
// -------------------------------------------------------

beforeEach(() => {
  dbOps = [];
  tableReturns = {};
  vi.clearAllMocks();
});

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

function usageRow(credits_used = 50) {
  return { id: 'usage-1', credits_used };
}

function opsFor(table: string, op: string) {
  return dbOps.filter((d) => d.table === table && d.op === op);
}

// -------------------------------------------------------
// Tests
// -------------------------------------------------------

describe('logAPICall — credits_used increment', () => {
  it('increments credits_used by total tokens on a successful call', async () => {
    tableReturns['usage'] = { maybeSingle: { data: usageRow(50), error: null } };

    await logAPICall({
      user_id: 'user-1',
      endpoint: '/api/chat',
      tokens_input: 100,
      tokens_output: 200,
      status_code: 200,
    });

    const updates = opsFor('usage', 'update');
    expect(updates).toHaveLength(1);
    // 50 existing + (100 + 200) new = 350
    expect(updates[0].args).toMatchObject({ credits_used: 350 });
  });

  it('does NOT increment credits_used when tokens = 0 (error call with no tokens)', async () => {
    tableReturns['usage'] = { maybeSingle: { data: usageRow(50), error: null } };

    await logAPICall({
      user_id: 'user-1',
      endpoint: '/api/chat',
      tokens_input: 0,
      tokens_output: 0,
      status_code: 500,
      error_message: 'Provider error',
    });

    const updates = opsFor('usage', 'update');
    expect(updates).toHaveLength(0);
  });

  it('does NOT increment credits_used when tokens = 0 even on a 200 response', async () => {
    tableReturns['usage'] = { maybeSingle: { data: usageRow(50), error: null } };

    await logAPICall({
      user_id: 'user-1',
      endpoint: '/api/chat',
      tokens_input: 0,
      tokens_output: 0,
      status_code: 200,
    });

    const updates = opsFor('usage', 'update');
    expect(updates).toHaveLength(0);
  });

  it('does NOT increment credits_used on a 4xx error response', async () => {
    tableReturns['usage'] = { maybeSingle: { data: usageRow(50), error: null } };

    await logAPICall({
      user_id: 'user-1',
      endpoint: '/api/chat',
      tokens_input: 300,
      tokens_output: 100,
      status_code: 400,
    });

    const updates = opsFor('usage', 'update');
    expect(updates).toHaveLength(0);
  });

  it('does not throw when no usage row exists for the current period', async () => {
    tableReturns['usage'] = { maybeSingle: { data: null, error: null } };

    await expect(
      logAPICall({
        user_id: 'user-1',
        endpoint: '/api/chat',
        tokens_input: 100,
        tokens_output: 50,
        status_code: 200,
      })
    ).resolves.toBeUndefined();

    // No update should have been attempted
    const updates = opsFor('usage', 'update');
    expect(updates).toHaveLength(0);
  });

  it('does not increment credits_used when user_id is absent', async () => {
    await logAPICall({
      endpoint: '/api/chat',
      tokens_input: 100,
      tokens_output: 200,
      status_code: 200,
    });

    const updates = opsFor('usage', 'update');
    expect(updates).toHaveLength(0);
  });

  it('still inserts the api_log row even when tokens = 0', async () => {
    await logAPICall({
      user_id: 'user-1',
      endpoint: '/api/chat',
      tokens_input: 0,
      tokens_output: 0,
      status_code: 200,
    });

    const inserts = opsFor('api_logs', 'insert');
    expect(inserts).toHaveLength(1);
  });

  it('filters usage by the current billing period using lte/gt on period_start/period_end', async () => {
    tableReturns['usage'] = { maybeSingle: { data: usageRow(0), error: null } };

    await logAPICall({
      user_id: 'user-1',
      endpoint: '/api/chat',
      tokens_input: 10,
      tokens_output: 10,
      status_code: 200,
    });

    const lteOps = opsFor('usage', 'lte');
    const gtOps = opsFor('usage', 'gt');
    expect(lteOps).toHaveLength(1);
    expect(gtOps).toHaveLength(1);
    // Both ops should reference period_start / period_end
    expect(lteOps[0].args).toContain('period_start');
    expect(gtOps[0].args).toContain('period_end');
  });

  it('treats missing status_code as a success (no code = non-error)', async () => {
    tableReturns['usage'] = { maybeSingle: { data: usageRow(10), error: null } };

    await logAPICall({
      user_id: 'user-1',
      endpoint: '/api/chat',
      tokens_input: 50,
      tokens_output: 50,
      // no status_code
    });

    const updates = opsFor('usage', 'update');
    expect(updates).toHaveLength(1);
    expect(updates[0].args).toMatchObject({ credits_used: 110 }); // 10 + 100
  });
});
