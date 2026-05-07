'use client';

import { useState, useEffect } from 'react';
import type { SiteSettings } from '@/lib/content/types';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/settings', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: SiteSettings) => {
        if (data && typeof data === 'object') setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const get = (key: string, locale: string): string => {
    const lang = locale === 'ar' ? 'ar' : 'en';
    return settings[key]?.[lang] || '';
  };

  const getNum = (key: string): number => {
    return parseInt(settings[key]?.en || '0', 10);
  };

  return { settings, get, getNum, loading };
}
