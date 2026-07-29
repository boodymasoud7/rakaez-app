import type { MetadataRoute } from 'next';
import { getProjects, getBlogPosts } from '@/lib/content/reader';

const BASE_URL = process.env.SITE_URL || 'https://rakaezdevelopment.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()]);

  const entries: MetadataRoute.Sitemap = [];
  const pages = ['', '/about', '/projects', '/services', '/blog', '/contact', '/faq'];

  for (const locale of ['ar', 'en']) {
    const altLocale = locale === 'ar' ? 'en' : 'ar';
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            [altLocale]: `${BASE_URL}/${altLocale}${page}`,
          },
        },
      });
    }

    for (const project of projects) {
      entries.push({
        url: `${BASE_URL}/${locale}/projects/${project.slug}`,
        lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            [altLocale]: `${BASE_URL}/${altLocale}/projects/${project.slug}`,
          },
        },
      });
    }

    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            [altLocale]: `${BASE_URL}/${altLocale}/blog/${post.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
