'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  HiOfficeBuilding,
  HiNewspaper,
  HiQuestionMarkCircle,
  HiTemplate,
  HiCog,
  HiGlobe,
  HiPhotograph,
} from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';

interface DashboardData {
  projectCount: number;
  blogCount: number;
  faqCount: number;
}

export default function AdminDashboard() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [projects, posts, faq] = await Promise.all([
          fetch('/api/public/projects').then((r) => (r.ok ? r.json() : [])),
          fetch('/api/public/blog?all=true').then((r) => (r.ok ? r.json() : [])),
          fetch('/api/public/faq').then((r) => (r.ok ? r.json() : [])),
        ]);
        if (cancelled) return;
        setData({
          projectCount: Array.isArray(projects) ? projects.length : 0,
          blogCount: Array.isArray(posts) ? posts.length : 0,
          faqCount: Array.isArray(faq) ? faq.length : 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <AdminLayout><AdminLoadingSkeleton /></AdminLayout>;
  if (!data)
    return (
      <AdminLayout>
        <p className="text-center text-gray-400 p-12">Failed to load</p>
      </AdminLayout>
    );

  const stats = [
    {
      label: isAr ? 'المشاريع' : 'Projects',
      value: data.projectCount,
      icon: HiOfficeBuilding,
      color: 'bg-primary',
      href: `/${locale}/admin/projects`,
    },
    {
      label: isAr ? 'المقالات' : 'Blog Posts',
      value: data.blogCount,
      icon: HiNewspaper,
      color: 'bg-gold',
      href: `/${locale}/admin/blog`,
    },
    {
      label: isAr ? 'الأسئلة الشائعة' : 'FAQ Items',
      value: data.faqCount,
      icon: HiQuestionMarkCircle,
      color: 'bg-indigo-500',
      href: `/${locale}/admin/faq`,
    },
  ];

  const quickLinks = [
    { label: isAr ? 'الصفحة الرئيسية' : 'Homepage', icon: HiTemplate, href: `/${locale}/admin/homepage` },
    { label: isAr ? 'الإعدادات' : 'Settings', icon: HiCog, href: `/${locale}/admin/settings` },
    { label: isAr ? 'تحسين محركات البحث' : 'SEO', icon: HiGlobe, href: `/${locale}/admin/seo` },
    { label: isAr ? 'الوسائط' : 'Media', icon: HiPhotograph, href: `/${locale}/admin/media` },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'لوحة التحكم' : 'Dashboard'}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isAr ? 'نظرة عامة على المحتوى' : 'Content overview'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {isAr ? 'روابط سريعة' : 'Quick Links'}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-gold/40 hover:bg-gold/5 transition-all group"
            >
              <link.icon className="w-5 h-5 text-gold" />
              <span className="font-medium text-gray-700 group-hover:text-gold text-sm">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-blue-900 mb-2 text-sm">
          {isAr ? 'كيف يعمل النظام' : 'How this works'}
        </h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          {isAr
            ? 'كل تعديل تعمله بيتسجل كـ commit على GitHub. لو الموقع شغال على Vercel/Netlify، التعديل بيظهر بعد ~30 ثانية لما الـ deploy يخلص. رسائل التواصل من الموقع بتوصل على إيميلك مباشرة عبر Resend.'
            : 'Every change is committed to GitHub. If the site is hosted on Vercel/Netlify, the change appears within ~30 seconds once the redeploy finishes. Contact form messages are delivered to your email directly via Resend.'}
        </p>
      </div>
    </AdminLayout>
  );
}
