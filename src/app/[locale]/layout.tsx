import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import AdminPreviewBanner from '@/components/AdminPreviewBanner';

export const metadata: Metadata = {
  title: 'Rakaez Real Estate Development | ركائز للتطوير العقاري',
  description: 'Premium real estate development in Egypt. Luxury properties, villas, and apartments in New Cairo, 6th of October, and the New Administrative Capital.',
  keywords: ['real estate', 'Egypt', 'luxury properties', 'عقارات', 'مصر', 'ركائز', 'شقق فاخرة', 'فلل'],
  openGraph: {
    type: 'website',
    siteName: 'Rakaez Real Estate',
    title: 'Rakaez Real Estate Development | ركائز للتطوير العقاري',
    description: 'Premium real estate development in Egypt. Luxury properties and developments.',
    url: 'https://rakaez.com',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rakaez Real Estate Development',
    description: 'Premium real estate development in Egypt',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://rakaez.com',
    languages: { 'en': '/en', 'ar': '/ar' },
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${locale === 'ar' ? 'font-tajawal' : 'font-inter'} antialiased`}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <WhatsAppWidget />
          <AdminPreviewBanner locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
