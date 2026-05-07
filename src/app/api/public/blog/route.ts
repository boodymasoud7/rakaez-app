import { NextResponse } from 'next/server';
import { getBlogPosts, getAllBlogPosts } from '@/lib/content/reader';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeDrafts = url.searchParams.get('all') === 'true';
  const posts = includeDrafts ? await getAllBlogPosts() : await getBlogPosts();
  return NextResponse.json(posts);
}
