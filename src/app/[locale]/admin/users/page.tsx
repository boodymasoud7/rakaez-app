'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { HiShieldCheck, HiKey, HiTerminal } from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';

interface CurrentUser {
  email?: string;
  name?: string;
  role?: string;
}

export default function AdminUsersPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [me, setMe] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setMe(data?.user || null))
      .catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAr ? 'المستخدمين' : 'Admin Users'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isAr ? 'إدارة بيانات الدخول' : 'Manage admin credentials'}
        </p>
      </div>

      {me && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
            {isAr ? 'الحساب الحالي' : 'Currently signed in'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {(me.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900">{me.email}</p>
              {me.name && <p className="text-sm text-gray-500">{me.name}</p>}
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                <HiShieldCheck className="w-3.5 h-3.5" />
                {me.role || 'admin'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <HiKey className="w-5 h-5 text-gold" />
          {isAr ? 'كيف تضيف أو تعدّل مستخدم' : 'How to add or edit users'}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {isAr
            ? 'بيانات المستخدمين متخزنة في متغير البيئة ADMIN_USERS بدون قاعدة بيانات. كل مستخدم له email و passwordHash (بصيغة bcrypt) و role اختياري.'
            : 'User credentials are stored in the ADMIN_USERS env var (no database). Each entry needs email, passwordHash (bcrypt), and an optional role.'}
        </p>

        <div className="space-y-4">
          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
              <HiTerminal className="w-4 h-4 text-gold" />
              {isAr ? 'الخطوة 1: ولّد hash لكلمة المرور' : 'Step 1: Generate a password hash'}
            </h3>
            <pre className="bg-gray-900 text-gold text-xs rounded-lg p-3 overflow-x-auto">
              <code>node scripts/hash-password.mjs &quot;MyStrongPass123&quot;</code>
            </pre>
          </div>

          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-2">
              {isAr ? 'الخطوة 2: حدّث ADMIN_USERS' : 'Step 2: Update ADMIN_USERS'}
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              {isAr
                ? 'في .env.local محليًا أو في إعدادات البيئة على Vercel/Netlify'
                : 'In .env.local locally or in Vercel/Netlify environment settings'}
            </p>
            <pre className="bg-gray-900 text-white text-xs rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
              <code>{`ADMIN_USERS=[{"email":"admin@rakaez.com","passwordHash":"$2a$12$...","name":"Admin","role":"admin"}]`}</code>
            </pre>
          </div>

          <div className="border border-gray-100 rounded-xl p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-2">
              {isAr ? 'الخطوة 3: إعادة النشر' : 'Step 3: Redeploy'}
            </h3>
            <p className="text-xs text-gray-500">
              {isAr
                ? 'بعد تحديث متغير البيئة، أعد النشر على Vercel/Netlify عشان التغيير يطبق.'
                : 'After updating the env var, redeploy on Vercel/Netlify so the change takes effect.'}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
          <p className="font-semibold mb-1">
            {isAr ? '⚠ تنبيه أمني' : '⚠ Security note'}
          </p>
          <p>
            {isAr
              ? 'لا تشارك ADMIN_USERS أو SESSION_SECRET. استخدم كلمات مرور قوية (12+ حرف).'
              : 'Never share ADMIN_USERS or SESSION_SECRET. Use strong passwords (12+ chars).'}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
