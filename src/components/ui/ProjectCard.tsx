'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import type { Project, Locale } from '@/lib/content/types';
import { getLocalized } from '@/lib/content/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const locale = useLocale() as Locale;
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? HiArrowLeft : HiArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/${locale}/projects/${project.slug}`}>
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
          {/* Image */}
          <div className="relative h-64 overflow-hidden flex-shrink-0">
            <Image
              src={project.cover_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'}
              alt={getLocalized(project, 'name', locale)}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
              <span className={`px-3.5 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md shadow-md ${
                project.status === 'completed' ? 'bg-emerald-600/90' :
                project.status === 'ongoing' ? 'bg-amber-600/90' : 'bg-primary/90'
              }`}>
                {project.status === 'completed' ? (locale === 'ar' ? 'تم التسليم' : 'Delivered') :
                 project.status === 'ongoing' ? (locale === 'ar' ? 'تحت الإنشاء' : 'Under Construction') :
                 (locale === 'ar' ? 'قريباً' : 'Upcoming')}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="text-xl font-bold text-secondary-dark mb-3 group-hover:text-primary transition-colors">
                {getLocalized(project, 'name', locale)}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                {getLocalized(project, 'description', locale)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-gold font-semibold text-sm group-hover:gap-3 transition-all pt-2 border-t border-gray-100">
              <span>{locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
              <Arrow className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
