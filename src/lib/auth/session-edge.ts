import { getIronSession, type IronSession } from 'iron-session';
import type { NextRequest, NextResponse } from 'next/server';
import {
  type SessionData,
  getSessionOptions,
} from './session-options';

/**
 * Edge-runtime compatible session helper. Use this from `middleware.ts` so
 * we never pull in `next/headers` or `server-only` (which break the Edge
 * bundle).
 */
export async function getRequestSession(
  req: NextRequest,
  res: NextResponse
): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(req, res, getSessionOptions());
}
