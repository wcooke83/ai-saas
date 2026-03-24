/**
 * Widget Credit Purchase API
 * POST /api/widget/:chatbotId/purchase - Create Stripe checkout session (public)
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { getClientIP } from '@/lib/api/utils';
import { getChatbotCorsOrigin } from '@/lib/api/cors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-12-18.acacia' as any });

const purchaseSchema = z.object({
  packageId: z.string().uuid(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const supabase = createAdminClient();

    // Rate limit: 10 per IP per 5 min
    const ip = getClientIP(req);
    const { data: allowed } = await supabase.rpc('check_rate_limit', {
      p_key: `purchase:${ip}:${chatbotId}`,
      p_max_requests: 10,
      p_window_seconds: 300,
    });
    if (allowed === false) {
      return corsJson({ success: false, error: { message: 'Rate limit exceeded' } }, 429);
    }

    // Get chatbot
    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, name, allowed_origins')
      .eq('id', chatbotId)
      .single();

    if (!chatbot) {
      return corsJson({ success: false, error: { message: 'Chatbot not found' } }, 404);
    }

    const body = await req.json();
    const input = purchaseSchema.parse(body);

    // Get the credit package
    const { data: pkg } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('id', input.packageId)
      .eq('chatbot_id', chatbotId)
      .eq('active', true)
      .single();

    if (!pkg) {
      return corsJson({ success: false, error: { message: 'Package not found' } }, 404);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3030';
    const successUrl = input.successUrl || `${appUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = input.cancelUrl || appUrl;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: (pkg as any).stripe_price_id,
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        type: 'credit_purchase',
        chatbot_id: chatbotId,
        package_id: (pkg as any).id,
        credit_amount: String((pkg as any).credit_amount),
      },
    });

    // Record pending purchase
    await supabase.from('credit_purchases').insert({
      chatbot_id: chatbotId,
      package_id: (pkg as any).id,
      stripe_session_id: session.id,
      credit_amount: (pkg as any).credit_amount,
      amount_paid_cents: (pkg as any).price_cents,
      status: 'pending',
    });

    const origin = getChatbotCorsOrigin((chatbot as any).allowed_origins, req.headers.get('origin'));
    return new Response(JSON.stringify({
      success: true,
      data: { checkoutUrl: session.url },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  } catch (error) {
    console.error('[Widget:Purchase] Error:', error);
    const message = error instanceof z.ZodError
      ? `Validation error: ${error.errors.map(e => e.message).join(', ')}`
      : 'Internal server error';
    return corsJson({ success: false, error: { message } }, error instanceof z.ZodError ? 400 : 500);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function corsJson(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
