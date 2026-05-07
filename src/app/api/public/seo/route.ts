import { NextResponse } from 'next/server';
import { getSeoPages } from '@/lib/content/reader';

export async function GET() {
  const seo = await getSeoPages();
  return NextResponse.json(seo);
}
