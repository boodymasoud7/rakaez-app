import { NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/content/reader';

export async function GET() {
  try {
    const analytics = await getAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Failed to get analytics:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}
