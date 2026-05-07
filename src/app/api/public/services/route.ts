import { NextResponse } from 'next/server';
import { getServices } from '@/lib/content/reader';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const services = await getServices();
  return NextResponse.json(services, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
