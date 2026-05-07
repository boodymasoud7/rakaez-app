'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi, uploadFile } from '@/lib/admin-api';
import { optimizeImage, isImageFile } from '@/lib/image-utils';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { BlogPost } from '@/lib/content/types';

const CATEGORIES = ['news', 'market', 'tips', 'projects', 'lifestyle'];

const emptyForm = {
  title_en: '', title_ar: '', slug: '', content_en: '', content_ar: '',
  excerpt_en: '', excerpt_ar: '', seo_title: '', seo_description: '', category: '', published: true,
};

export default function AdminBlogPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public/blog?all=true');
      if (res.ok) {
        const data = (await res.json()) as BlogPost[];
        setPosts(data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setImageFile(null); setShowForm(true); };

  const openEdit = (post: BlogPost) => {
    setForm({
      title_en: post.title_en, title_ar: post.title_ar, slug: post.slug,
      content_en: post.content_en, content_ar: post.content_ar,
      excerpt_en: post.excerpt_en || '', excerpt_ar: post.excerpt_ar || '',
      seo_title: post.seo_title || '', seo_description: post.seo_description || '',
      category: post.category || '',
      published: post.published,
    });
    setEditingId(post.id);
    setImageFile(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title_en || !form.content_en) return;
    setSaving(true);
    try {
      let image_url: string | undefined;
      if (imageFile && isImageFile(imageFile)) {
        const optimized = await optimizeImage(imageFile);
        const result = await uploadFile(optimized.blob, { folder: 'blog', fileName: optimized.fileName });
        image_url = result.url;
      }

      const slug = form.slug || generateSlug(form.title_en);
      const payload = { ...form, slug, ...(image_url ? { image_url } : {}) };

      if (editingId) {
        const { post } = await adminApi.updateBlog(editingId, payload);
        setPosts(posts.map((p) => (p.id === editingId ? post : p)));
      } else {
        const { post } = await adminApi.createBlog(payload);
        setPosts([post, ...posts]);
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
    if (!confirm(isAr ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
    try {
      await adminApi.deleteBlog(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const F = (label: string, value: string, onChange: (v: string) => void, opts?: { dir?: string; rows?: number }) => (
    <div className={opts?.rows ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {opts?.rows ? (
        <textarea rows={opts.rows} dir={opts?.dir} value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none resize-none" />
      ) : (
        <input type="text" dir={opts?.dir} value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none" />
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة المدونة' : 'Blog Management'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة المقالات والأخبار' : 'Manage articles and news'}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all">
          <HiPlus className="w-5 h-5" />{isAr ? 'إضافة مقال' : 'Add Article'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">{editingId ? (isAr ? 'تعديل المقال' : 'Edit Article') : (isAr ? 'مقال جديد' : 'New Article')}</h2>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><HiX className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {F('Title (English)', form.title_en, v => setForm({...form, title_en: v, slug: form.slug || generateSlug(v)}))}
            {F(isAr ? 'العنوان (عربي)' : 'Title (Arabic)', form.title_ar, v => setForm({...form, title_ar: v}), { dir: 'rtl' })}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (English)</label>
              <RichTextEditor value={form.content_en} onChange={v => setForm({...form, content_en: v})} placeholder="Write article content..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'المحتوى (عربي)' : 'Content (Arabic)'}</label>
              <RichTextEditor value={form.content_ar} onChange={v => setForm({...form, content_ar: v})} dir="rtl" placeholder="اكتب محتوى المقال..." />
            </div>
            {F('Excerpt (EN)', form.excerpt_en, v => setForm({...form, excerpt_en: v}))}
            {F(isAr ? 'المقتطف (عربي)' : 'Excerpt (AR)', form.excerpt_ar, v => setForm({...form, excerpt_ar: v}), { dir: 'rtl' })}
            {F('SEO Title', form.seo_title, v => setForm({...form, seo_title: v}))}
            {F('SEO Description', form.seo_description, v => setForm({...form, seo_description: v}))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'الصورة' : 'Image'}</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <p className="text-xs text-gray-400 mt-1">{isAr ? 'سيتم ضغط الصورة تلقائياً' : 'Image will be auto-compressed'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{isAr ? 'التصنيف' : 'Category'}</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none capitalize">
                <option value="">{isAr ? 'بدون تصنيف' : 'No Category'}</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="w-5 h-5 text-gold rounded" />
                <span className="text-sm font-medium text-gray-700">{isAr ? 'منشور' : 'Published'}</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50">{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all">{isAr ? 'إلغاء' : 'Cancel'}</button>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilterCategory(c)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filterCategory === c ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            {c === 'all' ? (isAr ? 'الكل' : 'All') : c}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">{isAr ? 'لا توجد مقالات' : 'No articles yet'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 text-left rtl:text-right text-xs text-gray-500 uppercase">
                <th className="px-6 py-4 font-medium">{isAr ? 'المقال' : 'Article'}</th>
                <th className="px-6 py-4 font-medium">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-4 font-medium">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="px-6 py-4 font-medium">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {posts.filter(p => filterCategory === 'all' || p.category === filterCategory).map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4"><div className="flex items-center gap-3">
                      {post.image_url && <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0"><Image src={post.image_url} alt="" fill className="object-cover" /></div>}
                      <span className="font-medium text-gray-900 text-sm">{isAr ? post.title_ar : post.title_en}</span>
                    </div></td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block w-fit ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{post.published ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}</span>
                        {post.category && <span className="px-2 py-0.5 rounded text-xs text-gray-500 bg-gray-50 capitalize inline-block w-fit">{post.category}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2">
                      <button onClick={() => openEdit(post)} className="p-2 text-gray-400 hover:text-gold rounded-lg hover:bg-gold/5 transition-all"><HiPencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"><HiTrash className="w-4 h-4" /></button>
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
