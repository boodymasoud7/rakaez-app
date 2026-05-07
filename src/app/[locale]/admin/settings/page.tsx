'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { HiSave, HiPhone, HiLocationMarker, HiLink } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import type { SiteSettings } from '@/lib/content/types';

export default function AdminSettingsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const get = (key: string, lang: 'en' | 'ar') => settings[key]?.[lang] || '';
  const set = (key: string, lang: 'en' | 'ar', value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { en: prev[key]?.en || '', ar: prev[key]?.ar || '', [lang]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.saveSettings(settings);
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
        <div><h1 className="text-2xl font-bold text-gray-900">{isAr ? 'إعدادات الموقع' : 'Site Settings'}</h1><p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة معلومات الموقع' : 'Manage site information'}</p></div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50">
          <HiSave className="w-5 h-5" />{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}
        </button>
      </div>
      {saved && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl font-medium">{isAr ? 'تم الحفظ!' : 'Saved successfully!'}</div>}

      <div className="space-y-8">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><HiPhone className="w-5 h-5 text-gold" />{isAr ? 'معلومات التواصل' : 'Contact Information'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label><input type="text" value={get('phone', 'en')} onChange={e => set('phone', 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'واتساب' : 'WhatsApp'}</label><input type="text" value={get('whatsapp', 'en')} onChange={e => set('whatsapp', 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'البريد الإلكتروني' : 'Email'}</label><input type="email" value={get('email', 'en')} onChange={e => set('email', 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" /></div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><HiLocationMarker className="w-5 h-5 text-gold" />{isAr ? 'العنوان' : 'Address'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Address (English)</label><textarea rows={2} value={get('address_en', 'en')} onChange={e => set('address_en', 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'العنوان (عربي)' : 'Address (Arabic)'}</label><textarea rows={2} dir="rtl" value={get('address_ar', 'ar')} onChange={e => set('address_ar', 'ar', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none" /></div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><HiLink className="w-5 h-5 text-gold" />{isAr ? 'وسائل التواصل' : 'Social Media'}</h2>
          <div className="space-y-4">
            {[
              { key: 'facebook', label: 'Facebook', icon: FaFacebookF, placeholder: 'https://facebook.com/rakaez' },
              { key: 'instagram', label: 'Instagram', icon: FaInstagram, placeholder: 'https://instagram.com/rakaez' },
              { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn, placeholder: 'https://linkedin.com/company/rakaez' },
              { key: 'whatsapp_link', label: 'WhatsApp Link', icon: FaWhatsapp, placeholder: 'https://wa.me/97317074' },
            ].map(s => (
              <div key={s.key} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"><s.icon className="w-4 h-4 text-gray-500" /></div>
                <input type="url" value={get(s.key, 'en')} onChange={e => set(s.key, 'en', e.target.value)} placeholder={s.placeholder} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
