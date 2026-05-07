import 'server-only';
import { NextResponse } from 'next/server';
import { getSession, isAuthenticated, type Session } from './session';

/**
 * Verify the request comes from an authenticated admin. Returns the session
 * on success or a NextResponse with 401 on failure. Use it like:
 *
 *   const auth = await requireAdmin();
 *   if (auth instanceof NextResponse) return auth;
 *   // ...auth.email is now available
 */
export async function requireAdmin(): Promise<Session | NextResponse> {
  const session = await getSession();
  if (!isAuthenticated(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}
