import 'server-only';
import { getIronSession, type IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import {
  type SessionData,
  getSessionOptions,
} from './session-options';

export type Session = IronSession<SessionData>;
export type { SessionData } from './session-options';

/**
 * Get the session inside a Server Component / Route Handler that uses the
 * Next.js `cookies()` API. The returned object has `.save()` / `.destroy()`
 * methods provided by iron-session.
 *
 * Do NOT import this file from `middleware.ts` — use `session-edge.ts`
 * instead, since `next/headers` is not available in the Edge runtime.
 */
export async function getSession(): Promise<Session> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, getSessionOptions());
}

export function isAuthenticated(session: SessionData): boolean {
  return !!session.email;
}
