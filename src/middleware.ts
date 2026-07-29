import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestSession } from '@/lib/auth/session-edge';
import { routing } from './i18n/routing';
import settingsData from '../content/settings.json';

const intlMiddleware = createMiddleware(routing);

function isMaintenanceEnabled(): boolean {
  try {
    const val = (settingsData as Record<string, Record<string, string>>)?.maintenance_mode;
    if (val) {
      if (typeof val === 'object') {
        return val.ar === 'true' || val.en === 'true';
      }
      return (val as unknown) === 'true';
    }
  } catch {
    // fallback
  }
  return process.env.MAINTENANCE_MODE === 'true';
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.includes('/admin');
  const isLoginPage = pathname.includes('/admin/login');
  const isMaintenanceRoute = pathname === '/maintenance';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // 1. Maintenance mode: when enabled via Admin Settings or ENV, rewrite public visitors
  // to /maintenance — UNLESS the visitor is a logged-in admin previewing the site.
  const isMaintenance = isMaintenanceEnabled();
  if (isMaintenance && !isAdminRoute && !isMaintenanceRoute) {
    const sessionResponse = NextResponse.next({
      request: { headers: requestHeaders },
    });
    const session = await getRequestSession(request, sessionResponse);

    if (!session.email) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.rewrite(url);
    }
  }

  // 2. Admin routes (except login) require an authenticated session.
  if (isAdminRoute && !isLoginPage) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    const session = await getRequestSession(request, response);

    if (!session.email) {
      const locale = pathname.startsWith('/en') ? 'en' : 'ar';
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }

    return response;
  }

  // 3. i18n handling
  const modifiedRequest = new NextRequest(request.url, {
    headers: requestHeaders,
    method: request.method,
  });
  return intlMiddleware(modifiedRequest);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
