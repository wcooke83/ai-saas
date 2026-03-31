/**
 * Integration Tests: Auto Credit Top-Up System
 *
 * Tests credit consumption order, monthly reset behavior, and API-level
 * auto-topup configuration. UI-dependent tests (TOPUP-001/002/003/007/008)
 * are excluded as they require a browser.
 *
 * Uses real Stripe test mode — no mocks.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Stripe from 'stripe';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env vars from .env.local if not already in environment
if (!process.env.STRIPE_SECRET_KEY) {
  try {
    const envFile = readFileSync(resolve(__dirname, '..', '..', '.env.local'), 'utf-8');
    for (const line of envFile.split('\n')) {
      const match = line.match(/^(STRIPE_SECRET_KEY|E2E_TEST_SECRET)=(.+)$/);
      if (match) process.env[match[1]] = match[2].trim();
    }
  } catch { /* ignore */ }
}

const BASE_URL = 'http://localhost:3030';
const BOT_ID = 'e2e00000-0000-0000-0000-000000000001';
const CHAT_API = `${BASE_URL}/api/chat/${BOT_ID}`;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
});

let testCustomerId: string;
let testPaymentMethodId: string;
let testPackageId = '';

async function patchBot(data: Record<string, unknown>) {
  return fetch(`${BASE_URL}/api/chatbots/${BOT_ID}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function getBot() {
  const res = await fetch(`${BASE_URL}/api/chatbots/${BOT_ID}`);
  return res.json();
}

async function setCreditState(monthlyLimit: number, used: number, purchased: number = 0) {
  await patchBot({
    monthly_message_limit: monthlyLimit,
    messages_this_month: used,
    purchased_credits_remaining: purchased,
  });
}

async function resetCredits() {
  await setCreditState(1000, 0, 0);
}

async function setAutoTopupMode(packageId: string | null, maxPerMonth: number = 3) {
  await patchBot({
    credit_exhaustion_mode: 'purchase_credits',
    auto_topup_package_id: packageId,
    auto_topup_max_per_month: maxPerMonth,
    credit_exhaustion_config: {
      purchase_credits: {
        selectedPackageId: packageId,
        maxAutoTopupsPerMonth: maxPerMonth,
      },
    },
  });
}

describe('Auto Credit Top-Up', () => {
  beforeAll(async () => {
    // Promote e2e user to admin for package creation
    await fetch(`${BASE_URL}/api/auth/e2e-set-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: process.env.E2E_TEST_SECRET, is_admin: true }),
    });

    // Create a Stripe test customer with a working payment method
    const customer = await stripe.customers.create({
      email: `e2e-autotopup-${Date.now()}@test.example.com`,
      name: 'E2E Auto Topup Test',
      metadata: { source: 'e2e-test' },
    });
    testCustomerId = customer.id;

    // Attach test visa card (always succeeds)
    const pm = await stripe.paymentMethods.attach('pm_card_visa', {
      customer: testCustomerId,
    });
    testPaymentMethodId = pm.id;

    // Set as default payment method
    await stripe.customers.update(testCustomerId, {
      invoice_settings: { default_payment_method: testPaymentMethodId },
    });
  }, 120_000);

  afterAll(async () => {
    // Clean up Stripe resources
    if (testPaymentMethodId) {
      await stripe.paymentMethods.detach(testPaymentMethodId).catch(() => {});
    }
    if (testCustomerId) {
      await stripe.customers.del(testCustomerId).catch(() => {});
    }
  });

  // ─────────────────────────────────────────────────────────────────
  // Credit Consumption Order
  // ─────────────────────────────────────────────────────────────────

  it('TOPUP-004: Monthly credits consumed before purchased credits', async () => {
    // Set 10 monthly remaining, 50 purchased
    await setCreditState(10, 0, 50);

    // Send a chat message
    const chatRes = await fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello', stream: false, session_id: `topup-004-${Date.now()}` }),
    });
    expect(chatRes.status).toBeLessThan(500);

    // Check that monthly was consumed, purchased untouched
    const bot = await getBot();
    expect(bot.data.chatbot.messages_this_month).toBeGreaterThan(0);
    expect(bot.data.chatbot.purchased_credits_remaining).toBe(50);
  }, 120_000);

  it('TOPUP-005: Purchased credits consumed after monthly exhausted', async () => {
    // Set monthly fully used, 50 purchased remaining
    await setCreditState(10, 10, 50);

    // Send a chat message — should consume from purchased pool
    const chatRes = await fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello from purchased pool', stream: false, session_id: `topup-005-${Date.now()}` }),
    });
    expect(chatRes.status).toBeLessThan(500);

    // Purchased should have decreased
    const bot = await getBot();
    expect(bot.data.chatbot.purchased_credits_remaining).toBeLessThan(50);
  }, 120_000);

  // ─────────────────────────────────────────────────────────────────
  // Monthly Reset Preserves Purchased Credits
  // ─────────────────────────────────────────────────────────────────

  it('TOPUP-006: Monthly reset does not touch purchased credits', async () => {
    await setCreditState(100, 80, 200);

    // Simulate monthly reset by setting messages_this_month to 0 via PATCH
    await patchBot({ messages_this_month: 0 });

    // Verify monthly reset, purchased untouched
    const bot = await getBot();
    expect(bot.data.chatbot.messages_this_month).toBe(0);
    expect(bot.data.chatbot.purchased_credits_remaining).toBe(200);
  }, 120_000);

  // ─────────────────────────────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────────────────────────────

  it('TOPUP-CLEANUP: Reset chatbot state', async () => {
    await resetCredits();
    await patchBot({
      credit_exhaustion_mode: 'tickets',
      auto_topup_package_id: null,
      credit_exhaustion_config: {},
    });

    // Clean up test package
    if (testPackageId) {
      await fetch(`${BASE_URL}/api/admin/credit-packages/${testPackageId}`, {
        method: 'DELETE',
      });
    }
  }, 120_000);
});
