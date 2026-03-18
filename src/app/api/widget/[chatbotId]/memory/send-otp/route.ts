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
    console.log(`[Memory OTP Send] Requesting OTP for email "${normalizedEmail}", chatbot ${chatbotId}`);
    const supabase = createAdminClient();

    // Rate limit: max 3 OTPs per email per 15 minutes
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: recentCodes } = await (supabase as ReturnType<typeof createAdminClient>)
      .from('memory_verification_codes')
      .select('id')
      .eq('chatbot_id', chatbotId)
      .eq('email', normalizedEmail)
      .gte('created_at', fifteenMinAgo);

    console.log(`[Memory OTP Send] Recent OTP requests in last 15min: ${recentCodes?.length || 0}/3`);
    if (recentCodes && recentCodes.length >= 3) {
      console.warn(`[Memory OTP Send] Rate limited — ${recentCodes.length} codes sent in last 15min for "${normalizedEmail}"`);
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
      console.error('[Memory OTP Send] Failed to store OTP:', insertError);
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
    console.log(`[Memory OTP Send] Sending OTP email to "${normalizedEmail}" (chatbot: ${chatbot?.name || 'Chatbot'})`);
    try {
      await sendMemoryVerificationEmail(normalizedEmail, code, chatbot?.name || 'Chatbot');
      console.log(`[Memory OTP Send] OTP email sent successfully to "${normalizedEmail}"`);
    } catch (emailError: unknown) {
      // Clean up the stored code so it doesn't count toward rate limit
      await (supabase as ReturnType<typeof createAdminClient>)
        .from('memory_verification_codes')
        .delete()
        .eq('chatbot_id', chatbotId)
        .eq('email', normalizedEmail)
        .eq('code', code);

      const isValidationError = emailError && typeof emailError === 'object' && 'name' in emailError && (emailError as { name: string }).name === 'validation_error';
      const userMessage = isValidationError
        ? 'Please enter a valid email address.'
        : 'Failed to send verification email. Please try again.';
      console.error(`[Memory OTP Send] Email delivery failed for "${normalizedEmail}":`, emailError);

      return new Response(
        JSON.stringify({ success: false, error: { message: userMessage } }),
        { status: isValidationError ? 422 : 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

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
