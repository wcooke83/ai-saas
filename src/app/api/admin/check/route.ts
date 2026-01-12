/**
 * Admin Check API
 * GET /api/admin/check - Check if current user is an admin
 */

import { NextRequest } from 'next/server';
import { authenticate, isAdmin } from '@/lib/auth/session';
import { successResponse, errorResponse } from '@/lib/api/utils';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);

    if (!user) {
      return successResponse({ isAdmin: false, authenticated: false });
    }

    const adminStatus = await isAdmin(user.id);

    return successResponse({
      isAdmin: adminStatus,
      authenticated: true,
      userId: user.id,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
