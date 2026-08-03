import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson } from '@/lib/content/writer';
import { generateId, slugify } from '@/lib/content/id';
import type { Project } from '@/lib/content/types';

function normalizeProject(input: Record<string, unknown>, base?: Project): Project {
  const now = new Date().toISOString();
  const name_en = typeof input.name_en === 'string' ? input.name_en : base?.name_en || '';
  const slug =
    typeof input.slug === 'string' && input.slug
      ? slugify(input.slug)
      : base?.slug || slugify(name_en);

  return {
    id: base?.id || (typeof input.id === 'string' ? input.id : generateId()),
    name_en,
    name_ar: typeof input.name_ar === 'string' ? input.name_ar : base?.name_ar || '',
    slug,
    location_en:
      typeof input.location_en === 'string' ? input.location_en : base?.location_en || '',
    location_ar:
      typeof input.location_ar === 'string' ? input.location_ar : base?.location_ar || '',
    description_en:
      typeof input.description_en === 'string'
        ? input.description_en
        : base?.description_en || '',
    description_ar:
      typeof input.description_ar === 'string'
        ? input.description_ar
        : base?.description_ar || '',
    status:
      input.status === 'upcoming' || input.status === 'ongoing' || input.status === 'completed'
        ? input.status
        : base?.status || 'upcoming',
    lat:
      typeof input.lat === 'number'
        ? input.lat
        : base?.lat ?? null,
    lng:
      typeof input.lng === 'number'
        ? input.lng
        : base?.lng ?? null,
    map_link:
      typeof input.map_link === 'string'
        ? input.map_link
        : base?.map_link ?? null,
    brochure_url:
      typeof input.brochure_url === 'string'
        ? input.brochure_url
        : base?.brochure_url ?? null,
    cover_image:
      typeof input.cover_image === 'string'
        ? input.cover_image
        : base?.cover_image ?? null,
    featured: typeof input.featured === 'boolean' ? input.featured : base?.featured ?? false,
    published: typeof input.published === 'boolean' ? input.published : base?.published ?? true,
    gallery: Array.isArray(input.gallery)
      ? (input.gallery as Project['gallery'])
      : base?.gallery || [],
    videos: Array.isArray(input.videos)
      ? (input.videos as Project['videos'])
      : base?.videos || [],
    unit_types: Array.isArray(input.unit_types)
      ? (input.unit_types as Project['unit_types'])
      : base?.unit_types || [],
    payment_plans: Array.isArray(input.payment_plans)
      ? (input.payment_plans as Project['payment_plans'])
      : base?.payment_plans || [],
    amenities: Array.isArray(input.amenities)
      ? (input.amenities as Project['amenities'])
      : base?.amenities || [],
    created_at: base?.created_at || now,
    updated_at: now,
  };
}

/**
 * POST /api/admin/projects
 * Body: project fields (name_en, name_ar, slug, ...)
 * Creates a new project, appending it to projects.json.
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

  const project = normalizeProject(body as Record<string, unknown>);
  if (!project.name_en) {
    return NextResponse.json({ error: 'name_en is required' }, { status: 400 });
  }

  let created = project;
  try {
    await updateJson<Project[]>(
      'projects.json',
      (current) => {
        if (current.some((p) => p.slug === created.slug)) {
          const stamp = Date.now().toString(36).slice(-4);
          created = { ...created, slug: `${created.slug}-${stamp}` };
        }
        return [created, ...current];
      },
      [],
      `feat(content): add project ${project.slug}`
    );
  } catch (err) {
    console.error('Failed to create project:', err);
    return NextResponse.json(
      { error: (err as Error)?.message || 'Failed to create project' },
      { status: 500 }
    );
  }

  return NextResponse.json({ project: created });
}
