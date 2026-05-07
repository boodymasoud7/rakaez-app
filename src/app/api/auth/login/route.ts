import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyCredentials } from '@/lib/auth/users';
import { getSession } from '@/lib/auth/session';

export async function POST(request: Request) {
  // Brute-force protection: 5 attempts / minute / IP
  const ip = getClientIp(request);
  const { allowed, resetIn } = rateLimit(`login:${ip}`, 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(resetIn) } }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = (body.email || '').trim();
  const password = body.password || '';

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }

  const session = await getSession();
  session.email = user.email;
  session.name = user.name;
  session.role = user.role || 'editor';
  session.loggedInAt = Date.now();
  await session.save();

  return NextResponse.json({
    user: { email: user.email, name: user.name, role: session.role },
  });
}
