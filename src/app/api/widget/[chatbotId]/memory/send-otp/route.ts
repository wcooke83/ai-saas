/**
 * Memory OTP Send API
 * POST /api/widget/:chatbotId/memory/send-otp - Send a 6-digit OTP to verify email ownership
 */

import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendMemoryVerificationEmail } from '@/lib/email/resend';

interface RouteParams {
  params: Promise<{ chatbotId: string }>;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { chatbotId } = await params;
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'email is required' } }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = createAdminClient();

    // Rate limit: max 3 OTPs per email per 15 minutes
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: recentCodes } = await (supabase as ReturnType<typeof createAdminClient>)
      .from('memory_verification_codes')
      .select('id')
      .eq('chatbot_id', chatbotId)
      .eq('email', normalizedEmail)
      .gte('created_at', fifteenMinAgo);

    if (recentCodes && recentCodes.length >= 3) {
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Too many verification attempts. Please try again in a few minutes.' } }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Generate OTP and store it (expires in 10 minutes)
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await (supabase as ReturnType<typeof createAdminClient>)
      .from('memory_verification_codes')
      .insert({
        chatbot_id: chatbotId,
        email: normalizedEmail,
        code,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error('Failed to store OTP:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: { message: 'Failed to generate verification code' } }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Get chatbot name for the email
    const { data: chatbot } = await (supabase as ReturnType<typeof createAdminClient>)
      .from('chatbots')
      .select('name')
      .eq('id', chatbotId)
      .single();

    // Send email via Resend
    await sendMemoryVerificationEmail(normalizedEmail, code, chatbot?.name || 'Chatbot');

    return new Response(
      JSON.stringify({ success: true, data: { sent: true } }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    console.error('Send OTP error:', error);
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
