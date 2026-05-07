'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { HiUpload, HiTrash, HiPhotograph, HiDocument, HiVideoCamera, HiFolder, HiRefresh } from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import { optimizeImage, formatFileSize, isImageFile, validateFile } from '@/lib/image-utils';
import { uploadFile } from '@/lib/admin-api';

interface MediaFile {
  name: string;
  path: string;
  url: string;
  size: number;
  type: string;
  modifiedAt: string | null;
}

function classifyType(name: string): string {
  const lower = name.toLowerCase();
  if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(lower)) return 'image';
  if (/\.(pdf|doc|docx|txt)$/i.test(lower)) return 'document';
  if (/\.(mp4|mov|webm|m4v)$/i.test(lower)) return 'video';
  return 'other';
}

export default function AdminMediaPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media');
      if (!res.ok) throw new Error('Failed to load');
      const data = (await res.json()) as { files: Omit<MediaFile, 'type'>[] };
      setFiles(
        (data.files || []).map((f) => ({
          ...f,
          type: classifyType(f.name),
        }))
      );
    } catch {
      setError(isAr ? 'فشل في تحميل الملفات' : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [isAr]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setError('');

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        const validationError = validateFile(file, 10);
        if (validationError) {
          setError(validationError);
          continue;
        }

        setUploadProgress(
          isAr
            ? `جاري رفع ${i + 1}/${selectedFiles.length}: ${file.name}`
            : `Uploading ${i + 1}/${selectedFiles.length}: ${file.name}`
        );

        if (isImageFile(file)) {
          const optimized = await optimizeImage(file);
          const savings = Math.round(
            (1 - optimized.optimizedSize / optimized.originalSize) * 100
          );
          setUploadProgress(
            isAr
              ? `جاري رفع ${file.name} (تم ضغط ${savings}%)`
              : `Uploading ${file.name} (compressed ${savings}%)`
          );
          await uploadFile(optimized.blob, {
            folder: 'media',
            fileName: optimized.fileName,
          });
        } else {
          await uploadFile(file, { folder: 'media' });
        }
      }

      await loadFiles();
      setUploadProgress('');
    } catch (err) {
      setError(isAr ? 'فشل في رفع الملف' : 'Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filePath: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return;

    try {
      const res = await fetch('/api/admin/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath }),
      });
      if (!res.ok) throw new Error('delete failed');
      setFiles(files.filter((f) => f.path !== filePath));
    } catch {
      setError(isAr ? 'فشل في حذف الملف' : 'Delete failed');
    }
  };

  const filtered = filter === 'all' ? files : files.filter(f => f.type === filter);
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    image: HiPhotograph, document: HiDocument, video: HiVideoCamera
  };

  const stats = [
    { label: isAr ? 'الصور' : 'Images', count: files.filter(f => f.type === 'image').length, icon: HiPhotograph, color: 'bg-blue-500' },
    { label: isAr ? 'المستندات' : 'Documents', count: files.filter(f => f.type === 'document').length, icon: HiDocument, color: 'bg-gold' },
    { label: isAr ? 'الفيديوهات' : 'Videos', count: files.filter(f => f.type === 'video').length, icon: HiVideoCamera, color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'إدارة الوسائط' : 'Media Manager'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة الصور والملفات' : 'Manage images and files'}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={loadFiles} className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all">
            <HiRefresh className="w-5 h-5" />
          </button>
          <label className={`flex items-center gap-2 px-5 py-2.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <HiUpload className="w-5 h-5" />{isAr ? 'رفع ملف' : 'Upload File'}
            <input type="file" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium">{error}</div>}
      {uploadProgress && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl font-medium flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          {uploadProgress}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}><s.icon className="w-5 h-5 text-white" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{s.count}</p><p className="text-xs text-gray-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'image', 'document', 'video'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            {f === 'all' ? (isAr ? 'الكل' : 'All') : f === 'image' ? (isAr ? 'صور' : 'Images') : f === 'document' ? (isAr ? 'مستندات' : 'Documents') : (isAr ? 'فيديو' : 'Videos')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">{isAr ? 'لا توجد ملفات' : 'No files found'}</div>
        ) : (
          <table className="w-full">
            <thead><tr className="bg-gray-50 text-left rtl:text-right text-xs text-gray-500 uppercase">
              <th className="px-6 py-4 font-medium">{isAr ? 'الملف' : 'File'}</th>
              <th className="px-6 py-4 font-medium">{isAr ? 'النوع' : 'Type'}</th>
              <th className="px-6 py-4 font-medium">{isAr ? 'الحجم' : 'Size'}</th>
              <th className="px-6 py-4 font-medium">{isAr ? 'إجراء' : 'Action'}</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(file => {
                const Icon = iconMap[file.type] || HiFolder;
                return (
                  <tr key={file.path} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">{file.name}</span>
                        {file.type === 'image' && (
                          <a href={file.url} target="_blank" rel="noreferrer" className="text-xs text-gold hover:underline">
                            {isAr ? 'معاينة' : 'Preview'}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{file.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatFileSize(file.size)}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(file.path)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
