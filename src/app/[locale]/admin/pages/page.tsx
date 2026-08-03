'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { HiSave, HiPhotograph, HiTemplate, HiPhone, HiInformationCircle, HiCollection } from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { adminApi } from '@/lib/admin-api';
import type { SiteSettings } from '@/lib/content/types';

export default function AdminPagesManagerPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'services' | 'projects' | 'blog'>('about');
  const [settings, setSettings] = useState<SiteSettings>({});

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/settings');
      if (res.ok) {
        const data = (await res.json()) as SiteSettings;
        if (data && typeof data === 'object') setSettings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const get = (key: string, lang: 'en' | 'ar') => settings[key]?.[lang] || '';
  const set = (key: string, lang: 'en' | 'ar', value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { en: lang === 'en' ? value : prev[key]?.en || value, ar: lang === 'ar' ? value : prev[key]?.ar || value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.saveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      alert(isAr ? 'فشل في حفظ التغييرات' : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center p-12 text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'about', label: isAr ? 'صفحة من نحن' : 'About Us Page', icon: HiInformationCircle },
    { id: 'contact', label: isAr ? 'صفحة تواصل معنا' : 'Contact Us Page', icon: HiPhone },
    { id: 'services', label: isAr ? 'صفحة الخدمات' : 'Services Page', icon: HiTemplate },
    { id: 'projects', label: isAr ? 'صفحة المشاريع' : 'Projects Page', icon: HiCollection },
    { id: 'blog', label: isAr ? 'صفحة المدونة' : 'Blog Page', icon: HiPhotograph },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة محتوى صفحات الموقع والهيدر' : 'Pages Content & Banners Manager'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isAr ? 'التحكم الكامل في صور الهيدر والنصوص والعناوين لجميع صفحات الموقع' : 'Full control over hero banners, titles, and content across all pages'}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50 shadow-md"
        >
          <HiSave className="w-5 h-5" />
          {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ كافة التغيرات' : 'Save All Changes')}
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl font-medium border border-emerald-200">
          {isAr ? 'تم حفظ محتوى الصفحات بنجاح!' : 'Page content saved successfully!'}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-gold text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 space-y-6">
        {activeTab === 'about' && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isAr ? 'تعديل صفحة من نحن (About Us)' : 'Edit About Us Page'}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploader
                label={isAr ? 'صورة هيدر صفحة من نحن' : 'About Hero Banner Image'}
                value={get('about_hero_image', 'ar') || '/images/about-hero-v2.png'}
                onChange={(url) => {
                  set('about_hero_image', 'ar', url);
                  set('about_hero_image', 'en', url);
                }}
                folder="banners"
                description={isAr ? 'اختر صورة من جهازك ليتم رفعها وتعيينها هيدر لصفحة من نحن' : 'Upload or change the hero banner image'}
              />

              <ImageUploader
                label={isAr ? 'صورة فريق العمل (قصتنا)' : 'Our Story Team Photo'}
                value={get('about_team_image', 'ar') || '/images/story-team.jpg'}
                onChange={(url) => {
                  set('about_team_image', 'ar', url);
                  set('about_team_image', 'en', url);
                }}
                folder="team"
                description={isAr ? 'رفع وتعديل صورة فريق عمل ركائز المعروضة في قصتنا' : 'Upload team photo for story section'}
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{isAr ? 'عنوان الهيدر (عربي)' : 'Header Title (AR)'}</label>
                <input
                  type="text"
                  value={get('about_title_ar', 'ar') || 'عن ركائز للتطوير العقاري'}
                  onChange={(e) => set('about_title_ar', 'ar', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{isAr ? 'عنوان الهيدر (إنجليزي)' : 'Header Title (EN)'}</label>
                <input
                  type="text"
                  value={get('about_title_en', 'en') || 'About Rakaez Developments'}
                  onChange={(e) => set('about_title_en', 'en', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{isAr ? 'نص قصتنا بالكامل (Our Story Text)' : 'Our Story Text'}</label>
                <textarea
                  rows={4}
                  value={get('about_story_ar', 'ar') || 'تأسست شركة ركائز للتطوير العقاري منذ ست سنوات برؤية واضحة وهي بعنوان «نبني حياة»، والثقة التي رأيناها في أعين عملائنا السابقين والحاليين جعلتنا نتقدم خطوة بخطوة لمشاريع أكثر وحياة أفضل.'}
                  onChange={(e) => set('about_story_ar', 'ar', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isAr ? 'تعديل صفحة تواصل معنا (Contact Us)' : 'Edit Contact Us Page'}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploader
                label={isAr ? 'صورة هيدر صفحة تواصل معنا' : 'Contact Hero Banner Image'}
                value={get('contact_hero_image', 'ar') || '/images/contact-hero-v1.jpg'}
                onChange={(url) => {
                  set('contact_hero_image', 'ar', url);
                  set('contact_hero_image', 'en', url);
                }}
                folder="banners"
                description={isAr ? 'رفع وتعيين صورة الهيدر الرئيسية لصفحة تواصل معنا' : 'Upload or edit contact hero image'}
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{isAr ? 'الخط الساخن (Hotline)' : 'Hotline Phone'}</label>
                  <input
                    type="text"
                    value={get('phone', 'ar') || '17074'}
                    onChange={(e) => {
                      set('phone', 'ar', e.target.value);
                      set('phone', 'en', e.target.value);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{isAr ? 'رقم الواتساب (WhatsApp)' : 'WhatsApp Number'}</label>
                  <input
                    type="text"
                    value={get('whatsapp', 'ar') || '01000444276'}
                    onChange={(e) => {
                      set('whatsapp', 'ar', e.target.value);
                      set('whatsapp', 'en', e.target.value);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{isAr ? 'البريد الإلكتروني (Email)' : 'Email'}</label>
                  <input
                    type="text"
                    value={get('email', 'ar') || 'info@rakaezdevelopment.com'}
                    onChange={(e) => {
                      set('email', 'ar', e.target.value);
                      set('email', 'en', e.target.value);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{isAr ? 'العنوان الجغرافي (Address)' : 'Office Address'}</label>
                <input
                  type="text"
                  value={get('address', 'ar') || 'دمياط الجديدة - تقاطع شارع البشبيشي مع شارع ابوالخير'}
                  onChange={(e) => set('address', 'ar', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none"
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'services' && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isAr ? 'تعديل هيدر صفحة الخدمات (Services Page Banner)' : 'Edit Services Banner'}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploader
                label={isAr ? 'صورة هيدر صفحة الخدمات' : 'Services Hero Banner Image'}
                value={get('services_hero_image', 'ar') || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80'}
                onChange={(url) => {
                  set('services_hero_image', 'ar', url);
                  set('services_hero_image', 'en', url);
                }}
                folder="banners"
                description={isAr ? 'رفع وتعديل صورة هيدر صفحة الخدمات' : 'Upload services header banner'}
              />
            </div>
          </>
        )}

        {activeTab === 'projects' && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isAr ? 'تعديل هيدر صفحة المشاريع (Projects Page Banner)' : 'Edit Projects Banner'}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploader
                label={isAr ? 'صورة هيدر صفحة المشاريع' : 'Projects Hero Banner Image'}
                value={get('projects_hero_image', 'ar') || '/images/hero-banner-v2.png'}
                onChange={(url) => {
                  set('projects_hero_image', 'ar', url);
                  set('projects_hero_image', 'en', url);
                }}
                folder="banners"
                description={isAr ? 'رفع وتعديل صورة هيدر صفحة المشاريع الرئيسية' : 'Upload projects header banner'}
              />
            </div>
          </>
        )}

        {activeTab === 'blog' && (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{isAr ? 'تعديل هيدر صفحة المدونة (Blog Page Banner)' : 'Edit Blog Banner'}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploader
                label={isAr ? 'صورة هيدر صفحة المدونة' : 'Blog Hero Banner Image'}
                value={get('blog_hero_image', 'ar') || '/images/hero-banner-v2.png'}
                onChange={(url) => {
                  set('blog_hero_image', 'ar', url);
                  set('blog_hero_image', 'en', url);
                }}
                folder="banners"
                description={isAr ? 'رفع وتعديل صورة هيدر صفحة المدونة' : 'Upload blog header banner'}
              />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
