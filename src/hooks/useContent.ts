'use client';

import { useState, useEffect } from 'react';
import type {
  Project,
  BlogPost,
  Service,
  FaqItem,
} from '@/lib/content/types';

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<Project[]>('/api/public/projects', []).then((rows) => {
      setData(rows);
      setLoading(false);
    });
  }, []);

  return { projects: data, loading };
}

export function useFeaturedProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<Project[]>('/api/public/projects', []).then((rows) => {
      setData(rows.filter((p) => p.featured));
      setLoading(false);
    });
  }, []);

  return { projects: data, loading };
}

export function useProjectBySlug(slug: string) {
  const [data, setData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<Project[]>('/api/public/projects', []).then((rows) => {
      setData(rows.find((p) => p.slug === slug) || null);
      setLoading(false);
    });
  }, [slug]);

  return { project: data, loading };
}

export function useBlogPosts() {
  const [data, setData] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<BlogPost[]>('/api/public/blog', []).then((rows) => {
      setData(rows);
      setLoading(false);
    });
  }, []);

  return { posts: data, loading };
}

export function useBlogPostBySlug(slug: string) {
  const [data, setData] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<BlogPost[]>('/api/public/blog?all=true', []).then((rows) => {
      setData(rows.find((p) => p.slug === slug) || null);
      setLoading(false);
    });
  }, [slug]);

  return { post: data, loading };
}

export function useServices() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<Service[]>('/api/public/services', []).then((rows) => {
      setData(rows);
      setLoading(false);
    });
  }, []);

  return { services: data, loading };
}

export function useFaqItems() {
  const [data, setData] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<FaqItem[]>('/api/public/faq', []).then((rows) => {
      setData(rows);
      setLoading(false);
    });
  }, []);

  return { items: data, loading };
}
