import { NextResponse } from 'next/server';
import { getInquiries } from '@/lib/content/reader';

export async function GET() {
  try {
    const inquiries = await getInquiries();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Failed to retrieve inquiries:', error);
    return NextResponse.json({ error: 'Failed to retrieve inquiries' }, { status: 500 });
  }
}
