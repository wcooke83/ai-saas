/**
 * Memory OTP Verify API
 * POST /api/widget/:chatbotId/memory/verify-otp - Verify OTP and return the existing visitor_id
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const body = await req.json();
    const { email, code } = body;

    if (!email || typeof email !== 'string' || !code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'email and code are required' } }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[Memory OTP Verify] Verifying code for email "${normalizedEmail}", chatbot ${chatbotId}`);
    const supabase = createAdminClient();

    // Find valid, unused code
    const { data: verification } = await (supabase as ReturnType<typeof createAdminClient>)
      .from('memory_verification_codes')
      .select('id, expires_at')
      .eq('chatbot_id', chatbotId)
      .eq('email', normalizedEmail)
      .eq('code', code.trim())
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!verification) {
      console.log(`[Memory OTP Verify] No matching unused code found for "${normalizedEmail}"`);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Invalid verification code' } }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Check expiry
    if (new Date(verification.expires_at) < new Date()) {
      console.log(`[Memory OTP Verify] Code expired at ${verification.expires_at} for "${normalizedEmail}"`);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Verification code has expired. Please request a new one.' } }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    console.log(`[Memory OTP Verify] Code valid — marking as used`);
    // Mark code as used
    await (supabase as ReturnType<typeof createAdminClient>)
      .from('memory_verification_codes')
      .update({ used: true })
      .eq('id', verification.id);

    // Get the visitor_id linked to this email
    const { data: mapping } = await (supabase as ReturnType<typeof createAdminClient>)
      .from('conversation_memory_emails')
      .select('visitor_id')
      .eq('chatbot_id', chatbotId)
      .eq('email', normalizedEmail)
      .single();

    if (!mapping) {
      console.warn(`[Memory OTP Verify] No visitor mapping found for verified email "${normalizedEmail}"`);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'No previous conversation data found for this email' } }),
        { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    console.log(`[Memory OTP Verify] Verified! email "${normalizedEmail}" → visitorId "${mapping.visitor_id}"`);
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          verified: true,
          visitor_id: mapping.visitor_id,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Internal server error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
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
