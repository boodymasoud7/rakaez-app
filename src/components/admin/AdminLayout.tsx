'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { HiHome, HiOfficeBuilding, HiNewspaper, HiPhotograph, HiCog, HiQuestionMarkCircle, HiGlobe, HiLogout, HiMenu, HiX, HiTemplate, HiExternalLink } from 'react-icons/hi';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  const navItems = [
    { href: `/${locale}/admin`, label: locale === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: HiHome },
    { href: `/${locale}/admin/homepage`, label: locale === 'ar' ? 'الصفحة الرئيسية' : 'Homepage', icon: HiTemplate },
    { href: `/${locale}/admin/projects`, label: locale === 'ar' ? 'المشاريع' : 'Projects', icon: HiOfficeBuilding },
    { href: `/${locale}/admin/blog`, label: locale === 'ar' ? 'المدونة' : 'Blog', icon: HiNewspaper },
    { href: `/${locale}/admin/faq`, label: locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ', icon: HiQuestionMarkCircle },
    { href: `/${locale}/admin/media`, label: locale === 'ar' ? 'الوسائط' : 'Media', icon: HiPhotograph },
    { href: `/${locale}/admin/seo`, label: locale === 'ar' ? 'تحسين محركات البحث' : 'SEO Pages', icon: HiGlobe },
    { href: `/${locale}/admin/settings`, label: locale === 'ar' ? 'الإعدادات' : 'Settings', icon: HiCog },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}/admin`) return pathname === `/${locale}/admin`;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 ${locale === 'ar' ? 'right-0' : 'left-0'} z-50 w-64 admin-sidebar text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : (locale === 'ar' ? 'translate-x-full' : '-translate-x-full')} lg:static lg:block`}>
        <div className="p-6 border-b border-white/10">
          <Link href={`/${locale}/admin`} className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/images/logo.png" alt="Rakaez" fill className="object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-lg">{locale === 'ar' ? 'ركائز' : 'RAKAEZ'}</h1>
              <p className="text-xs text-white/50">{locale === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.href) ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-1">
          <Link href={`/${locale}`} className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white text-sm rounded-xl hover:bg-white/10 transition-all">
            <HiExternalLink className="w-5 h-5" />
            <span>{locale === 'ar' ? 'عرض الموقع' : 'View Site'}</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-red-300 hover:text-red-200 text-sm rounded-xl hover:bg-red-500/20 transition-all w-full">
            <HiLogout className="w-5 h-5" />
            <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-600">
              {sidebarOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-4">
              <Link href={`/${locale === 'en' ? 'ar' : 'en'}/admin`} className="text-sm text-gray-500 hover:text-primary transition-colors">
                {locale === 'en' ? 'العربية' : 'English'}
              </Link>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">A</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
