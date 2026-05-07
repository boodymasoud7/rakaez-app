import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { listMedia } from '@/lib/content/media';

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const files = await listMedia();
  return NextResponse.json({ files });
}
