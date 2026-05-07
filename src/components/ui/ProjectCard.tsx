'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
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
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <Image
              src={project.cover_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'}
              alt={getLocalized(project, 'name', locale)}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-md ${
                project.status === 'completed' ? 'bg-green-500/80' :
                project.status === 'ongoing' ? 'bg-gold/80' : 'bg-primary/80'
              }`}>
                {project.status === 'completed' ? (locale === 'ar' ? 'مكتمل' : 'Completed') :
                 project.status === 'ongoing' ? (locale === 'ar' ? 'قيد التنفيذ' : 'Ongoing') :
                 (locale === 'ar' ? 'قادم' : 'Upcoming')}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-secondary-dark mb-2 group-hover:text-primary transition-colors">
              {getLocalized(project, 'name', locale)}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
              <HiLocationMarker className="w-4 h-4 text-gold" />
              <span>{getLocalized(project, 'location', locale)}</span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {getLocalized(project, 'description', locale)}
            </p>
            <div className="flex items-center gap-2 text-gold font-semibold text-sm group-hover:gap-3 transition-all">
              <span>{locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
              <Arrow className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
