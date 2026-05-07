'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { HiCalendar, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import type { BlogPost, Locale } from '@/lib/content/types';
import { getLocalized } from '@/lib/content/types';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const locale = useLocale() as Locale;
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? HiArrowLeft : HiArrowRight;

  const date = new Date(post.created_at).toLocaleDateString(
    locale === 'ar' ? 'ar-BH' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/${locale}/blog/${post.slug}`}>
        <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={post.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
              alt={getLocalized(post, 'title', locale)}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
              <HiCalendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <h3 className="text-lg font-bold text-secondary-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {getLocalized(post, 'title', locale)}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {getLocalized(post, 'excerpt', locale)}
            </p>
            <div className="flex items-center gap-2 text-gold font-semibold text-sm group-hover:gap-3 transition-all">
              <span>{locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span>
              <Arrow className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
