import { NextResponse } from 'next/server';
import { getSession, isAuthenticated } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();
  if (!isAuthenticated(session)) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
