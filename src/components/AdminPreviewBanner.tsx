import 'server-only';
import Link from 'next/link';
import { headers } from 'next/headers';
import { getSession } from '@/lib/auth/session';

type Props = {
  locale: string;
};

/**
 * Shown only when:
 *   - MAINTENANCE_MODE=true
 *   - The current request has a valid admin session
 *   - The current route is NOT under /admin (the admin panel has its own UI)
 *
 * Public visitors are already redirected to /maintenance by the middleware,
 * so they never see this banner.
 */
export default async function AdminPreviewBanner({ locale }: Props) {
  if (process.env.MAINTENANCE_MODE !== 'true') return null;

  const session = await getSession();
  if (!session.email) return null;

  const h = await headers();
  const pathname = h.get('x-pathname') || '';
  if (pathname.includes('/admin')) return null;

  const isArabic = locale === 'ar';

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[100] w-[min(92vw,26rem)] -translate-x-1/2 rounded-full border border-[#C4A265]/40 bg-[#042021]/95 px-4 py-2.5 text-white shadow-2xl backdrop-blur-md"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C4A265] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C4A265]" />
        </span>

        <div className="flex-1 text-xs leading-tight sm:text-sm">
          <p className="font-semibold text-[#d4b87a]">
            {isArabic ? 'وضع المعاينة' : 'Preview Mode'}
          </p>
          <p className="text-white/60">
            {isArabic
              ? 'الزوار يرون صفحة التطوير'
              : 'Visitors see the maintenance page'}
          </p>
        </div>

        <Link
          href={`/${locale}/admin`}
          className="shrink-0 rounded-full border border-[#C4A265]/40 bg-[#C4A265]/10 px-3 py-1.5 text-xs font-medium text-[#d4b87a] transition hover:bg-[#C4A265]/20 hover:text-white sm:text-sm"
        >
          {isArabic ? 'الأدمن' : 'Admin'}
        </Link>
      </div>
    </div>
  );
}
