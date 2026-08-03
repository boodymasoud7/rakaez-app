'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { HiSave, HiPhotograph, HiPhone, HiGlobeAlt } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { adminApi } from '@/lib/admin-api';
import type { Project, SiteSettings } from '@/lib/content/types';

type FeaturedProject = Pick<Project, 'id' | 'name_en' | 'name_ar' | 'location_en' | 'location_ar' | 'featured'>;

export default function AdminHomepagePage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [projects, setProjects] = useState<FeaturedProject[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [settingsRes, projectsRes] = await Promise.all([
        fetch('/api/public/settings').then((r) => (r.ok ? r.json() : {})),
        fetch('/api/public/projects').then((r) => (r.ok ? r.json() : [])),
      ]);
      if (settingsRes && typeof settingsRes === 'object') setSettings(settingsRes as SiteSettings);
      if (Array.isArray(projectsRes)) setProjects(projectsRes as FeaturedProject[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const get = (key: string, lang: 'en' | 'ar') => settings[key]?.[lang] || '';
  const set = (key: string, lang: 'en' | 'ar', value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { en: prev[key]?.en || '', ar: prev[key]?.ar || '', [lang]: value },
    }));
  };
  const setSame = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: { en: value, ar: value } }));
  };

  const toggleFeatured = (id: string, featured: boolean) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, featured } : p)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const featuredProjectIds = projects.filter((p) => p.featured).map((p) => p.id);
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, featuredProjectIds }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Save failed');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      const msg = (err as Error)?.message;
      alert(msg ? (isAr ? `فشل في الحفظ: ${msg}` : `Save failed: ${msg}`) : (isAr ? 'فشل في الحفظ' : 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  // Bilingual field helper
  const BiField = ({ label, labelAr, keyName, textarea }: { label: string; labelAr: string; keyName: string; textarea?: boolean }) => (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
        {textarea ? (
          <textarea rows={3} value={get(keyName, 'en')} onChange={e => set(keyName, 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none text-sm" />
        ) : (
          <input type="text" value={get(keyName, 'en')} onChange={e => set(keyName, 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1.5">{isAr ? labelAr : `${label} (Arabic)`}</label>
        {textarea ? (
          <textarea rows={3} dir="rtl" value={get(keyName, 'ar')} onChange={e => set(keyName, 'ar', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none text-sm" />
        ) : (
          <input type="text" dir="rtl" value={get(keyName, 'ar')} onChange={e => set(keyName, 'ar', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" />
        )}
      </div>
    </div>
  );

  if (loading) return <AdminLayout><div className="text-center p-12 text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-gray-900">{isAr ? 'إعدادات الصفحة الرئيسية' : 'Homepage Settings'}</h1><p className="text-gray-500 text-sm mt-1">{isAr ? 'تحكم في كل محتوى الموقع من مكان واحد' : 'Control all site content from one place'}</p></div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50">
          <HiSave className="w-5 h-5" />{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : saved ? (isAr ? 'تم الحفظ ✓' : 'Saved ✓') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
        </button>
      </div>
      {saved && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl font-medium">{isAr ? 'تم الحفظ بنجاح!' : 'Saved successfully!'}</div>}

      <div className="space-y-8">
        {/* ===== HERO ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><HiPhotograph className="w-5 h-5 text-gold" />{isAr ? 'قسم الهيرو' : 'Hero Section'}</h2>
          <div className="space-y-4">
            <BiField label="Hero Title" labelAr="عنوان الهيرو" keyName="hero_title" />
            <BiField label="Hero Subtitle" labelAr="النص الفرعي" keyName="hero_subtitle" />
            <ImageUploader
              label={isAr ? 'صورة الهيرو الرئيسية (Homepage Hero Banner Image)' : 'Homepage Hero Banner Image'}
              value={get('hero_image', 'ar') || '/images/hero-banner-v2.png'}
              onChange={(url) => setSame('hero_image', url)}
              folder="banners"
              description={isAr ? 'اختر صورة من جهازك ليتم رفعها فوراً وتعيينها كغلاف للهيدر الرئيسي' : 'Upload homepage hero banner image directly from your device'}
            />
          </div>
        </div>

        {/* ===== ABOUT PREVIEW ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">{isAr ? 'قسم عن الشركة' : 'About Preview'}</h2>
          <div className="space-y-4">
            <BiField label="About Heading" labelAr="عنوان عن الشركة" keyName="about_heading" />
            <BiField label="About Text" labelAr="نص المقدمة" keyName="about_preview" textarea />
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{isAr ? 'إحصائيات وأرقام الشركة (العدادات)' : 'Company Statistics & Numbers'}</h2>
            <p className="text-xs text-gray-500 mt-1">{isAr ? 'التحكم في الأرقام والمسميات التي تظهر في شريط الأرقام (الرئيسية وعن الشركة)' : 'Control numbers and labels displayed in the stats section (Home & About)'}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1: Projects */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <span className="block text-xs font-bold text-gold uppercase">{isAr ? 'العداد الأول (المشاريع)' : 'Stat 1 (Projects)'}</span>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isAr ? 'العدد' : 'Number'}</label>
                <input type="number" value={get('stat_projects', 'en')} onChange={e => setSame('stat_projects', e.target.value)} placeholder="15" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-gold" />
              </div>
              <BiField label="Label (English)" labelAr="المسمى بالعربي" keyName="stat_projects_label" />
            </div>

            {/* Stat 2: Units */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <span className="block text-xs font-bold text-gold uppercase">{isAr ? 'العداد الثاني (الوحدات)' : 'Stat 2 (Units)'}</span>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isAr ? 'العدد' : 'Number'}</label>
                <input type="number" value={get('stat_units', 'en')} onChange={e => setSame('stat_units', e.target.value)} placeholder="2500" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-gold" />
              </div>
              <BiField label="Label (English)" labelAr="المسمى بالعربي" keyName="stat_units_label" />
            </div>

            {/* Stat 3: Clients */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <span className="block text-xs font-bold text-gold uppercase">{isAr ? 'العداد الثالث (العملاء)' : 'Stat 3 (Clients)'}</span>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isAr ? 'العدد' : 'Number'}</label>
                <input type="number" value={get('stat_clients', 'en')} onChange={e => setSame('stat_clients', e.target.value)} placeholder="1800" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-gold" />
              </div>
              <BiField label="Label (English)" labelAr="المسمى بالعربي" keyName="stat_clients_label" />
            </div>

            {/* Stat 4: Years */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <span className="block text-xs font-bold text-gold uppercase">{isAr ? 'العداد الرابع (الخبرة)' : 'Stat 4 (Years)'}</span>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isAr ? 'العدد' : 'Number'}</label>
                <input type="number" value={get('stat_years', 'en')} onChange={e => setSame('stat_years', e.target.value)} placeholder="12" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-gold" />
              </div>
              <BiField label="Label (English)" labelAr="المسمى بالعربي" keyName="stat_years_label" />
            </div>
          </div>
        </div>

        {/* ===== WHY CHOOSE US ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">{isAr ? 'لماذا ركائز (4 كروت)' : 'Why Choose Us (4 Cards)'}</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="border border-gray-100 rounded-xl p-4">
                <p className="text-sm font-bold text-gold mb-3">{isAr ? `الكارت ${n}` : `Card ${n}`}</p>
                <div className="space-y-3">
                  <BiField label={`Card ${n} Title`} labelAr={`عنوان الكارت ${n}`} keyName={`why${n}_title`} />
                  <BiField label={`Card ${n} Description`} labelAr={`وصف الكارت ${n}`} keyName={`why${n}_desc`} textarea />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CONTACT INFO ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><HiPhone className="w-5 h-5 text-gold" />{isAr ? 'بيانات التواصل' : 'Contact Information'}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-600 mb-1.5">{isAr ? 'الخط الساخن' : 'Hotline'}</label><input type="text" value={get('phone', 'en')} onChange={e => setSame('phone', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" placeholder="17074" /></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1.5">{isAr ? 'رقم الواتساب' : 'WhatsApp'}</label><input type="text" value={get('whatsapp', 'en')} onChange={e => setSame('whatsapp', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" placeholder="01000444276" /></div>
            <div><label className="block text-sm font-medium text-gray-600 mb-1.5">{isAr ? 'البريد الإلكتروني' : 'Email'}</label><input type="email" value={get('email', 'en')} onChange={e => setSame('email', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" placeholder="info@rakaezdevelopment.com" /></div>
          </div>
          <div className="mt-4">
            <BiField label="Address" labelAr="العنوان" keyName="address" />
          </div>
        </div>

        {/* ===== SOCIAL LINKS ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><HiGlobeAlt className="w-5 h-5 text-gold" />{isAr ? 'السوشيال ميديا' : 'Social Media Links'}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5"><FaFacebookF className="w-3.5 h-3.5 text-blue-600" />Facebook</label><input type="url" value={get('facebook', 'en')} onChange={e => setSame('facebook', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" placeholder="https://facebook.com/..." /></div>
            <div><label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5"><FaInstagram className="w-3.5 h-3.5 text-pink-600" />Instagram</label><input type="url" value={get('instagram', 'en')} onChange={e => setSame('instagram', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" placeholder="https://instagram.com/..." /></div>
            <div><label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1.5"><FaLinkedinIn className="w-3.5 h-3.5 text-blue-700" />LinkedIn</label><input type="url" value={get('linkedin', 'en')} onChange={e => setSame('linkedin', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" placeholder="https://linkedin.com/..." /></div>
          </div>
        </div>

        {/* ===== FEATURED PROJECTS ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">{isAr ? 'المشاريع المميزة' : 'Featured Projects'}</h2>
          <div className="space-y-3">
            {projects.map(p => (
              <label key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <input type="checkbox" checked={p.featured} onChange={e => toggleFeatured(p.id, e.target.checked)} className="w-5 h-5 rounded text-gold" />
                <span className="font-medium text-gray-900 text-sm">{isAr ? p.name_ar : p.name_en}</span>
                <span className="text-xs text-gray-400 ms-auto">{isAr ? p.location_ar : p.location_en}</span>
              </label>
            ))}
            {projects.length === 0 && <p className="text-gray-400 text-sm text-center py-4">{isAr ? 'لا توجد مشاريع' : 'No projects'}</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
