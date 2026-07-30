'use client';

/**
 * Thin wrappers around the admin REST API. All calls assume a logged-in
 * session (the cookie is sent automatically). Errors throw with a friendly
 * message so callers can surface them in the UI.
 */

async function jsonFetch<T>(
  url: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    const message = (body && (body as { error?: string }).error) || res.statusText;
    throw new Error(message || 'Request failed');
  }
  return body as T;
}

// ============ Upload ============

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

export async function uploadFile(file: File | Blob, options?: {
  folder?: string;
  fileName?: string;
}): Promise<UploadResult> {
  const form = new FormData();
  const blob = file as File;
  const name = options?.fileName || (blob instanceof File ? blob.name : 'upload.bin');
  form.append('file', blob, name);
  if (options?.folder) form.append('folder', options.folder);
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    body: form,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    const message = (body as { error?: string }).error || res.statusText;
    throw new Error(message || 'Upload failed');
  }
  return body as UploadResult;
}

// ============ Projects ============

export interface ProjectPayload {
  name_en?: string;
  name_ar?: string;
  slug?: string;
  location_en?: string;
  location_ar?: string;
  description_en?: string;
  description_ar?: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  featured?: boolean;
  published?: boolean;
  cover_image?: string | null;
  brochure_url?: string | null;
  lat?: number | null;
  lng?: number | null;
  gallery?: { url: string; sort_order?: number }[];
  videos?: { url: string; title_en?: string; title_ar?: string }[];
  unit_types?: { category: 'residential' | 'commercial' | 'administrative'; area_from: number; area_to: number }[];
  payment_plans?: { name_en: string; name_ar: string; details_en: string; details_ar: string }[];
  amenities?: { name_en: string; name_ar: string; icon: string }[];
}

export const adminApi = {
  createProject: (payload: ProjectPayload) =>
    jsonFetch<{ project: import('@/lib/content/types').Project }>(
      '/api/admin/projects',
      { method: 'POST', body: JSON.stringify(payload) }
    ),
  updateProject: (id: string, payload: ProjectPayload) =>
    jsonFetch<{ project: import('@/lib/content/types').Project }>(
      `/api/admin/projects/${id}`,
      { method: 'PUT', body: JSON.stringify(payload) }
    ),
  deleteProject: (id: string) =>
    jsonFetch<{ success: boolean }>(
      `/api/admin/projects/${id}`,
      { method: 'DELETE' }
    ),

  // ============ Blog ============
  createBlog: (payload: Record<string, unknown>) =>
    jsonFetch<{ post: import('@/lib/content/types').BlogPost }>(
      '/api/admin/blog',
      { method: 'POST', body: JSON.stringify(payload) }
    ),
  updateBlog: (id: string, payload: Record<string, unknown>) =>
    jsonFetch<{ post: import('@/lib/content/types').BlogPost }>(
      `/api/admin/blog/${id}`,
      { method: 'PUT', body: JSON.stringify(payload) }
    ),
  deleteBlog: (id: string) =>
    jsonFetch<{ success: boolean }>(
      `/api/admin/blog/${id}`,
      { method: 'DELETE' }
    ),

  // ============ FAQ ============
  createFaq: (payload: Record<string, unknown>) =>
    jsonFetch<{ item: import('@/lib/content/types').FaqItem }>(
      '/api/admin/faq',
      { method: 'POST', body: JSON.stringify(payload) }
    ),
  updateFaq: (id: string, payload: Record<string, unknown>) =>
    jsonFetch<{ item: import('@/lib/content/types').FaqItem }>(
      `/api/admin/faq/${id}`,
      { method: 'PUT', body: JSON.stringify(payload) }
    ),
  deleteFaq: (id: string) =>
    jsonFetch<{ success: boolean }>(
      `/api/admin/faq/${id}`,
      { method: 'DELETE' }
    ),

  // ============ Settings ============
  saveSettings: (settings: Record<string, { en: string; ar: string }>) =>
    jsonFetch<{ success: boolean }>(
      '/api/admin/settings',
      { method: 'PUT', body: JSON.stringify(settings) }
    ),

  // ============ SEO ============
  saveSeo: (seo: Record<string, unknown>) =>
    jsonFetch<{ success: boolean }>(
      '/api/admin/seo',
      { method: 'PUT', body: JSON.stringify(seo) }
    ),

  // ============ Services ============
  saveServices: (services: import('@/lib/content/types').Service[]) =>
    jsonFetch<{ services: import('@/lib/content/types').Service[] }>(
      '/api/admin/services',
      { method: 'PUT', body: JSON.stringify(services) }
    ),
};
