import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestSession } from '@/lib/auth/session-edge';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.includes('/admin');
  const isLoginPage = pathname.includes('/admin/login');
  const isMaintenanceRoute = pathname === '/maintenance';

  // 1. Maintenance mode: when MAINTENANCE_MODE=true, rewrite every public
  //    visitor request to /maintenance. The admin panel and the maintenance
  //    page itself stay reachable so the team can keep working on content.
  if (
    process.env.MAINTENANCE_MODE === 'true' &&
    !isAdminRoute &&
    !isMaintenanceRoute
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/maintenance';
    return NextResponse.rewrite(url);
  }

  // 2. Admin routes (except login) require an authenticated session.
  if (isAdminRoute && !isLoginPage) {
    const response = NextResponse.next({ request });
    const session = await getRequestSession(request, response);

    if (!session.email) {
      const locale = pathname.startsWith('/ar') ? 'ar' : 'en';
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }

    return response;
  }

  // 3. Everything else: just handle i18n.
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except Next internals, API routes, and static assets.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
