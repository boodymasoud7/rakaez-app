import { NextResponse } from 'next/server';
import { getSeoPages } from '@/lib/content/reader';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const seo = await getSeoPages();
  return NextResponse.json(seo, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
