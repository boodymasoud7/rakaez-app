'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { HiMail, HiLockClosed } from 'react-icons/hi';

export default function AdminLoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error ||
            (locale === 'ar'
              ? 'بريد إلكتروني أو كلمة مرور غير صحيحة'
              : 'Invalid email or password')
        );
        return;
      }

      router.push(`/${locale}/admin`);
      router.refresh();
    } catch {
      setError(locale === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="relative w-48 h-16 mx-auto mb-6">
            <Image src="/images/logo-v2.png" alt="Rakaez" fill className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {locale === 'ar' ? 'لوحة إدارة ركائز' : 'Rakaez Admin Panel'}
          </h1>
          <p className="text-white/50 text-sm">
            {locale === 'ar' ? 'سجل دخولك للمتابعة' : 'Sign in to continue'}
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <div className="relative">
                <HiMail className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-white/30" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all"
                  placeholder="admin@rakaez.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                {locale === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <HiLockClosed className="absolute top-1/2 -translate-y-1/2 left-4 rtl:left-auto rtl:right-4 w-5 h-5 text-white/30" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gold text-white font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50">
              {loading ? (locale === 'ar' ? 'جاري الدخول...' : 'Signing in...') : (locale === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
