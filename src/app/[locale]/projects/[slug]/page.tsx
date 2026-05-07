'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiCheckCircle } from 'react-icons/hi';
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

  const fallbackGallery = [
    project.cover_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
  ];
  const galleryImages =
    'gallery' in project && Array.isArray(project.gallery) && project.gallery.length > 0
      ? project.gallery.map((img) => img.url)
      : fallbackGallery;

  const demoUnits = [
    { name: locale === 'ar' ? 'استوديو' : 'Studio', beds: 0, area: '45 sqm', price: 'EGP 850,000' },
    { name: locale === 'ar' ? 'غرفة واحدة' : '1 Bedroom', beds: 1, area: '75 sqm', price: 'EGP 1,500,000' },
    { name: locale === 'ar' ? 'غرفتين' : '2 Bedrooms', beds: 2, area: '120 sqm', price: 'EGP 2,400,000' },
    { name: locale === 'ar' ? 'ثلاث غرف' : '3 Bedrooms', beds: 3, area: '180 sqm', price: 'EGP 3,500,000' },
  ];

  const demoAmenities = [
    locale === 'ar' ? 'مسبح إنفينيتي' : 'Infinity Pool',
    locale === 'ar' ? 'نادي صحي' : 'Fitness Center',
    locale === 'ar' ? 'أمن 24/7' : '24/7 Security',
    locale === 'ar' ? 'مواقف سيارات' : 'Covered Parking',
    locale === 'ar' ? 'حدائق' : 'Landscaped Gardens',
    locale === 'ar' ? 'ملاعب أطفال' : 'Kids Play Area',
    locale === 'ar' ? 'صالة متعددة الأغراض' : 'Multi-purpose Hall',
    locale === 'ar' ? 'منطقة شواء' : 'BBQ Area',
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-end">
        <Image src={project.cover_image || ''} alt={getLocalized(project, 'name', locale)} fill className="object-cover" priority />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-4 ${
              project.status === 'completed' ? 'bg-green-500/80' : project.status === 'ongoing' ? 'bg-gold/80' : 'bg-primary/80'
            }`}>
              {project.status === 'completed' ? (locale === 'ar' ? 'مكتمل' : 'Completed') :
               project.status === 'ongoing' ? (locale === 'ar' ? 'قيد التنفيذ' : 'Ongoing') : (locale === 'ar' ? 'قادم' : 'Upcoming')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{getLocalized(project, 'name', locale)}</h1>
            <div className="flex items-center gap-2 text-white/70 text-lg">
              <HiLocationMarker className="w-5 h-5 text-gold" />
              <span>{getLocalized(project, 'location', locale)}</span>
            </div>
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
                <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
                  <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Unit Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection><SectionTitle title={t('unitTypes')} /></AnimatedSection>
          <AnimatedSection>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-6 py-4 text-start font-semibold">{locale === 'ar' ? 'النوع' : 'Type'}</th>
                    <th className="px-6 py-4 text-start font-semibold">{t('bedrooms')}</th>
                    <th className="px-6 py-4 text-start font-semibold">{t('area')}</th>
                    <th className="px-6 py-4 text-start font-semibold">{t('price')}</th>
                  </tr>
                </thead>
                <tbody>
                  {demoUnits.map((unit, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-secondary-dark">{unit.name}</td>
                      <td className="px-6 py-4 text-gray-600">{unit.beds}</td>
                      <td className="px-6 py-4 text-gray-600">{unit.area}</td>
                      <td className="px-6 py-4 text-gold font-semibold">{unit.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection><SectionTitle title={t('amenities')} /></AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {demoAmenities.map((amenity, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <HiCheckCircle className="w-8 h-8 text-gold mx-auto mb-3" />
                  <p className="font-medium text-secondary-dark text-sm">{amenity}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-20 bg-white">
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

      <Footer />
    </>
  );
}
