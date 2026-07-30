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
  HiUsers,
  HiEye,
  HiInbox,
  HiArrowRight,
  HiArrowLeft,
  HiChatAlt2,
  HiPhone,
} from 'react-icons/hi';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import type { Inquiry, AnalyticsData } from '@/lib/content/types';

interface DashboardData {
  projectCount: number;
  blogCount: number;
  faqCount: number;
  inquiries: Inquiry[];
  analytics: AnalyticsData | null;
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
        const [projects, posts, faq, inquiriesRes, analyticsRes] = await Promise.all([
          fetch('/api/public/projects').then((r) => (r.ok ? r.json() : [])),
          fetch('/api/public/blog?all=true').then((r) => (r.ok ? r.json() : [])),
          fetch('/api/public/faq').then((r) => (r.ok ? r.json() : [])),
          fetch('/api/admin/inquiries').then((r) => (r.ok ? r.json() : [])),
          fetch('/api/admin/analytics').then((r) => (r.ok ? r.json() : null)),
        ]);
        if (cancelled) return;

        setData({
          projectCount: Array.isArray(projects) ? projects.length : 0,
          blogCount: Array.isArray(posts) ? posts.length : 0,
          faqCount: Array.isArray(faq) ? faq.length : 0,
          inquiries: Array.isArray(inquiriesRes) ? inquiriesRes : [],
          analytics: analyticsRes,
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
        <p className="text-center text-gray-400 p-12">Failed to load dashboard data</p>
      </AdminLayout>
    );

  const newInquiries = data.inquiries.filter((i) => i.status === 'new');
  const recentInquiries = data.inquiries.slice(0, 5);

  const stats = [
    {
      label: isAr ? 'زوار اليوم' : "Today's Visitors",
      value: data.analytics?.todayVisits ?? 0,
      icon: HiEye,
      color: 'bg-emerald-600',
      badge: isAr ? 'مباشر' : 'Live',
    },
    {
      label: isAr ? 'إجمالي الزوار' : 'Total Visitors',
      value: data.analytics?.totalVisits ?? 0,
      icon: HiUsers,
      color: 'bg-blue-600',
    },
    {
      label: isAr ? 'طلبات التواصل الجديدة' : 'New Inquiries',
      value: newInquiries.length,
      icon: HiInbox,
      color: newInquiries.length > 0 ? 'bg-amber-500' : 'bg-gray-600',
      href: `/${locale}/admin/inquiries`,
      highlight: newInquiries.length > 0,
    },
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
    { label: isAr ? 'طلبات التواصل' : 'Inquiries', icon: HiInbox, href: `/${locale}/admin/inquiries` },
    { label: isAr ? 'الصفحة الرئيسية' : 'Homepage', icon: HiTemplate, href: `/${locale}/admin/homepage` },
    { label: isAr ? 'الإعدادات' : 'Settings', icon: HiCog, href: `/${locale}/admin/settings` },
    { label: isAr ? 'تحسين محركات البحث' : 'SEO', icon: HiGlobe, href: `/${locale}/admin/seo` },
    { label: isAr ? 'الوسائط' : 'Media', icon: HiPhotograph, href: `/${locale}/admin/media` },
  ];

  const formatPhoneForWhatsapp = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('01')) clean = '2' + clean;
    return clean;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isAr ? 'لوحة التحكم والإحصائيات' : 'Dashboard & Analytics'}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAr ? 'متابعة أداء الموقع، عدد الزوار، وطلبات العملاء بشكل مباشر' : 'Live overview of website performance, visitors, and customer inquiries'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => {
            const CardContent = (
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-black/5`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.badge && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                    {stat.badge}
                  </span>
                )}
              </div>
            );

            return stat.href ? (
              <Link
                key={i}
                href={stat.href}
                className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border ${
                  stat.highlight ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-gray-100'
                } group`}
              >
                {CardContent}
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center justify-between">
                  <span>{stat.label}</span>
                  {isAr ? (
                    <HiArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <HiArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                  )}
                </p>
              </Link>
            ) : (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {CardContent}
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Inquiries Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isAr ? 'أحدث طلبات التواصل والعملاء' : 'Recent Inquiries & Leads'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isAr ? 'آخر العملاء الذين تواصلوا عبر استمارة الموقع' : 'Latest customer inquiries submitted from the website'}
              </p>
            </div>

            <Link
              href={`/${locale}/admin/inquiries`}
              className="text-sm font-semibold text-gold hover:text-gold-light flex items-center gap-1.5 transition-colors"
            >
              <span>{isAr ? 'عرض الكل' : 'View All'}</span>
              {isAr ? <HiArrowLeft className="w-4 h-4" /> : <HiArrowRight className="w-4 h-4" />}
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-xl text-gray-400 text-sm">
              {isAr ? 'لا توجد طلبات تواصل حتى الآن.' : 'No contact inquiries yet.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-sm">
                      {inq.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{inq.name}</p>
                        {inq.status === 'new' && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {isAr ? 'جديد' : 'New'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{inq.email || inq.phone || '—'}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 max-w-sm line-clamp-1">
                    {inq.message || (isAr ? '(بدون رسالة)' : '(No message)')}
                  </p>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {inq.phone && (
                      <a
                        href={`https://wa.me/${formatPhoneForWhatsapp(inq.phone)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <HiChatAlt2 className="w-4 h-4" />
                        <span>واتساب</span>
                      </a>
                    )}
                    <Link
                      href={`/${locale}/admin/inquiries`}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      {isAr ? 'التفاصيل' : 'Details'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {isAr ? 'روابط سريعة' : 'Quick Links'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
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

        {/* Info card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2 text-sm">
            {isAr ? 'كيف يعمل النظام والإشعار' : 'How tracking & notifications work'}
          </h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            {isAr
              ? 'يتم تتبع عدد زوار الموقع وحفظ بيانات استمارات التواصل تلقائياً في لوحة التحكم بشكل لحظي. بالإضافة لذلك، يمكنك تلقي إشعارات البريد الإلكتروني عبر Resend عند ضبط مفتاح API في الإعدادات.'
              : 'Website visitors and contact form leads are automatically tracked and saved in real-time. Additionally, email notifications are dispatched via Resend if your API key is configured.'}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
