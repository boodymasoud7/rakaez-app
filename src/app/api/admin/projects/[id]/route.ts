import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson } from '@/lib/content/writer';
import { slugify } from '@/lib/content/id';
import type { Project } from '@/lib/content/types';

interface Ctx {
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/admin/projects/[id]
 * Body: partial project fields. Merges into the existing project.
 */
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

  let updated: Project | null = null;
  try {
    await updateJson<Project[]>(
      'projects.json',
      (current) => {
        return current.map((p) => {
          if (p.id !== id) return p;
          const merged: Project = {
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
      `chore(content): update project ${id}`
    );
  } catch (err) {
    console.error('Failed to update project:', err);
    return NextResponse.json(
      { error: (err as Error)?.message || 'Failed to update project' },
      { status: 500 }
    );
  }

  if (!updated) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json({ project: updated });
}

/**
 * DELETE /api/admin/projects/[id]
 */
export async function DELETE(_request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  let deleted = false;
  try {
    await updateJson<Project[]>(
      'projects.json',
      (current) => {
        const next = current.filter((p) => p.id !== id);
        deleted = next.length !== current.length;
        return next;
      },
      [],
      `chore(content): delete project ${id}`
    );
  } catch (err) {
    console.error('Failed to delete project:', err);
    return NextResponse.json(
      { error: (err as Error)?.message || 'Failed to delete project' },
      { status: 500 }
    );
  }

  if (!deleted) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
