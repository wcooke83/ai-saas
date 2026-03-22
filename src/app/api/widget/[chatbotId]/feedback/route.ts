import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  try {
    const { chatbotId } = await params;
    const { message_id, thumbs_up, feedback_reason } = await req.json();

    if (!message_id || typeof thumbs_up !== 'boolean') {
      return NextResponse.json(
        { error: 'message_id and thumbs_up (boolean) required' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const validReasons = ['incorrect', 'not_relevant', 'too_vague', 'other'];
    const reason = feedback_reason && validReasons.includes(feedback_reason) ? feedback_reason : null;

    const supabase = createAdminClient();

    // Verify message belongs to this chatbot
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .select('id, chatbot_id')
      .eq('id', message_id)
      .eq('chatbot_id', chatbotId)
      .single();

    if (msgError || !message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Update feedback
    const updateData: Record<string, unknown> = { thumbs_up };
    if (reason) updateData.feedback_reason = reason;
    else if (thumbs_up) updateData.feedback_reason = null; // Clear reason on thumbs-up

    const { error } = await supabase
      .from('messages')
      .update(updateData)
      .eq('id', message_id);

    if (error) throw error;

    return NextResponse.json(
      { success: true },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
