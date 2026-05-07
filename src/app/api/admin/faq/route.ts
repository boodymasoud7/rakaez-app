import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson } from '@/lib/content/writer';
import { generateId } from '@/lib/content/id';
import type { FaqItem } from '@/lib/content/types';

function normalizeItem(input: Record<string, unknown>, base?: FaqItem): FaqItem {
  return {
    id: base?.id || (typeof input.id === 'string' ? input.id : generateId()),
    question_en:
      typeof input.question_en === 'string' ? input.question_en : base?.question_en || '',
    question_ar:
      typeof input.question_ar === 'string' ? input.question_ar : base?.question_ar || '',
    answer_en:
      typeof input.answer_en === 'string' ? input.answer_en : base?.answer_en || '',
    answer_ar:
      typeof input.answer_ar === 'string' ? input.answer_ar : base?.answer_ar || '',
    sort_order:
      typeof input.sort_order === 'number' ? input.sort_order : base?.sort_order || 0,
  };
}

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

  const item = normalizeItem(body as Record<string, unknown>);
  if (!item.question_en || !item.answer_en) {
    return NextResponse.json(
      { error: 'question_en and answer_en are required' },
      { status: 400 }
    );
  }

  await updateJson<FaqItem[]>(
    'faq.json',
    (current) => [...current, item],
    [],
    `feat(content): add FAQ item`
  );

  return NextResponse.json({ item });
}
