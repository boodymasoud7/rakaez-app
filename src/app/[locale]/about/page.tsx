'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiEye, HiFlag, HiHeart, HiLightningBolt, HiStar, HiCheckCircle } from 'react-icons/hi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionTitle from '@/components/ui/SectionTitle';
import StatCounter from '@/components/ui/StatCounter';
import type { Locale } from '@/lib/content/types';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function AboutPage() {
  const t = useTranslations('about');
  const tHome = useTranslations('home');
  const locale = useLocale() as Locale;
  const { get, getNum } = useSiteSettings();

  const statProjects = getNum('stat_projects') || 23;
  const statUnits = getNum('stat_units') || 2500;
  const statClients = getNum('stat_clients') || 1800;
  const statYears = getNum('stat_years') || 6;

  const labelProjects = get('stat_projects_label', locale) || tHome('statsProjects');
  const labelUnits = get('stat_units_label', locale) || tHome('statsUnits');
  const labelClients = get('stat_clients_label', locale) || tHome('statsClients');
  const labelYears = get('stat_years_label', locale) || tHome('statsYears');

  const values = [
    { icon: HiStar, title: t('value1'), desc: t('value1Desc'), color: 'from-gold/20 to-gold/5' },
    { icon: HiHeart, title: t('value2'), desc: t('value2Desc'), color: 'from-primary/20 to-primary/5' },
    { icon: HiLightningBolt, title: t('value3'), desc: t('value3Desc'), color: 'from-gold/20 to-gold/5' },
    { icon: HiCheckCircle, title: t('value4'), desc: t('value4Desc'), color: 'from-primary/20 to-primary/5' },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative w-full min-h-[350px] sm:min-h-[450px] lg:min-h-[600px] aspect-auto sm:aspect-[2.4/1] flex items-center overflow-hidden bg-[#10141e]">
        <Image
          src="/images/about-hero-v2.png"
          alt="About Rakaez"
          fill
          unoptimized
          className="object-cover object-center"
          priority
        />
        <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-secondary-dark/80 via-transparent to-transparent" />
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-1 w-16 bg-gold mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">{t('title')}</h1>
            <p className="text-xl text-white/90 drop-shadow-md">{t('subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-gold font-semibold text-sm uppercase tracking-wider">{t('storyTitle')}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-dark mt-3 mb-6">{t('storyTitle')}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{t('story')}</p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <Image
                  src={get('about_team_image', locale) || '/images/story-team-v2.png'}
                  alt="Rakaez Team"
                  width={819}
                  height={1024}
                  className="rounded-2xl shadow-2xl w-full h-auto object-contain block"
                  unoptimized
                />
                <div className="absolute -bottom-4 -left-4 rtl:-right-4 rtl:left-auto w-full h-full border-2 border-gold/20 rounded-2xl -z-10" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection>
              <div className="bg-white rounded-2xl p-10 shadow-lg h-full border-t-4 border-gold">
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                  <HiEye className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-dark mb-4">{t('visionTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('vision')}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-2xl p-10 shadow-lg h-full border-t-4 border-primary">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <HiFlag className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-dark mb-4">{t('missionTitle')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('mission')}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle title={t('valuesTitle')} />
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center group">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <v.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-dark mb-3">{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <SectionTitle title={t('achievementsTitle')} light />
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCounter end={statProjects} suffix="+" label={labelProjects} />
            <StatCounter end={statUnits} suffix="+" label={labelUnits} />
            <StatCounter end={statClients} suffix="+" label={labelClients} />
            <StatCounter end={statYears} suffix="+" label={labelYears} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
