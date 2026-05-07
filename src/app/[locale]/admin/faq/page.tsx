'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/admin-api';
import type { FaqItem } from '@/lib/content/types';

const emptyForm = { question_en: '', question_ar: '', answer_en: '', answer_ar: '', sort_order: 1 };

export default function AdminFaqPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/faq');
      if (res.ok) {
        const data = (await res.json()) as FaqItem[];
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const openAdd = () => {
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: FaqItem) => {
    setForm({
      question_en: item.question_en,
      question_ar: item.question_ar,
      answer_en: item.answer_en,
      answer_ar: item.answer_ar,
      sort_order: item.sort_order,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.question_en || !form.answer_en) return;
    setSaving(true);
    try {
      if (editingId) {
        const { item } = await adminApi.updateFaq(editingId, form);
        setItems(items.map((i) => (i.id === editingId ? item : i)));
      } else {
        const { item } = await adminApi.createFaq(form);
        setItems([...items, item]);
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
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return;
    try {
      await adminApi.deleteFaq(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة الأسئلة الشائعة' : 'FAQ Management'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة الأسئلة والأجوبة' : 'Manage questions and answers'}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all">
          <HiPlus className="w-5 h-5" />{isAr ? 'إضافة سؤال' : 'Add Question'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">{editingId ? (isAr ? 'تعديل السؤال' : 'Edit Question') : (isAr ? 'سؤال جديد' : 'New Question')}</h2>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><HiX className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Question (English)</label><input type="text" value={form.question_en} onChange={e => setForm({...form, question_en: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'السؤال (عربي)' : 'Question (Arabic)'}</label><input type="text" dir="rtl" value={form.question_ar} onChange={e => setForm({...form, question_ar: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Answer (English)</label><textarea rows={3} value={form.answer_en} onChange={e => setForm({...form, answer_en: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الإجابة (عربي)' : 'Answer (Arabic)'}</label><textarea rows={3} dir="rtl" value={form.answer_ar} onChange={e => setForm({...form, answer_ar: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الترتيب' : 'Sort Order'}</label><input type="number" min={1} value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value) || 1})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" /></div>
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
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-400">{isAr ? 'لا توجد أسئلة' : 'No FAQ items yet'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 text-left rtl:text-right text-xs text-gray-500 uppercase">
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">{isAr ? 'السؤال' : 'Question'}</th>
                <th className="px-6 py-4 font-medium">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {items.sort((a, b) => a.sort_order - b.sort_order).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.sort_order}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">{isAr ? item.question_ar : item.question_en}</p>
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-md">{isAr ? item.answer_ar : item.answer_en}</p>
                    </td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-gold rounded-lg hover:bg-gold/5 transition-all"><HiPencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"><HiTrash className="w-4 h-4" /></button>
                    </div></td>
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
