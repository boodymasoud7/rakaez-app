'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { HiPlus, HiPencil, HiTrash, HiEye, HiX } from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi, uploadFile } from '@/lib/admin-api';
import { optimizeImage, isImageFile } from '@/lib/image-utils';
import type { Project, UnitType, UnitCategory } from '@/lib/content/types';

const emptyForm = {
  name_en: '', name_ar: '', slug: '', location_en: '', location_ar: '',
  description_en: '', description_ar: '', status: 'upcoming' as Project['status'], featured: false,
  unit_types: [] as UnitType[],
};

const emptyUnitType: UnitType = { category: 'residential', area_from: 0, area_to: 0 };

export default function AdminProjectsPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/projects');
      if (res.ok) {
        const data = (await res.json()) as Project[];
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setImageFile(null); setBrochureFile(null); setShowForm(true); };

  const openEdit = (p: Project) => {
    setForm({
      name_en: p.name_en, name_ar: p.name_ar, slug: p.slug,
      location_en: p.location_en, location_ar: p.location_ar,
      description_en: p.description_en, description_ar: p.description_ar,
      status: p.status, featured: p.featured,
      unit_types: Array.isArray(p.unit_types) ? p.unit_types : [],
    });
    setEditingId(p.id);
    setImageFile(null);
    setBrochureFile(null);
    setShowForm(true);
  };

  const addUnitType = () => setForm({ ...form, unit_types: [...form.unit_types, { ...emptyUnitType }] });
  const removeUnitType = (idx: number) => setForm({ ...form, unit_types: form.unit_types.filter((_, i) => i !== idx) });
  const updateUnitType = (idx: number, patch: Partial<UnitType>) =>
    setForm({
      ...form,
      unit_types: form.unit_types.map((u, i) => (i === idx ? { ...u, ...patch } : u)),
    });

  const handleSave = async () => {
    if (!form.name_en) return;
    setSaving(true);
    try {
      let cover_image: string | undefined;
      if (imageFile && isImageFile(imageFile)) {
        const optimized = await optimizeImage(imageFile);
        const result = await uploadFile(optimized.blob, { folder: 'projects', fileName: optimized.fileName });
        cover_image = result.url;
      }

      let brochure_url: string | undefined;
      if (brochureFile) {
        const result = await uploadFile(brochureFile, { folder: 'brochures' });
        brochure_url = result.url;
      }

      const slug = form.slug || generateSlug(form.name_en);
      // Drop empty unit_types rows so we don't persist placeholder data
      const cleanedUnitTypes = form.unit_types.filter(
        (u) => Number(u.area_from) > 0 || Number(u.area_to) > 0
      ).map((u) => ({
        category: u.category,
        area_from: Number(u.area_from) || 0,
        area_to: Number(u.area_to) || Number(u.area_from) || 0,
      }));
      const payload = {
        ...form,
        slug,
        unit_types: cleanedUnitTypes,
        ...(cover_image ? { cover_image } : {}),
        ...(brochure_url ? { brochure_url } : {}),
      };

      if (editingId) {
        const { project } = await adminApi.updateProject(editingId, payload);
        setProjects(projects.map((p) => (p.id === editingId ? project : p)));
      } else {
        const { project } = await adminApi.createProject(payload);
        setProjects([project, ...projects]);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert(isAr ? 'فشل في الحفظ' : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;
    try {
      await adminApi.deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة المشاريع' : 'Projects Management'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة جميع المشاريع' : 'Manage all projects'}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all">
          <HiPlus className="w-5 h-5" />{isAr ? 'إضافة مشروع' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">{editingId ? (isAr ? 'تعديل المشروع' : 'Edit Project') : (isAr ? 'إضافة مشروع جديد' : 'Add New Project')}</h2>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><HiX className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'اسم المشروع (English)' : 'Project Name (English)'}</label>
              <input type="text" value={form.name_en} onChange={e => setForm({...form, name_en: e.target.value, slug: form.slug || generateSlug(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'اسم المشروع (عربي)' : 'Project Name (Arabic)'}</label>
              <input type="text" dir="rtl" value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الموقع (English)' : 'Location (English)'}</label>
              <input type="text" value={form.location_en} onChange={e => setForm({...form, location_en: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الموقع (عربي)' : 'Location (Arabic)'}</label>
              <input type="text" dir="rtl" value={form.location_ar} onChange={e => setForm({...form, location_ar: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الوصف (English)' : 'Description (English)'}</label>
              <textarea rows={3} value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
              <textarea rows={3} dir="rtl" value={form.description_ar} onChange={e => setForm({...form, description_ar: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الحالة' : 'Status'}</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Project['status']})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none">
                <option value="upcoming">{isAr ? 'قادم' : 'Upcoming'}</option>
                <option value="ongoing">{isAr ? 'جاري' : 'Ongoing'}</option>
                <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'صورة الغلاف' : 'Cover Image'}</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <p className="text-xs text-gray-400 mt-1">{isAr ? 'سيتم ضغط الصورة تلقائياً' : 'Auto-compressed to WebP'}</p>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-5 h-5 text-gold rounded" />
                <span className="text-sm font-medium text-gray-700">{isAr ? 'مشروع مميز' : 'Featured Project'}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'كتيب المشروع (PDF)' : 'Brochure (PDF)'}</label>
              <input type="file" accept=".pdf" onChange={e => setBrochureFile(e.target.files?.[0] || null)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <p className="text-xs text-gray-400 mt-1">{isAr ? 'PDF فقط - حد أقصى 10MB' : 'PDF only - max 10MB'}</p>
            </div>
          </div>

          {/* Unit Types editor */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">{isAr ? 'أنواع الوحدات' : 'Unit Types'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{isAr ? 'سكني / تجاري / إداري مع نطاق المساحة بالمتر المربع' : 'Residential / Commercial / Administrative with area range in m²'}</p>
              </div>
              <button type="button" onClick={addUnitType} className="flex items-center gap-1.5 px-4 py-2 bg-gold/10 text-gold-dark hover:bg-gold/20 font-semibold rounded-lg text-sm transition-colors">
                <HiPlus className="w-4 h-4" />{isAr ? 'إضافة نوع' : 'Add type'}
              </button>
            </div>
            {form.unit_types.length === 0 ? (
              <div className="text-center py-8 px-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400">
                {isAr ? 'لم تتم إضافة أي أنواع وحدات بعد' : 'No unit types added yet'}
              </div>
            ) : (
              <div className="space-y-3">
                {form.unit_types.map((unit, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 items-end bg-gray-50 rounded-xl p-3">
                    <div className="col-span-12 sm:col-span-4">
                      <label className="block text-xs font-medium text-gray-600 mb-1">{isAr ? 'الفئة' : 'Category'}</label>
                      <select
                        value={unit.category}
                        onChange={e => updateUnitType(idx, { category: e.target.value as UnitCategory })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none bg-white"
                      >
                        <option value="residential">{isAr ? 'سكني' : 'Residential'}</option>
                        <option value="commercial">{isAr ? 'تجاري' : 'Commercial'}</option>
                        <option value="administrative">{isAr ? 'إداري' : 'Administrative'}</option>
                      </select>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">{isAr ? 'من (م²)' : 'From (m²)'}</label>
                      <input
                        type="number"
                        min={0}
                        value={unit.area_from || ''}
                        onChange={e => updateUnitType(idx, { area_from: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none bg-white"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">{isAr ? 'إلى (م²)' : 'To (m²)'}</label>
                      <input
                        type="number"
                        min={0}
                        value={unit.area_to || ''}
                        onChange={e => updateUnitType(idx, { area_to: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none bg-white"
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeUnitType(idx)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={isAr ? 'حذف' : 'Remove'}>
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50">{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">{isAr ? 'إلغاء' : 'Cancel'}</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-gray-400">{isAr ? 'لا توجد مشاريع' : 'No projects yet'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 text-left rtl:text-right text-xs text-gray-500 uppercase">
                <th className="px-6 py-4 font-medium">{isAr ? 'المشروع' : 'Project'}</th>
                <th className="px-6 py-4 font-medium">{isAr ? 'الموقع' : 'Location'}</th>
                <th className="px-6 py-4 font-medium">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 font-medium">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.cover_image && <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"><Image src={project.cover_image} alt="" fill className="object-cover" /></div>}
                        <span className="font-medium text-gray-900">{isAr ? project.name_ar : project.name_en}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{isAr ? project.location_ar : project.location_en}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'completed' ? 'bg-green-100 text-green-700' :
                        project.status === 'ongoing' ? 'bg-gold/10 text-gold-dark' : 'bg-blue-100 text-blue-700'
                      }`}>{project.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/${locale}/projects/${project.slug}`} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-all"><HiEye className="w-4 h-4" /></Link>
                        <button onClick={() => openEdit(project)} className="p-2 text-gray-400 hover:text-gold rounded-lg hover:bg-gold/5 transition-all"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
