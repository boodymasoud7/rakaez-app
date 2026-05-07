import { NextResponse } from 'next/server';
import { getBlogPosts, getAllBlogPosts } from '@/lib/content/reader';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeDrafts = url.searchParams.get('all') === 'true';
  const posts = includeDrafts ? await getAllBlogPosts() : await getBlogPosts();
  return NextResponse.json(posts, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
