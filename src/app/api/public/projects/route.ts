import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/content/reader';

// Always read the latest content from disk; never serve a stale snapshot
// (otherwise edits made in the admin panel wouldn't show up immediately).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
