'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiCalendar, HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { demoBlogPosts } from '@/lib/demo-data';
import { useBlogPostBySlug } from '@/hooks/useContent';
import type { Locale } from '@/lib/content/types';
import { getLocalized } from '@/lib/content/types';

export default function BlogDetailPage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const slug = params.slug as string;
  const { post: sbPost, loading } = useBlogPostBySlug(slug);
  const post = sbPost || demoBlogPosts.find(p => p.slug === slug) || null;
  const Arrow = locale === 'ar' ? HiArrowRight : HiArrowLeft;

  if (loading) return <><Header /><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div><Footer /></>;

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
            <Link href={`/${locale}/blog`} className="px-6 py-3 bg-primary text-white rounded-full">
              {locale === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString(
    locale === 'ar' ? 'ar-BH' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      <Header />
      <section className="relative h-[50vh] min-h-[350px] flex items-end">
        <Image src={post.image_url || ''} alt={getLocalized(post, 'title', locale)} fill className="object-cover" priority />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
              <HiCalendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{getLocalized(post, 'title', locale)}</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-secondary-dark prose-a:text-gold"
            dangerouslySetInnerHTML={{ __html: getLocalized(post, 'content', locale) }}
          />
          <div className="mt-16 pt-8 border-t border-gray-100">
            <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-primary font-semibold hover:text-gold transition-colors">
              <Arrow className="w-4 h-4" />
              {locale === 'ar' ? 'العودة للمدونة' : 'Back to Blog'}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
