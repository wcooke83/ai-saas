/**
 * POST /api/credit-alerts/dismiss
 * Acknowledges a credit alert dismissal. Dismissal is client-side session state only.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ dismissed: true });
}
