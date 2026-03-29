import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/auth/session';
import { successResponse, errorResponse, APIError } from '@/lib/api/utils';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await authenticate(req);
    if (!user) throw APIError.unauthorized('Authentication required');

    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('chatbots')
      .update({ widget_reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new APIError(error.message, 500);

    return successResponse({ success: true });
  } catch (err) {
    return errorResponse(err);
  }
}
