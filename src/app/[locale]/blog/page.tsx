'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionTitle from '@/components/ui/SectionTitle';
import BlogCard from '@/components/ui/BlogCard';
import { demoBlogPosts } from '@/lib/demo-data';
import { useBlogPosts } from '@/hooks/useContent';
import type { Locale } from '@/lib/content/types';

export default function BlogPage() {
  const t = useTranslations('blog');
  const locale = useLocale() as Locale;
  const { posts: sbPosts } = useBlogPosts();
  const allPosts = sbPosts.length > 0 ? sbPosts : demoBlogPosts.filter(p => p.published);

  return (
    <>
      <Header />
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80" alt="Blog" fill className="object-cover" priority />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="h-1 w-16 bg-gold mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{t('title')}</h1>
            <p className="text-xl text-white/70">{t('subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
