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

  // Expose the pathname to Server Components via a request header so they
  // can conditionally render without needing useRouter/usePathname.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 1. Maintenance mode: when MAINTENANCE_MODE=true, rewrite every public
  //    visitor request to /maintenance — UNLESS the visitor is a logged-in
  //    admin, in which case we let them preview the real site so they can
  //    edit it live. The admin panel itself and the maintenance page stay
  //    reachable in every case.
  if (
    process.env.MAINTENANCE_MODE === 'true' &&
    !isAdminRoute &&
    !isMaintenanceRoute
  ) {
    const sessionResponse = NextResponse.next({
      request: { headers: requestHeaders },
    });
    const session = await getRequestSession(request, sessionResponse);

    if (!session.email) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.rewrite(url);
    }
    // Authenticated admin: fall through to i18n handling below.
  }

  // 2. Admin routes (except login) require an authenticated session.
  if (isAdminRoute && !isLoginPage) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    const session = await getRequestSession(request, response);

    if (!session.email) {
      const locale = pathname.startsWith('/ar') ? 'ar' : 'en';
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }

    return response;
  }

  // 3. Everything else: just handle i18n (with the pathname header attached).
  const modifiedRequest = new NextRequest(request.url, {
    headers: requestHeaders,
    method: request.method,
  });
  return intlMiddleware(modifiedRequest);
}

export const config = {
  // Match all paths except Next internals, API routes, and static assets.
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
