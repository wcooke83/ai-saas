/**
 * Slack OAuth Callback
 * Handles the OAuth redirect from Slack
 */

import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { authenticate } from '@/lib/auth/session';
import { getChatbot } from '@/lib/chatbots/api';
import { createAdminClient } from '@/lib/supabase/admin';
import { CHATBOT_PLAN_LIMITS } from '@/lib/chatbots/types';
import { exchangeSlackCode, saveSlackIntegration, verifyOAuthState } from '@/lib/chatbots/integrations/slack';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // Handle errors
  if (error) {
    return redirect(`/dashboard/chatbots/${id}?slack_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return redirect(`/dashboard/chatbots/${id}?slack_error=no_code`);
  }

  // Verify signed OAuth state (CSRF protection)
  if (!state) {
    return redirect(`/dashboard/chatbots/${id}?slack_error=missing_state`);
  }
  const stateChatbotId = verifyOAuthState(state);
  if (!stateChatbotId || stateChatbotId !== id) {
    return redirect(`/dashboard/chatbots/${id}?slack_error=invalid_state`);
  }

  try {
    // Authenticate user
    const user = await authenticate(req);
    if (!user) {
      return redirect(`/login?redirect=/dashboard/chatbots/${id}`);
    }

    // Verify chatbot ownership
    const chatbot = await getChatbot(id);
    if (!chatbot || chatbot.user_id !== user.id) {
      return redirect(`/dashboard/chatbots?error=not_found`);
    }

    // Enforce plan — Pro+ required
    const supabase = createAdminClient();
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .single();
    const planSlug = sub?.plan || 'free';
    if (!(CHATBOT_PLAN_LIMITS[planSlug]?.slackIntegration ?? false)) {
      return redirect(`/dashboard/chatbots/${id}?slack_error=plan_required`);
    }

    // Exchange code for token
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || '';
    const redirectUri = `${baseUrl}/api/chatbots/${id}/integrations/slack/callback`;
    const result = await exchangeSlackCode(code, redirectUri);

    if (!result.ok || !result.access_token) {
      return redirect(`/dashboard/chatbots/${id}?slack_error=${encodeURIComponent(result.error || 'unknown')}`);
    }

    // Save integration (including bot_user_id for self-message filtering)
    await saveSlackIntegration(
      id,
      result.team_id!,
      result.team_name!,
      result.access_token,
      user.id,
      result.bot_user_id ?? null
    );

    // Redirect back to chatbot with success
    return redirect(`/dashboard/chatbots/${id}?slack_connected=true`);
  } catch (err) {
    console.error('Slack OAuth error:', err);
    return redirect(`/dashboard/chatbots/${id}?slack_error=internal`);
  }
}
