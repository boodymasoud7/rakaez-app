import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson } from '@/lib/content/writer';
import type { SeoPages } from '@/lib/content/types';

/**
 * PUT /api/admin/seo
 * Body: full SEO object { [page]: { title_en, title_ar, description_en, description_ar, og_image } }
 * Replaces the entire seo.json file.
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

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json(
      { error: 'Body must be an SEO pages object' },
      { status: 400 }
    );
  }

  const incoming = body as Record<string, unknown>;
  const next: SeoPages = {};
  for (const [page, raw] of Object.entries(incoming)) {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const v = raw as Record<string, unknown>;
      next[page] = {
        title_en: typeof v.title_en === 'string' ? v.title_en : '',
        title_ar: typeof v.title_ar === 'string' ? v.title_ar : '',
        description_en:
          typeof v.description_en === 'string' ? v.description_en : '',
        description_ar:
          typeof v.description_ar === 'string' ? v.description_ar : '',
        og_image: typeof v.og_image === 'string' ? v.og_image : null,
      };
    }
  }

  await updateJson<SeoPages>(
    'seo.json',
    () => next,
    {},
    `chore(content): update SEO pages`
  );

  return NextResponse.json({ success: true, seo: next });
}
