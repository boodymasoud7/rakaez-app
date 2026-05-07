import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson } from '@/lib/content/writer';
import { generateId } from '@/lib/content/id';
import type { Service } from '@/lib/content/types';

/**
 * PUT /api/admin/services
 * Body: full array of services. Replaces services.json.
 */
export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!Array.isArray(body)) {
    return NextResponse.json(
      { error: 'Body must be an array of services' },
      { status: 400 }
    );
  }

  const next: Service[] = (body as Record<string, unknown>[]).map((raw, i) => ({
    id: typeof raw.id === 'string' ? raw.id : generateId(),
    title_en: typeof raw.title_en === 'string' ? raw.title_en : '',
    title_ar: typeof raw.title_ar === 'string' ? raw.title_ar : '',
    description_en:
      typeof raw.description_en === 'string' ? raw.description_en : '',
    description_ar:
      typeof raw.description_ar === 'string' ? raw.description_ar : '',
    icon: typeof raw.icon === 'string' ? raw.icon : 'HiOfficeBuilding',
    sort_order: typeof raw.sort_order === 'number' ? raw.sort_order : i + 1,
  }));

  await updateJson<Service[]>(
    'services.json',
    () => next,
    [],
    `chore(content): update services`
  );

  return NextResponse.json({ services: next });
}
