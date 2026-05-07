import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson } from '@/lib/content/writer';
import type { FaqItem } from '@/lib/content/types';

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

  let updated: FaqItem | null = null;
  await updateJson<FaqItem[]>(
    'faq.json',
    (current) => {
      return current.map((item) => {
        if (item.id !== id) return item;
        const merged: FaqItem = { ...item, ...patch, id: item.id };
        updated = merged;
        return merged;
      });
    },
    [],
    `chore(content): update FAQ ${id}`
  );

  if (!updated) {
    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
  }
  return NextResponse.json({ item: updated });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  let deleted = false;
  await updateJson<FaqItem[]>(
    'faq.json',
    (current) => {
      const next = current.filter((item) => item.id !== id);
      deleted = next.length !== current.length;
      return next;
    },
    [],
    `chore(content): delete FAQ ${id}`
  );

  if (!deleted) {
    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
