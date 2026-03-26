import { describe, it, expect, vi, beforeEach } from 'vitest';
import type Stripe from 'stripe';

// -------------------------------------------------------
// Mocks
// -------------------------------------------------------

// Track all Supabase operations for assertions
let dbOps: Array<{ table: string; op: string; args: any }> = [];

function makeChain(table: string) {
  const chain: any = {};
  const ops = ['select', 'eq', 'is', 'not', 'order', 'limit', 'single', 'maybeSingle'];
  for (const op of ops) {
    chain[op] = vi.fn((...args: any[]) => {
      dbOps.push({ table, op, args });
      return chain;
    });
  }
  // Default resolved value for terminal ops
  chain.single = vi.fn((...args: any[]) => {
    dbOps.push({ table, op: 'single', args });
    return Promise.resolve({ data: null, error: null });
  });
  chain.maybeSingle = vi.fn((...args: any[]) => {
    dbOps.push({ table, op: 'maybeSingle', args });
    return Promise.resolve({ data: null, error: null });
  });

  chain.update = vi.fn((data: any) => {
    dbOps.push({ table, op: 'update', args: data });
    // Return a new chainable that resolves
    const updateChain: any = {};
    for (const op of ['eq', 'is', 'not', 'select', 'single', 'maybeSingle']) {
      updateChain[op] = vi.fn((...a: any[]) => {
        dbOps.push({ table, op: `update.${op}`, args: a });
        return updateChain;
      });
    }
    updateChain.single = vi.fn((...a: any[]) => {
      dbOps.push({ table, op: 'update.single', args: a });
      return Promise.resolve({ data: null, error: null });
    });
    // Allow .then() to be called on the chain itself (non-terminal update)
    updateChain.then = (resolve: any) => resolve({ data: null, error: null });
    return updateChain;
  });

  chain.insert = vi.fn((data: any) => {
    dbOps.push({ table, op: 'insert', args: data });
    return Promise.resolve({ data: null, error: null });
  });

  return chain;
}

// Store per-table overrides
let tableOverrides: Record<string, (chain: any) => void> = {};

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => {
    const client: any = {
      from: vi.fn((table: string) => {
        const chain = makeChain(table);
        if (tableOverrides[table]) {
          tableOverrides[table](chain);
        }
        return chain;
      }),
      rpc: vi.fn((...args: any[]) => {
        dbOps.push({ table: '__rpc', op: 'rpc', args });
        return Promise.resolve({ data: null, error: null });
      }),
    };
    return client;
  }),
}));

vi.mock('./client', () => ({
  getStripeClient: vi.fn(() => ({
    subscriptions: {
      retrieve: vi.fn().mockResolvedValue({
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400,
      }),
    },
  })),
}));

import {
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
} from './webhooks';

// -------------------------------------------------------
// Setup
// -------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
  dbOps = [];
  tableOverrides = {};
});

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

function makeSession(overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Checkout.Session {
  return {
    id: 'cs_test_123',
    mode: 'subscription',
    customer: 'cus_123',
    subscription: 'sub_123',
    payment_intent: 'pi_123',
    metadata: {
      user_id: 'user-1',
      plan_id: 'plan-1',
      plan_slug: 'pro',
      billing_interval: 'monthly',
    },
    ...overrides,
  } as any;
}

function makeSubscription(overrides: Partial<Stripe.Subscription> = {}): Stripe.Subscription {
  return {
    id: 'sub_123',
    status: 'active',
    metadata: { user_id: 'user-1' },
    current_period_start: Math.floor(Date.now() / 1000),
    current_period_end: Math.floor(Date.now() / 1000) + 30 * 86400,
    cancel_at_period_end: false,
    ...overrides,
  } as any;
}

function makeInvoice(overrides: Partial<Stripe.Invoice> = {}): Stripe.Invoice {
  return {
    id: 'in_123',
    subscription: 'sub_123',
    ...overrides,
  } as any;
}

// -------------------------------------------------------
// handleCheckoutCompleted
// -------------------------------------------------------

describe('handleCheckoutCompleted', () => {
  it('does nothing when user_id is missing (non-credit-purchase)', async () => {
    const session = makeSession({ metadata: {} as any });
    await handleCheckoutCompleted(session);

    // Should not have updated subscriptions
    const subUpdates = dbOps.filter((op) => op.table === 'subscriptions' && op.op === 'update');
    expect(subUpdates).toHaveLength(0);
  });

  describe('subscription mode', () => {
    it('updates subscription with correct fields', async () => {
      tableOverrides['subscription_plans'] = (chain) => {
        chain.single = vi.fn().mockResolvedValue({
          data: { id: 'plan-1', credits_monthly: 3000 },
          error: null,
        });
      };

      await handleCheckoutCompleted(makeSession());

      const subUpdate = dbOps.find((op) => op.table === 'subscriptions' && op.op === 'update');
      expect(subUpdate).toBeDefined();
      expect(subUpdate!.args).toMatchObject({
        stripe_customer_id: 'cus_123',
        stripe_subscription_id: 'sub_123',
        plan_id: 'plan-1',
        plan: 'pro',
        status: 'active',
        billing_interval: 'monthly',
      });
    });

    it('resets usage credits to 0 and sets new limit from plan', async () => {
      tableOverrides['subscription_plans'] = (chain) => {
        chain.single = vi.fn().mockResolvedValue({
          data: { id: 'plan-1', credits_monthly: 5000 },
          error: null,
        });
      };

      await handleCheckoutCompleted(makeSession());

      const usageUpdate = dbOps.find((op) => op.table === 'usage' && op.op === 'update');
      expect(usageUpdate).toBeDefined();
      expect(usageUpdate!.args).toMatchObject({
        credits_limit: 5000,
        credits_used: 0,
      });
    });

    it('records trial link redemption when trial_link_id present', async () => {
      tableOverrides['subscription_plans'] = (chain) => {
        chain.single = vi.fn().mockResolvedValue({ data: null, error: null });
      };
      tableOverrides['trial_links'] = (chain) => {
        chain.single = vi.fn().mockResolvedValue({
          data: { redemptions_count: 3 },
          error: null,
        });
      };

      const session = makeSession({
        metadata: {
          user_id: 'user-1',
          plan_id: 'plan-1',
          plan_slug: 'pro',
          trial_link_id: 'trial-1',
        } as any,
      });

      await handleCheckoutCompleted(session);

      const trialUpdate = dbOps.find((op) => op.table === 'trial_links' && op.op === 'update');
      expect(trialUpdate).toBeDefined();
      expect(trialUpdate!.args).toMatchObject({ redemptions_count: 4 });
    });
  });

  describe('payment mode (credit purchase)', () => {
    it('calls add_purchased_credits RPC', async () => {
      const session = makeSession({
        mode: 'payment',
        metadata: {
          user_id: 'user-1',
          credit_amount: '500',
          type: 'purchase',
        } as any,
      });

      await handleCheckoutCompleted(session);

      const rpcCall = dbOps.find((op) => op.table === '__rpc');
      expect(rpcCall).toBeDefined();
      expect(rpcCall!.args[0]).toBe('add_purchased_credits');
      expect(rpcCall!.args[1]).toMatchObject({
        p_user_id: 'user-1',
        p_amount: 500,
      });
    });

    it('skips when credit_amount is 0', async () => {
      const session = makeSession({
        mode: 'payment',
        metadata: {
          user_id: 'user-1',
          credit_amount: '0',
        } as any,
      });

      await handleCheckoutCompleted(session);

      const rpcCall = dbOps.find((op) => op.table === '__rpc');
      expect(rpcCall).toBeUndefined();
    });

    it('skips when credit_amount is missing', async () => {
      const session = makeSession({
        mode: 'payment',
        metadata: { user_id: 'user-1' } as any,
      });

      await handleCheckoutCompleted(session);

      const rpcCall = dbOps.find((op) => op.table === '__rpc');
      expect(rpcCall).toBeUndefined();
    });
  });

  describe('chatbot credit purchase', () => {
    it('increases monthly_message_limit on the chatbot', async () => {
      tableOverrides['chatbots'] = (chain) => {
        chain.single = vi.fn().mockResolvedValue({
          data: { monthly_message_limit: 100 },
          error: null,
        });
      };

      const session = makeSession({
        mode: 'payment',
        metadata: {
          type: 'credit_purchase',
          chatbot_id: 'bot-1',
          credit_amount: '200',
        } as any,
      });

      await handleCheckoutCompleted(session);

      const chatbotUpdate = dbOps.find((op) => op.table === 'chatbots' && op.op === 'update');
      expect(chatbotUpdate).toBeDefined();
      expect(chatbotUpdate!.args).toMatchObject({ monthly_message_limit: 300 }); // 100 + 200
    });

    it('skips when chatbot_id is missing', async () => {
      const session = makeSession({
        mode: 'payment',
        metadata: {
          type: 'credit_purchase',
          credit_amount: '200',
        } as any,
      });

      await handleCheckoutCompleted(session);

      const chatbotUpdate = dbOps.filter((op) => op.table === 'chatbots' && op.op === 'update');
      expect(chatbotUpdate).toHaveLength(0);
    });
  });
});

// -------------------------------------------------------
// handleSubscriptionUpdated
// -------------------------------------------------------

describe('handleSubscriptionUpdated', () => {
  it('updates subscription status and period dates', async () => {
    const sub = makeSubscription({ status: 'past_due' });
    await handleSubscriptionUpdated(sub);

    const update = dbOps.find((op) => op.table === 'subscriptions' && op.op === 'update');
    expect(update).toBeDefined();
    expect(update!.args).toMatchObject({
      status: 'past_due',
      cancel_at_period_end: false,
    });
    expect(update!.args.current_period_start).toBeDefined();
    expect(update!.args.current_period_end).toBeDefined();
  });

  it('looks up user by subscription ID when metadata missing', async () => {
    tableOverrides['subscriptions'] = (chain) => {
      chain.single = vi.fn().mockResolvedValue({
        data: { user_id: 'user-1' },
        error: null,
      });
    };

    const sub = makeSubscription({ metadata: {} as any });
    await handleSubscriptionUpdated(sub);

    // Should query subscriptions to find user_id
    const selectOps = dbOps.filter((op) => op.table === 'subscriptions' && op.op === 'select');
    expect(selectOps.length).toBeGreaterThan(0);
  });
});

// -------------------------------------------------------
// handleSubscriptionDeleted
// -------------------------------------------------------

describe('handleSubscriptionDeleted', () => {
  it('downgrades to base plan', async () => {
    tableOverrides['subscription_plans'] = (chain) => {
      chain.single = vi.fn().mockResolvedValue({
        data: { id: 'base-plan-id', credits_monthly: 500000 },
        error: null,
      });
    };
    tableOverrides['subscriptions'] = (chain) => {
      chain.update = vi.fn((data: any) => {
        dbOps.push({ table: 'subscriptions', op: 'update', args: data });
        const updateChain: any = {};
        ['eq', 'select', 'single'].forEach((op) => {
          updateChain[op] = vi.fn((...a: any[]) => {
            dbOps.push({ table: 'subscriptions', op: `update.${op}`, args: a });
            return updateChain;
          });
        });
        updateChain.single = vi.fn(() =>
          Promise.resolve({ data: { user_id: 'user-1' }, error: null })
        );
        return updateChain;
      });
    };

    await handleSubscriptionDeleted(makeSubscription());

    const subUpdate = dbOps.find((op) => op.table === 'subscriptions' && op.op === 'update');
    expect(subUpdate).toBeDefined();
    expect(subUpdate!.args).toMatchObject({
      status: 'canceled',
      plan: 'base',
      plan_id: 'base-plan-id',
      stripe_subscription_id: null,
      cancel_at_period_end: false,
    });
  });

  it('resets usage limits to base plan credits', async () => {
    tableOverrides['subscription_plans'] = (chain) => {
      chain.single = vi.fn().mockResolvedValue({
        data: { id: 'base-plan-id', credits_monthly: 500000 },
        error: null,
      });
    };
    tableOverrides['subscriptions'] = (chain) => {
      chain.update = vi.fn((data: any) => {
        dbOps.push({ table: 'subscriptions', op: 'update', args: data });
        const updateChain: any = {};
        ['eq', 'select', 'single'].forEach((op) => {
          updateChain[op] = vi.fn((...a: any[]) => {
            dbOps.push({ table: 'subscriptions', op: `update.${op}`, args: a });
            return updateChain;
          });
        });
        updateChain.single = vi.fn(() =>
          Promise.resolve({ data: { user_id: 'user-1' }, error: null })
        );
        return updateChain;
      });
    };

    await handleSubscriptionDeleted(makeSubscription());

    const usageUpdate = dbOps.find((op) => op.table === 'usage' && op.op === 'update');
    expect(usageUpdate).toBeDefined();
    expect(usageUpdate!.args).toMatchObject({ credits_limit: 500000 });
  });
});

// -------------------------------------------------------
// handleInvoicePaid
// -------------------------------------------------------

describe('handleInvoicePaid', () => {
  it('skips non-subscription invoices', async () => {
    await handleInvoicePaid(makeInvoice({ subscription: null as any }));
    expect(dbOps).toHaveLength(0);
  });

  it('clears grace period fields', async () => {
    tableOverrides['subscriptions'] = (chain) => {
      chain.single = vi.fn().mockResolvedValue({
        data: { user_id: 'user-1', plan_id: 'plan-1' },
        error: null,
      });
    };
    tableOverrides['subscription_plans'] = (chain) => {
      chain.single = vi.fn().mockResolvedValue({
        data: { credits_monthly: 3000 },
        error: null,
      });
    };

    await handleInvoicePaid(makeInvoice());

    const subUpdate = dbOps.find((op) => op.table === 'subscriptions' && op.op === 'update');
    expect(subUpdate).toBeDefined();
    expect(subUpdate!.args).toMatchObject({
      status: 'active',
      payment_failed_at: null,
      grace_period_ends_at: null,
    });
  });

  it('resets usage credits to 0 for new billing period', async () => {
    tableOverrides['subscriptions'] = (chain) => {
      chain.single = vi.fn().mockResolvedValue({
        data: { user_id: 'user-1', plan_id: 'plan-1' },
        error: null,
      });
    };
    tableOverrides['subscription_plans'] = (chain) => {
      chain.single = vi.fn().mockResolvedValue({
        data: { credits_monthly: 3000 },
        error: null,
      });
    };

    await handleInvoicePaid(makeInvoice());

    const usageUpdate = dbOps.find((op) => op.table === 'usage' && op.op === 'update');
    expect(usageUpdate).toBeDefined();
    expect(usageUpdate!.args).toMatchObject({
      credits_used: 0,
      credits_limit: 3000,
    });
  });

  it('logs credit_transactions entry for reset', async () => {
    tableOverrides['subscriptions'] = (chain) => {
      chain.single = vi.fn().mockResolvedValue({
        data: { user_id: 'user-1', plan_id: 'plan-1' },
        error: null,
      });
    };

    await handleInvoicePaid(makeInvoice());

    const txInsert = dbOps.find((op) => op.table === 'credit_transactions' && op.op === 'insert');
    expect(txInsert).toBeDefined();
    expect(txInsert!.args).toMatchObject({
      user_id: 'user-1',
      type: 'plan_allocation',
    });
  });

  it('uses default 100 credits when plan not found', async () => {
    tableOverrides['subscriptions'] = (chain) => {
      chain.single = vi.fn().mockResolvedValue({
        data: { user_id: 'user-1', plan_id: null },
        error: null,
      });
    };

    await handleInvoicePaid(makeInvoice());

    const usageUpdate = dbOps.find((op) => op.table === 'usage' && op.op === 'update');
    expect(usageUpdate).toBeDefined();
    expect(usageUpdate!.args.credits_limit).toBe(100);
  });
});

// -------------------------------------------------------
// handleInvoicePaymentFailed
// -------------------------------------------------------

describe('handleInvoicePaymentFailed', () => {
  it('skips non-subscription invoices', async () => {
    await handleInvoicePaymentFailed(makeInvoice({ subscription: null as any }));
    expect(dbOps).toHaveLength(0);
  });

  it('sets status to past_due', async () => {
    await handleInvoicePaymentFailed(makeInvoice());

    const updates = dbOps.filter((op) => op.table === 'subscriptions' && op.op === 'update');
    expect(updates.length).toBeGreaterThan(0);
    // The fallback update always sets past_due
    const fallbackUpdate = updates[updates.length - 1];
    expect(fallbackUpdate.args).toMatchObject({ status: 'past_due' });
  });

  it('sets 7-day grace period on first failure', async () => {
    await handleInvoicePaymentFailed(makeInvoice());

    const firstUpdate = dbOps.find((op) => op.table === 'subscriptions' && op.op === 'update');
    expect(firstUpdate).toBeDefined();
    expect(firstUpdate!.args.payment_failed_at).toBeDefined();
    expect(firstUpdate!.args.grace_period_ends_at).toBeDefined();

    // Verify grace period is ~7 days from now
    const gracePeriodEnd = new Date(firstUpdate!.args.grace_period_ends_at);
    const now = new Date(firstUpdate!.args.payment_failed_at);
    const diffDays = (gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeCloseTo(7, 0);
  });

  it('only sets grace period where payment_failed_at is null (COALESCE)', async () => {
    await handleInvoicePaymentFailed(makeInvoice());

    // First update should have .is('payment_failed_at', null) constraint
    const isOps = dbOps.filter(
      (op) => op.table === 'subscriptions' && op.op === 'update.is'
    );
    expect(isOps.length).toBeGreaterThan(0);
    expect(isOps[0].args).toEqual(['payment_failed_at', null]);
  });

  it('handles subscription as string or object', async () => {
    // String subscription ID
    await handleInvoicePaymentFailed(makeInvoice({ subscription: 'sub_abc' as any }));
    const ops1 = dbOps.filter((op) => op.table === 'subscriptions');
    expect(ops1.length).toBeGreaterThan(0);

    dbOps = [];

    // Object subscription ID
    await handleInvoicePaymentFailed(makeInvoice({ subscription: { id: 'sub_xyz' } as any }));
    const ops2 = dbOps.filter((op) => op.table === 'subscriptions');
    expect(ops2.length).toBeGreaterThan(0);
  });
});
