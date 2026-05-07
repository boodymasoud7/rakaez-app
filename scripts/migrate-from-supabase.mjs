#!/usr/bin/env node
/**
 * One-shot migration script: export all Supabase data into the local
 * `content/*.json` files. Run this ONCE before tearing down Supabase.
 *
 *   node scripts/migrate-from-supabase.mjs
 *
 * Reads connection info from `.env.local` (NEXT_PUBLIC_SUPABASE_URL,
 * NEXT_PUBLIC_SUPABASE_ANON_KEY). Optionally pass --download-images to
 * also download images from Supabase Storage into public/uploads/migrated.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

const args = process.argv.slice(2);
const shouldDownloadImages = args.includes('--download-images');

// Load .env.local manually so we don't need extra deps
async function loadEnv() {
  try {
    const raw = await fs.readFile('.env.local', 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

await loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    '❌ NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local'
  );
  process.exit(1);
}

const REST = `${url.replace(/\/$/, '')}/rest/v1`;
const HEADERS = {
  apikey: key,
  Authorization: `Bearer ${key}`,
};

const CONTENT_DIR = path.join(process.cwd(), 'content');
const MIGRATED_DIR = path.join(process.cwd(), 'public', 'uploads', 'migrated');

await fs.mkdir(CONTENT_DIR, { recursive: true });

async function writeJson(name, data) {
  const filePath = path.join(CONTENT_DIR, name);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✓ wrote content/${name}`);
}

async function fetchAll(table, opts = {}) {
  const select = opts.select || '*';
  const params = new URLSearchParams({ select });
  if (opts.order) {
    const dir = opts.order.ascending === false ? 'desc' : 'asc';
    params.set('order', `${opts.order.column}.${dir}`);
  }
  try {
    const res = await fetch(`${REST}/${table}?${params}`, { headers: HEADERS });
    if (!res.ok) {
      console.warn(`⚠ skipped table "${table}": ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`⚠ skipped table "${table}":`, err.message);
    return [];
  }
}

const downloadedUrls = new Map();
async function downloadImageIfRequested(originalUrl) {
  if (!shouldDownloadImages) return originalUrl;
  if (!originalUrl) return originalUrl;
  if (downloadedUrls.has(originalUrl)) return downloadedUrls.get(originalUrl);
  if (!originalUrl.startsWith('http')) return originalUrl;
  try {
    const res = await fetch(originalUrl);
    if (!res.ok) {
      console.warn(`⚠ failed to download ${originalUrl}: ${res.status}`);
      return originalUrl;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') || '';
    const ext = contentType.includes('webp')
      ? 'webp'
      : contentType.includes('png')
      ? 'png'
      : contentType.includes('gif')
      ? 'gif'
      : contentType.includes('jpeg') || contentType.includes('jpg')
      ? 'jpg'
      : 'bin';
    const hash = randomBytes(6).toString('hex');
    const fileName = `${hash}.${ext}`;
    await fs.mkdir(MIGRATED_DIR, { recursive: true });
    await fs.writeFile(path.join(MIGRATED_DIR, fileName), buf);
    const newUrl = `/uploads/migrated/${fileName}`;
    downloadedUrls.set(originalUrl, newUrl);
    console.log(`  ↳ downloaded ${fileName}`);
    return newUrl;
  } catch (err) {
    console.warn(`⚠ failed to download ${originalUrl}:`, err.message);
    return originalUrl;
  }
}

console.log('\n=== Migrating Supabase → content/*.json ===\n');

// ============ PROJECTS (with embedded relations) ============
const rawProjects = await fetchAll('projects', { order: { column: 'created_at', ascending: false } });
const projectImages = await fetchAll('project_images');
const projectVideos = await fetchAll('project_videos');
const unitTypes = await fetchAll('unit_types');
const paymentPlans = await fetchAll('payment_plans');
const amenities = await fetchAll('amenities');

const projects = [];
for (const p of rawProjects) {
  const cover = await downloadImageIfRequested(p.cover_image);
  const brochure = await downloadImageIfRequested(p.brochure_url);
  const gallery = [];
  for (const img of projectImages.filter((i) => i.project_id === p.id)) {
    gallery.push({
      url: await downloadImageIfRequested(img.url),
      sort_order: img.sort_order || 0,
    });
  }
  projects.push({
    id: p.id,
    name_en: p.name_en || '',
    name_ar: p.name_ar || '',
    slug: p.slug,
    location_en: p.location_en || '',
    location_ar: p.location_ar || '',
    description_en: p.description_en || '',
    description_ar: p.description_ar || '',
    status: p.status || 'upcoming',
    lat: p.lat ?? null,
    lng: p.lng ?? null,
    brochure_url: brochure ?? null,
    cover_image: cover ?? null,
    featured: !!p.featured,
    gallery: gallery.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    videos: projectVideos
      .filter((v) => v.project_id === p.id)
      .map((v) => ({ url: v.url, title_en: v.title_en || '', title_ar: v.title_ar || '' })),
    unit_types: unitTypes
      .filter((u) => u.project_id === p.id)
      .map((u) => ({
        name_en: u.name_en || '',
        name_ar: u.name_ar || '',
        bedrooms: u.bedrooms || 0,
        area: u.area || '',
        price: u.price || '',
      })),
    payment_plans: paymentPlans
      .filter((pp) => pp.project_id === p.id)
      .map((pp) => ({
        name_en: pp.name_en || '',
        name_ar: pp.name_ar || '',
        details_en: pp.details_en || '',
        details_ar: pp.details_ar || '',
      })),
    amenities: amenities
      .filter((a) => a.project_id === p.id)
      .map((a) => ({
        name_en: a.name_en || '',
        name_ar: a.name_ar || '',
        icon: a.icon || 'HiCheckCircle',
      })),
    created_at: p.created_at || new Date().toISOString(),
    updated_at: p.updated_at || new Date().toISOString(),
  });
}
await writeJson('projects.json', projects);

// ============ BLOG ============
const rawBlog = await fetchAll('blog_posts', { order: { column: 'created_at', ascending: false } });
const blog = [];
for (const b of rawBlog) {
  blog.push({
    id: b.id,
    title_en: b.title_en || '',
    title_ar: b.title_ar || '',
    slug: b.slug,
    content_en: b.content_en || '',
    content_ar: b.content_ar || '',
    excerpt_en: b.excerpt_en || '',
    excerpt_ar: b.excerpt_ar || '',
    image_url: await downloadImageIfRequested(b.image_url),
    seo_title: b.seo_title ?? null,
    seo_description: b.seo_description ?? null,
    category: b.category ?? null,
    published: !!b.published,
    created_at: b.created_at || new Date().toISOString(),
    updated_at: b.updated_at || new Date().toISOString(),
  });
}
await writeJson('blog.json', blog);

// ============ SERVICES ============
const services = (await fetchAll('services', { order: { column: 'sort_order' } })).map((s, i) => ({
  id: s.id,
  title_en: s.title_en || '',
  title_ar: s.title_ar || '',
  description_en: s.description_en || '',
  description_ar: s.description_ar || '',
  icon: s.icon || 'HiOfficeBuilding',
  sort_order: s.sort_order ?? i + 1,
}));
if (services.length > 0) await writeJson('services.json', services);

// ============ FAQ ============
const faq = (await fetchAll('faq_items', { order: { column: 'sort_order' } })).map((f) => ({
  id: f.id,
  question_en: f.question_en || '',
  question_ar: f.question_ar || '',
  answer_en: f.answer_en || '',
  answer_ar: f.answer_ar || '',
  sort_order: f.sort_order || 0,
}));
if (faq.length > 0) await writeJson('faq.json', faq);

// ============ SETTINGS ============
const settingsRows = await fetchAll('site_settings');
if (settingsRows.length > 0) {
  const settings = {};
  for (const row of settingsRows) {
    settings[row.key] = { en: row.value_en || '', ar: row.value_ar || '' };
  }
  await writeJson('settings.json', settings);
}

// ============ SEO PAGES ============
const seoRows = await fetchAll('seo_pages');
if (seoRows.length > 0) {
  const seo = {};
  for (const row of seoRows) {
    seo[row.page] = {
      title_en: row.title_en || '',
      title_ar: row.title_ar || '',
      description_en: row.description_en || '',
      description_ar: row.description_ar || '',
      og_image: row.og_image ?? null,
    };
  }
  await writeJson('seo.json', seo);
}

console.log('\n✅ Migration complete!');
console.log(
  shouldDownloadImages
    ? '   Images saved to public/uploads/migrated/'
    : '   (Image URLs left untouched — pass --download-images to localize them.)'
);
