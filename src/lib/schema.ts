import type { Locale } from '@/lib/content/types';

// Organization schema
export function getOrganizationSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale === 'ar' ? 'ركائز للتطوير العقاري' : 'Rakaez Real Estate Development',
    url: 'https://rakaez.com',
    logo: 'https://rakaez.com/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '17074',
      contactType: 'customer service',
      availableLanguage: ['English', 'Arabic'],
    },
    sameAs: [],
  };
}

// Real Estate Listing schema
export function getRealEstateSchema(project: {
  name: string;
  description: string;
  location: string;
  image: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.name,
    description: project.description,
    url: project.url,
    image: project.image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: project.location,
      addressCountry: 'BH',
    },
  };
}

// Blog posting schema
export function getBlogPostSchema(post: {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    url: post.url,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@type': 'Organization',
      name: 'Rakaez Real Estate Development',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rakaez Real Estate Development',
      logo: { '@type': 'ImageObject', url: 'https://rakaez.com/images/logo.png' },
    },
  };
}

// FAQ Page schema
export function getFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
