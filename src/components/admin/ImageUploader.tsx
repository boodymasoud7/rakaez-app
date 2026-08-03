'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { HiCloudUpload as UploadIcon, HiTrash as TrashIcon, HiPhotograph as PhotoIcon, HiCheckCircle as CheckIcon } from 'react-icons/hi';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  description?: string;
}

export default function ImageUploader({ label, value, onChange, folder = 'pages', description }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
      alert('فشل رفع الصورة، يرجى المحاولة مرة أخرى.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">{label}</label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>

      {/* Image Preview Box */}
      <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden border border-gray-300 flex items-center justify-center group">
        {value ? (
          <>
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gold text-white font-semibold rounded-lg text-xs hover:bg-gold-light transition-all shadow-md flex items-center gap-1.5"
              >
                <UploadIcon className="w-4 h-4" />
                تغيير الصورة
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg text-xs hover:bg-red-700 transition-all shadow-md flex items-center gap-1.5"
              >
                <TrashIcon className="w-4 h-4" />
                حذف
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-6 text-gray-400 flex flex-col items-center">
            <PhotoIcon className="w-10 h-10 mb-2 opacity-50 text-gold" />
            <p className="text-xs">لم يتم اختيار صورة بعد</p>
          </div>
        )}
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 shadow-sm"
        >
          <UploadIcon className="w-5 h-5 text-gold" />
          {uploading ? 'جاري رفع الصورة...' : 'رفع صورة جديدة من جهازك'}
        </button>

        {success && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <CheckIcon className="w-4 h-4" />
            تم الرفع بنجاح!
          </span>
        )}
      </div>

      {/* Manual URL Input fallback */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-400 mb-1">أو أدخل رابط/مسار الصورة مباشرة:</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/example.jpg أو https://..."
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-gold font-mono bg-white dir-ltr text-gray-600"
        />
      </div>
    </div>
  );
}
