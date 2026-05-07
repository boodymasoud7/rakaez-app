import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestSession } from '@/lib/auth/session-edge';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.includes('/admin');
  const isLoginPage = pathname.includes('/admin/login');

  // For admin routes (except login), require an authenticated session.
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

  // For all other routes (including the login page) just handle i18n.
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|ar)/:path*'],
};
