import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { cache } from 'react';
import type {
  Project,
  BlogPost,
  Service,
  FaqItem,
  SiteSettings,
  SeoPages,
  SeoPage,
  Locale,
  Inquiry,
  AnalyticsData,
} from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Read a JSON file from /content. Returns a default value if the file is
 * missing or invalid (so the site never crashes during early setup).
 */
async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(CONTENT_DIR, fileName);
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`[content] failed to read ${fileName}:`, err);
    }
    return fallback;
  }
}

// ============ PROJECTS ============

export const getAllProjects = cache(async (): Promise<Project[]> => {
  const projects = await readJson<Project[]>('projects.json', []);
  return [...projects].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const projects = await getAllProjects();
  return projects.filter((p) => p.published !== false);
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    const projects = await getAllProjects();
    return projects.find((p) => p.slug === slug && p.published !== false) || null;
  }
);

// ============ BLOG ============

export const getAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const posts = await readJson<BlogPost[]>('blog.json', []);
  return [...posts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const all = await getAllBlogPosts();
  return all.filter((p) => p.published);
});

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const all = await getAllBlogPosts();
    return all.find((p) => p.slug === slug) || null;
  }
);

// ============ SERVICES ============

export const getServices = cache(async (): Promise<Service[]> => {
  const services = await readJson<Service[]>('services.json', []);
  return [...services].sort((a, b) => a.sort_order - b.sort_order);
});

// ============ FAQ ============

export const getFaqItems = cache(async (): Promise<FaqItem[]> => {
  const items = await readJson<FaqItem[]>('faq.json', []);
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
});

// ============ SITE SETTINGS ============

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return readJson<SiteSettings>('settings.json', {});
});

export async function getSetting(
  key: string,
  locale: Locale = 'en'
): Promise<string> {
  const settings = await getSiteSettings();
  return settings[key]?.[locale] ?? '';
}

// ============ SEO ============

export const getSeoPages = cache(async (): Promise<SeoPages> => {
  return readJson<SeoPages>('seo.json', {});
});

export async function getSeoPage(page: string): Promise<SeoPage | null> {
  const pages = await getSeoPages();
  return pages[page] || null;
}

// ============ INQUIRIES & ANALYTICS ============

export const getInquiries = cache(async (): Promise<Inquiry[]> => {
  const items = await readJson<Inquiry[]>('inquiries.json', []);
  return [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});

export const getAnalytics = cache(async (): Promise<AnalyticsData> => {
  return readJson<AnalyticsData>('analytics.json', {
    totalVisits: 0,
    todayVisits: 0,
    todayDate: new Date().toISOString().split('T')[0],
    dailyStats: [],
    lastUpdated: new Date().toISOString(),
  });
});

