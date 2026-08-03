'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiLocationMarker, HiOfficeBuilding, HiShoppingBag, HiBriefcase, HiX, HiChevronLeft, HiChevronRight, HiZoomIn } from 'react-icons/hi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionTitle from '@/components/ui/SectionTitle';
import { demoProjects } from '@/lib/demo-data';
import { useProjectBySlug } from '@/hooks/useContent';
import type { Locale } from '@/lib/content/types';
import { getLocalized } from '@/lib/content/types';

export default function ProjectDetailPage() {
  const t = useTranslations('projects');
  const locale = useLocale() as Locale;
  const params = useParams();
  const slug = params.slug as string;
  const { project: sbProject, loading } = useProjectBySlug(slug);
  const project = sbProject || demoProjects.find(p => p.slug === slug) || null;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fallbackGallery = [
    project?.cover_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
  ];
  const galleryImages =
    project && 'gallery' in project && Array.isArray(project.gallery) && project.gallery.length > 0
      ? project.gallery.map((img) => img.url)
      : fallbackGallery;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, galleryImages.length]);

  if (loading) return <><Header /><div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div><Footer /></>;

  if (!project) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
            <p className="text-gray-500 mb-8">{locale === 'ar' ? 'المشروع غير موجود' : 'Project not found'}</p>
            <Link href={`/${locale}/projects`} className="px-6 py-3 bg-primary text-white rounded-full">
              {locale === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const unitTypes = Array.isArray(project.unit_types) ? project.unit_types : [];

  const categoryConfig = {
    residential: {
      label: locale === 'ar' ? 'سكني' : 'Residential',
      icon: HiOfficeBuilding,
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
    commercial: {
      label: locale === 'ar' ? 'تجاري' : 'Commercial',
      icon: HiShoppingBag,
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
    },
    administrative: {
      label: locale === 'ar' ? 'إداري' : 'Administrative',
      icon: HiBriefcase,
      color: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
    medical: {
      label: locale === 'ar' ? 'طبي' : 'Medical',
      icon: HiOfficeBuilding,
      color: 'from-cyan-500 to-teal-600',
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
    },
  } as const;

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative h-[75vh] min-h-[550px] flex items-end bg-slate-950 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110"
          style={{ backgroundImage: `url(${project.cover_image})` }}
        />
        <Image src={project.cover_image || ''} alt={getLocalized(project, 'name', locale)} fill className="object-contain relative z-10 p-4 object-bottom" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d14] via-[#090d14]/40 to-black/20 z-20 pointer-events-none" />
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white mb-4 shadow-md ${
              project.status === 'completed' ? 'bg-emerald-600/90' : project.status === 'ongoing' ? 'bg-amber-600/90' : 'bg-primary/90'
            }`}>
              {project.status === 'completed' ? (locale === 'ar' ? 'تم التسليم' : 'Delivered') :
               project.status === 'ongoing' ? (locale === 'ar' ? 'تحت الإنشاء' : 'Under Construction') : (locale === 'ar' ? 'قريباً' : 'Upcoming')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#ffffff] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-4 leading-tight">
              {getLocalized(project, 'name', locale)}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle title={t('overview')} center={false} />
            <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">{getLocalized(project, 'description', locale)}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection><SectionTitle title={t('gallery')} /></AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div
                  onClick={() => setLightboxIndex(i)}
                  className="relative h-64 rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg">
                      <HiZoomIn className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Types */}
      {unitTypes.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection><SectionTitle title={t('unitTypes')} /></AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {unitTypes.map((unit, i) => {
                const cfg = categoryConfig[unit.category] ?? categoryConfig.residential;
                const Icon = cfg.icon;
                const hasArea = !!(unit.area_from && unit.area_to);
                const sameArea = hasArea && unit.area_from === unit.area_to;
                const areaText = hasArea
                  ? (sameArea
                      ? (locale === 'ar' ? `بمساحة ${unit.area_from} م²` : `${unit.area_from} m²`)
                      : (locale === 'ar'
                          ? `مساحات تبدأ من ${unit.area_from} م² إلى ${unit.area_to} م²`
                          : `Areas from ${unit.area_from} m² to ${unit.area_to} m²`))
                  : (locale === 'ar' ? 'وحدات متميزة بتصاميم استثمارية فاخرة' : 'Premium executive spaces with modern designs');
                return (
                  <AnimatedSection key={i} delay={i * 0.08}>
                    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cfg.color}`} />
                      <div className="p-7">
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${cfg.bg} ${cfg.text} mb-5 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-secondary-dark mb-2">{cfg.label}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{areaText}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Location Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection><SectionTitle title={t('location')} /></AnimatedSection>
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden shadow-lg h-96">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14000!2d${project.lng || 31.4932}!3d${project.lat || 30.0291}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg`}
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="w-full h-full"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 bg-gradient-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('inquiryTitle')}</h2>
            <p className="text-white/60 mb-8">{t('inquirySubtitle')}</p>
            <Link href={`/${locale}/contact`} className="inline-flex px-8 py-4 bg-gold text-white font-semibold rounded-full hover:bg-gold-light transition-all">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 select-none"
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              aria-label="Close modal"
            >
              <HiX className="w-6 h-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-6 left-6 z-50 text-white/90 font-mono text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>

            {/* Navigation controls */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null));
                  }}
                  className="absolute left-4 sm:left-8 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <HiChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : null));
                  }}
                  className="absolute right-4 sm:right-8 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <HiChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Display active image */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            >
              <Image
                src={galleryImages[lightboxIndex]}
                alt={`Gallery full ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
