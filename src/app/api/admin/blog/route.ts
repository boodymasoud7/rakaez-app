import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson } from '@/lib/content/writer';
import { generateId, slugify } from '@/lib/content/id';
import type { BlogPost } from '@/lib/content/types';

function normalizePost(input: Record<string, unknown>, base?: BlogPost): BlogPost {
  const now = new Date().toISOString();
  const title_en = typeof input.title_en === 'string' ? input.title_en : base?.title_en || '';
  const slug =
    typeof input.slug === 'string' && input.slug
      ? slugify(input.slug)
      : base?.slug || slugify(title_en);

  return {
    id: base?.id || (typeof input.id === 'string' ? input.id : generateId()),
    title_en,
    title_ar:
      typeof input.title_ar === 'string' ? input.title_ar : base?.title_ar || '',
    slug,
    content_en:
      typeof input.content_en === 'string' ? input.content_en : base?.content_en || '',
    content_ar:
      typeof input.content_ar === 'string' ? input.content_ar : base?.content_ar || '',
    excerpt_en:
      typeof input.excerpt_en === 'string' ? input.excerpt_en : base?.excerpt_en || '',
    excerpt_ar:
      typeof input.excerpt_ar === 'string' ? input.excerpt_ar : base?.excerpt_ar || '',
    image_url:
      typeof input.image_url === 'string' ? input.image_url : base?.image_url ?? null,
    seo_title:
      typeof input.seo_title === 'string' ? input.seo_title : base?.seo_title ?? null,
    seo_description:
      typeof input.seo_description === 'string'
        ? input.seo_description
        : base?.seo_description ?? null,
    category:
      typeof input.category === 'string' ? input.category : base?.category ?? null,
    published:
      typeof input.published === 'boolean' ? input.published : base?.published ?? false,
    created_at: base?.created_at || now,
    updated_at: now,
  };
}

/**
 * POST /api/admin/blog
 * Body: blog post fields. Creates a new post.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Body must be an object' }, { status: 400 });
  }

  const post = normalizePost(body as Record<string, unknown>);
  if (!post.title_en) {
    return NextResponse.json({ error: 'title_en is required' }, { status: 400 });
  }

  let created = post;
  await updateJson<BlogPost[]>(
    'blog.json',
    (current) => {
      if (current.some((p) => p.slug === created.slug)) {
        const stamp = Date.now().toString(36).slice(-4);
        created = { ...created, slug: `${created.slug}-${stamp}` };
      }
      return [created, ...current];
    },
    [],
    `feat(content): add blog post ${post.slug}`
  );

  return NextResponse.json({ post: created });
}
