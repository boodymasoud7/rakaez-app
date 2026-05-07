'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { HiSave, HiGlobe } from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import type { SeoPage as SeoPageData, SeoPages } from '@/lib/content/types';

interface SeoPageEntry extends SeoPageData {
  page: string;
}

export default function AdminSeoPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [pages, setPages] = useState<SeoPageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadPages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/seo');
      if (res.ok) {
        const data = (await res.json()) as SeoPages;
        const entries: SeoPageEntry[] = Object.entries(data || {}).map(
          ([page, value]) => ({ page, ...value })
        );
        setPages(entries.sort((a, b) => a.page.localeCompare(b.page)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPages(); }, [loadPages]);

  const updateField = (page: string, field: keyof SeoPageEntry, value: string) => {
    setPages(pages.map((p) => (p.page === page ? { ...p, [field]: value } : p)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: SeoPages = {};
      for (const p of pages) {
        const { page, ...rest } = p;
        payload[page] = rest;
      }
      await adminApi.saveSeo(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert(isAr ? 'فشل في الحفظ' : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="text-center p-12 text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'تحسين محركات البحث' : 'SEO Settings'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة عناوين ووصف الصفحات' : 'Manage page titles and descriptions'}</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50">
          <HiSave className="w-5 h-5" />{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ الكل' : 'Save All')}
        </button>
      </div>
      {saved && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl font-medium">{isAr ? 'تم الحفظ!' : 'Saved successfully!'}</div>}

      <div className="space-y-6">
        {pages.map(page => (
          <div key={page.page} className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 capitalize">
              <HiGlobe className="w-5 h-5 text-gold" />{page.page}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title (EN)</label>
                <input type="text" value={page.title_en} onChange={e => updateField(page.page, 'title_en', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title (AR)</label>
                <input type="text" dir="rtl" value={page.title_ar} onChange={e => updateField(page.page, 'title_ar', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description (EN)</label>
                <input type="text" value={page.description_en} onChange={e => updateField(page.page, 'description_en', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description (AR)</label>
                <input type="text" dir="rtl" value={page.description_ar} onChange={e => updateField(page.page, 'description_ar', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
