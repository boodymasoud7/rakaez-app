import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import AdminPreviewBanner from '@/components/AdminPreviewBanner';

const BASE_URL = process.env.SITE_URL || 'https://rakaezdevelopment.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ركائز للتطوير العقاري | Rakaez Developments',
    template: '%s | ركائز للتطوير العقاري',
  },
  description: 'شركة ركائز للتطوير العقاري (Rakaez Developments) - المطور العقاري الموثوق لأفخم المشروعات والوحدات السكنية والتجارية في بيت الوطن والمنصورة ودمياط الجديدة بأعلى معايير الجودة وأفضل أنظمة سداد.',
  keywords: [
    'ركائز',
    'ركائز للتطوير العقاري',
    'شركة ركائز',
    'Rakaez',
    'Rakaez Real Estate',
    'Rakaez Developments',
    'تطوير عقاري',
    'بيت الوطن',
    'شقق بيت الوطن',
    'عقارات دمياط الجديدة',
    'مشاريع المنصورة',
    'استثمار عقاري مصر',
    'شقق فاخرة بالتقسيط'
  ],
  authors: [{ name: 'Rakaez Developments', url: BASE_URL }],
  creator: 'Rakaez Developments',
  publisher: 'Rakaez Developments',
  openGraph: {
    type: 'website',
    siteName: 'ركائز للتطوير العقاري | Rakaez Developments',
    title: 'ركائز للتطوير العقاري | Rakaez Real Estate Development',
    description: 'المطور العقاري الموثوق لأحدث المجمعات والوحدات السكنية الفاخرة في بيت الوطن ودمياط الجديدة.',
    url: BASE_URL,
    locale: 'ar_EG',
    alternateLocale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'ركائز للتطوير العقاري - Rakaez Developments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ركائز للتطوير العقاري | Rakaez Developments',
    description: 'المطور العقاري الموثوق لأفخم المشاريع السكنية والتجارية في مصر.',
    images: [`${BASE_URL}/images/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'ar': `${BASE_URL}/ar`,
      'en': `${BASE_URL}/en`,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'RealEstateAgent'],
  name: 'ركائز للتطوير العقاري',
  alternateName: ['Rakaez Developments', 'Rakaez Real Estate', 'ركائز'],
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  image: `${BASE_URL}/images/logo.png`,
  description: 'شركة ركائز للتطوير العقاري - تطوير وتشييد المشروعات والوحدات السكنية والتجارية الفاخرة في بيت الوطن، المنصورة، ودمياط الجديدة.',
  telephone: '17074',
  email: 'info@rakaezdevelopment.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'تقاطع شارع البشبيشي مع شارع ابوالخير',
    addressLocality: 'دمياط الجديدة',
    addressRegion: 'دمياط',
    addressCountry: 'EG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 31.4398,
    longitude: 31.6664,
  },
  sameAs: [
    'https://www.facebook.com/rakaezdevelopment',
    'https://www.instagram.com/rakaez_development/',
    'https://maps.app.goo.gl/Zt6qyKMRy89wxU786',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '17074',
    contactType: 'customer service',
    areaServed: 'EG',
    availableLanguage: ['Arabic', 'English'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
