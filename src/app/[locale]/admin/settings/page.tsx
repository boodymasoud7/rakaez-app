'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { HiSave, HiPhone, HiLocationMarker, HiLink, HiCog, HiShieldCheck } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
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
      [key]: { en: lang === 'en' ? value : (prev[key]?.en || value), ar: lang === 'ar' ? value : (prev[key]?.ar || value) },
    }));
  };

  const isMaintenanceOn = get('maintenance_mode', 'ar') === 'true' || get('maintenance_mode', 'en') === 'true';

  const toggleMaintenance = (enabled: boolean) => {
    const val = enabled ? 'true' : 'false';
    setSettings((prev) => ({
      ...prev,
      maintenance_mode: { en: val, ar: val },
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'إعدادات الموقع' : 'Site Settings'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة معلومات وحالة الموقع' : 'Manage site information & status'}</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50">
          <HiSave className="w-5 h-5" />{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
        </button>
      </div>
      {saved && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl font-medium">{isAr ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!'}</div>}

      <div className="space-y-8">
        {/* Maintenance Mode Control Switch */}
        <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-colors ${isMaintenanceOn ? 'border-amber-400 bg-amber-50/20' : 'border-emerald-500/30'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 ${isMaintenanceOn ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                {isMaintenanceOn ? <HiCog className="w-6 h-6 animate-spin" /> : <HiShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {isAr ? 'وضع الصيانة (موقعنا تحت التطوير)' : 'Maintenance Mode (Under Development)'}
                </h2>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  {isAr 
                    ? 'عند تفعيل هذا الخيار، سيظهر للزوار صفحة "الموقع تحت الصيانة والتطوير"، بينما يمكنك كأدمن معاينة الموقع والتعديل عليه مباشرة.'
                    : 'When enabled, public visitors will see the "Site Under Maintenance" page, while logged-in admins can preview the live site.'}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${isMaintenanceOn ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    <span className={`w-2 h-2 rounded-full ${isMaintenanceOn ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    {isAr 
                      ? (isMaintenanceOn ? 'وضع الصيانة مُفعل حالياً (الموقع مغلق أمام الزوار)' : 'الموقع متاح للجمهور (لايف)')
                      : (isMaintenanceOn ? 'Maintenance Mode Active' : 'Site Live to Public')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-200 self-start sm:self-center">
              <span className={`text-sm font-medium ${!isMaintenanceOn ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                {isAr ? 'الموقع لايف' : 'Live'}
              </span>
              <button
                type="button"
                onClick={() => toggleMaintenance(!isMaintenanceOn)}
                className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isMaintenanceOn ? 'bg-amber-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isMaintenanceOn ? (isAr ? '-translate-x-7' : 'translate-x-7') : 'translate-x-0'}`}
                />
              </button>
              <span className={`text-sm font-medium ${isMaintenanceOn ? 'text-amber-700 font-bold' : 'text-gray-500'}`}>
                {isAr ? 'تحت التطوير' : 'Maintenance'}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><HiPhone className="w-5 h-5 text-gold" />{isAr ? 'معلومات التواصل' : 'Contact Information'}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label><input type="text" value={get('phone', 'en')} onChange={e => set('phone', 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'واتساب' : 'WhatsApp'}</label><input type="text" value={get('whatsapp', 'en')} onChange={e => set('whatsapp', 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'البريد الإلكتروني' : 'Email'}</label><input type="email" value={get('email', 'en')} onChange={e => set('email', 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" /></div>
          </div>
        </div>

        {/* Address & Google Maps */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><HiLocationMarker className="w-5 h-5 text-gold" />{isAr ? 'العنوان والخريطة' : 'Address & Map Link'}</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Address (English)</label><textarea rows={2} value={get('address_en', 'en')} onChange={e => set('address_en', 'en', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'العنوان (عربي)' : 'Address (Arabic)'}</label><textarea rows={2} dir="rtl" value={get('address_ar', 'ar')} onChange={e => set('address_ar', 'ar', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none" /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'رابط خريطة جوجل (Google Maps Link)' : 'Google Maps Link'}</label>
              <input type="url" value={get('map_link', 'en')} onChange={e => set('map_link', 'en', e.target.value)} placeholder="https://maps.app.goo.gl/..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none text-sm" />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><HiLink className="w-5 h-5 text-gold" />{isAr ? 'وسائل التواصل الاجتماعي' : 'Social Media Links'}</h2>
          <div className="space-y-4">
            {[
              { key: 'facebook', label: 'Facebook', icon: FaFacebookF, placeholder: 'https://www.facebook.com/rakaezdevelopment' },
              { key: 'instagram', label: 'Instagram', icon: FaInstagram, placeholder: 'https://www.instagram.com/rakaez_development/' },
              { key: 'whatsapp_link', label: 'WhatsApp Link', icon: FaWhatsapp, placeholder: 'https://wa.me/201000444276' },
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
