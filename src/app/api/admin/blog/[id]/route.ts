import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson } from '@/lib/content/writer';
import { slugify } from '@/lib/content/id';
import type { BlogPost } from '@/lib/content/types';

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  let patch: Record<string, unknown>;
  try {
    patch = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  let updated: BlogPost | null = null;
  await updateJson<BlogPost[]>(
    'blog.json',
    (current) => {
      return current.map((p) => {
        if (p.id !== id) return p;
        const merged: BlogPost = {
          ...p,
          ...patch,
          id: p.id,
          slug:
            typeof patch.slug === 'string' && patch.slug
              ? slugify(patch.slug)
              : p.slug,
          updated_at: new Date().toISOString(),
        };
        updated = merged;
        return merged;
      });
    },
    [],
    `chore(content): update blog ${id}`
  );

  if (!updated) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json({ post: updated });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  let deleted = false;
  await updateJson<BlogPost[]>(
    'blog.json',
    (current) => {
      const next = current.filter((p) => p.id !== id);
      deleted = next.length !== current.length;
      return next;
    },
    [],
    `chore(content): delete blog ${id}`
  );

  if (!deleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
