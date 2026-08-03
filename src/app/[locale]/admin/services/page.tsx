'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { HiSave, HiPlus, HiTrash, HiSparkles, HiOfficeBuilding, HiTrendingUp, HiCog, HiLightBulb } from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import type { Service } from '@/lib/content/types';

const availableIcons = [
  { name: 'HiSparkles', label: 'ديكور وتشطيبات' },
  { name: 'HiOfficeBuilding', label: 'مباني وتطوير' },
  { name: 'HiTrendingUp', label: 'استثمار ونمو' },
  { name: 'HiCog', label: 'إدارة وتجهيز' },
  { name: 'HiLightBulb', label: 'استشارات وأفكار' },
];

export default function AdminServicesPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch('/api/public/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    const newSvc: Service = {
      id: `svc-${Date.now()}`,
      title_ar: 'خدمة جديدة',
      title_en: 'New Service',
      description_ar: 'وصف الخدمة الجديدة...',
      description_en: 'New service description...',
      icon: 'HiSparkles',
      sort_order: services.length + 1,
    };
    setServices([...services, newSvc]);
  };

  const handleRemove = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleChange = (index: number, field: keyof Service, value: string | number) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(services),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        alert(isAr ? 'حدث خطأ أثناء الحفظ' : 'Error saving services');
      }
    } catch (err) {
      console.error(err);
      alert(isAr ? 'فشل في الاتصال' : 'Connection failed');
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

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة الخدمات والتخصصات' : 'Services Management'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isAr ? 'إضافة وتعديل وحذف الخدمات المعروضة بالموقع' : 'Add, edit, and organize services'}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all"
          >
            <HiPlus className="w-5 h-5" />
            {isAr ? 'إضافة خدمة جديدة' : 'Add New Service'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50 shadow-md"
          >
            <HiSave className="w-5 h-5" />
            {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
          </button>
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl font-medium border border-emerald-200">
          {isAr ? 'تم حفظ قائمة الخدمات بنجاح!' : 'Services saved successfully!'}
        </div>
      )}

      <div className="space-y-6">
        {services.map((svc, i) => (
          <div key={svc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-700 text-lg">الخدمة #{i + 1}</span>
              <button
                onClick={() => handleRemove(svc.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title={isAr ? 'حذف الخدمة' : 'Delete Service'}
              >
                <HiTrash className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{isAr ? 'اسم الخدمة (بالعربية)' : 'Title (Arabic)'}</label>
                <input
                  type="text"
                  value={svc.title_ar}
                  onChange={(e) => handleChange(i, 'title_ar', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{isAr ? 'اسم الخدمة (بالإنجليزية)' : 'Title (English)'}</label>
                <input
                  type="text"
                  value={svc.title_en}
                  onChange={(e) => handleChange(i, 'title_en', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{isAr ? 'وصف الخدمة (بالعربية)' : 'Description (Arabic)'}</label>
                <textarea
                  rows={3}
                  value={svc.description_ar}
                  onChange={(e) => handleChange(i, 'description_ar', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{isAr ? 'وصف الخدمة (بالإنجليزية)' : 'Description (English)'}</label>
                <textarea
                  rows={3}
                  value={svc.description_en}
                  onChange={(e) => handleChange(i, 'description_en', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{isAr ? 'أيقونة الخدمة' : 'Service Icon'}</label>
                <select
                  value={svc.icon}
                  onChange={(e) => handleChange(i, 'icon', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none bg-white"
                >
                  {availableIcons.map((ic) => (
                    <option key={ic.name} value={ic.name}>
                      {ic.name} ({ic.label})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{isAr ? 'ترتيب العرض' : 'Sort Order'}</label>
                <input
                  type="number"
                  value={svc.sort_order}
                  onChange={(e) => handleChange(i, 'sort_order', parseInt(e.target.value) || i + 1)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
