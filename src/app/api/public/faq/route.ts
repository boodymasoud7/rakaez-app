import { NextResponse } from 'next/server';
import { getFaqItems } from '@/lib/content/reader';

export async function GET() {
  const items = await getFaqItems();
  return NextResponse.json(items);
}
