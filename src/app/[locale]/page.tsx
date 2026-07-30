'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiArrowRight, HiArrowLeft, HiPhone, HiShieldCheck, HiLocationMarker, HiTrendingUp, HiStar } from 'react-icons/hi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/layout/LoadingScreen';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionTitle from '@/components/ui/SectionTitle';
import StatCounter from '@/components/ui/StatCounter';
import ProjectCard from '@/components/ui/ProjectCard';
import BlogCard from '@/components/ui/BlogCard';
import { demoProjects, demoBlogPosts } from '@/lib/demo-data';
import { useFeaturedProjects, useBlogPosts } from '@/hooks/useContent';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import type { Locale } from '@/lib/content/types';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const isRTL = locale === 'ar';
  const Arrow = isRTL ? HiArrowLeft : HiArrowRight;

  const { projects: sbProjects } = useFeaturedProjects();
  const { posts: sbPosts } = useBlogPosts();
  const { get, getNum } = useSiteSettings();
  const featuredProjects = sbProjects.length > 0 ? sbProjects : demoProjects.filter(p => p.featured);
  const latestPosts = (sbPosts.length > 0 ? sbPosts : demoBlogPosts).slice(0, 3);

  // Dynamic content with fallback to translations
  const heroTitle = get('hero_title', locale) || t('home.heroTitle');
  const heroSubtitle = get('hero_subtitle', locale) || t('home.heroSubtitle');
  const aboutPreview = get('about_preview', locale) || t('home.aboutPreview');
  const aboutHeading = get('about_heading', locale) || (locale === 'ar' ? 'نبني مجتمعات تدوم' : 'Building Communities That Last');

  // Dynamic stats with fallback
  const statProjects = getNum('stat_projects') || 15;
  const statUnits = getNum('stat_units') || 2500;
  const statClients = getNum('stat_clients') || 1800;
  const statYears = getNum('stat_years') || 12;

  const labelProjects = get('stat_projects_label', locale) || t('home.statsProjects');
  const labelUnits = get('stat_units_label', locale) || t('home.statsUnits');
  const labelClients = get('stat_clients_label', locale) || t('home.statsClients');
  const labelYears = get('stat_years_label', locale) || t('home.statsYears');

  // Dynamic Why Choose Us cards
  const why1Title = get('why1_title', locale) || t('home.why1Title');
  const why1Desc = get('why1_desc', locale) || t('home.why1Desc');
  const why2Title = get('why2_title', locale) || t('home.why2Title');
  const why2Desc = get('why2_desc', locale) || t('home.why2Desc');
  const why3Title = get('why3_title', locale) || t('home.why3Title');
  const why3Desc = get('why3_desc', locale) || t('home.why3Desc');
  const why4Title = get('why4_title', locale) || t('home.why4Title');
  const why4Desc = get('why4_desc', locale) || t('home.why4Desc');

  const whyCards = [
    { icon: HiStar, title: why1Title, desc: why1Desc },
    { icon: HiLocationMarker, title: why2Title, desc: why2Desc },
    { icon: HiShieldCheck, title: why3Title, desc: why3Desc },
    { icon: HiTrendingUp, title: why4Title, desc: why4Desc },
  ];

  // Dynamic contact info
  const phoneNum = get('phone', locale) || '17074';
  const whatsappNum = get('whatsapp', locale) || '01000444276';

  return (
    <>
      <LoadingScreen />
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative h-screen min-h-[700px] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 2.5 }}
              className="h-1 bg-gold mb-8"
            />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {heroTitle}
            </h1>
            <p className="text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-white font-semibold rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:shadow-gold/20 group"
              >
                {t('nav.exploreProjects')}
                <Arrow className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                {t('nav.bookConsultation')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-1.5 bg-gold rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction={isRTL ? 'right' : 'left'}>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                  alt="About Rakaez"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 rtl:-left-6 rtl:right-auto w-40 h-40 bg-gold/10 rounded-2xl -z-10" />
              </div>
            </AnimatedSection>
            <AnimatedSection direction={isRTL ? 'left' : 'right'} delay={0.2}>
              <span className="text-gold font-semibold text-sm uppercase tracking-wider">{t('home.aboutPreviewTitle')}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark mt-3 mb-6">
                {aboutHeading}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {aboutPreview}
              </p>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all group"
              >
                {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                <Arrow className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle title={t('home.featuredTitle')} subtitle={t('home.featuredSubtitle')} />
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300"
            >
              {t('home.viewAll')}
              <Arrow className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-24 bg-gradient-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle title={t('home.whyTitle')} subtitle={t('home.whySubtitle')} light />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {whyCards.map((card, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="glass rounded-2xl p-8 lg:p-10 text-center hover:bg-white/10 transition-all duration-300 group h-full flex flex-col items-center justify-start min-h-[280px]">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gold/10 rounded-2xl flex items-center justify-center group-hover:bg-gold/20 transition-colors flex-shrink-0">
                    <card.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-4 leading-tight">{card.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed flex-grow">{card.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCounter end={statProjects} suffix="+" label={labelProjects} />
            <StatCounter end={statUnits} suffix="+" label={labelUnits} />
            <StatCounter end={statClients} suffix="+" label={labelClients} />
            <StatCounter end={statYears} suffix="+" label={labelYears} />
          </div>
        </div>
      </section>

      {/* ===== CONSULTATION ===== */}
      <section className="py-24 relative">
        <Image
          src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=60"
          alt="Consultation"
          fill
          className="object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('home.consultTitle')}</h2>
            <p className="text-white/70 text-lg mb-10">{t('home.consultSubtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-white font-semibold rounded-full hover:bg-gold-light transition-all"
              >
                {t('nav.bookConsultation')}
              </Link>
              <a
                href={`tel:${phoneNum}`}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                <HiPhone className="w-5 h-5" />
                {phoneNum}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== LATEST BLOG ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle title={t('home.latestBlogTitle')} subtitle={t('home.latestBlogSubtitle')} />
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
