import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson } from '@/lib/content/writer';
import type { SiteSettings } from '@/lib/content/types';

/**
 * PUT /api/admin/settings
 * Body: full settings object { [key]: { en, ar } }
 * Replaces the entire settings.json file.
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
      { error: 'Body must be a settings object' },
      { status: 400 }
    );
  }

  // Normalize: ensure each value is { en, ar } strings
  const incoming = body as Record<string, unknown>;
  const next: SiteSettings = {};
  for (const [key, raw] of Object.entries(incoming)) {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const v = raw as Record<string, unknown>;
      next[key] = {
        en: typeof v.en === 'string' ? v.en : '',
        ar: typeof v.ar === 'string' ? v.ar : '',
      };
    }
  }

  await updateJson<SiteSettings>(
    'settings.json',
    () => next,
    {},
    `chore(content): update site settings`
  );

  return NextResponse.json({ success: true, settings: next });
}
