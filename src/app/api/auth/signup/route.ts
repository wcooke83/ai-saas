import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/resend';
import { rateLimit } from '@/lib/api/rate-limit';
import { getClientIP } from '@/lib/api/utils';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 signups per IP per 15 minutes
    const ip = getClientIP(request);
    const rateLimitResult = await rateLimit(`signup:${ip}`, 5, 900);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign up with auto-confirm (configure in Supabase dashboard)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send welcome email via Resend
    if (data.user) {
      try {
        await sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.error('Welcome email failed:', emailError);
        // Don't fail signup if email fails
      }
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
