import { NextResponse } from 'next/server';
import { getFaqItems } from '@/lib/content/reader';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const items = await getFaqItems();
  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
