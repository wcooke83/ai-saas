import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendFirstConversationEmail } from '@/lib/email/resend';

export async function POST(req: NextRequest) {
  try {
    const { chatbotId, userId } = await req.json();
    if (!chatbotId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing chatbotId or userId' }), { status: 400 });
    }

    const supabase = createAdminClient();

    // Check if already activated (idempotent)
    const { data: chatbotRow } = await (supabase as any)
      .from('chatbots')
      .select('first_conversation_at, name')
      .eq('id', chatbotId)
      .eq('user_id', userId)
      .single() as { data: { first_conversation_at: string | null; name: string } | null };

    if (!chatbotRow || chatbotRow.first_conversation_at) {
      return new Response(JSON.stringify({ activated: false }), { status: 200 });
    }

    // Set first_conversation_at
    await (supabase as any)
      .from('chatbots')
      .update({ first_conversation_at: new Date().toISOString() })
      .eq('id', chatbotId)
      .eq('user_id', userId);

    // Get user email
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    if (user?.email) {
      await sendFirstConversationEmail(user.email, chatbotRow.name);
    }

    return new Response(JSON.stringify({ activated: true }), { status: 200 });
  } catch (err) {
    console.error('[Activation] first-conversation error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
}
