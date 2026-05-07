'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiOfficeBuilding, HiTrendingUp, HiCog, HiLightBulb } from 'react-icons/hi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import type { Locale } from '@/lib/content/types';
import { demoServices } from '@/lib/demo-data';
import { useServices } from '@/hooks/useContent';
import { getLocalized } from '@/lib/content/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HiOfficeBuilding, HiTrendingUp, HiCog, HiLightBulb,
};

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale() as Locale;
  const { services: sbServices } = useServices();
  const allServices = sbServices.length > 0 ? sbServices : demoServices;

  return (
    <>
      <Header />
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <Image src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80" alt="Services" fill className="object-cover" priority />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="h-1 w-16 bg-gold mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{t('title')}</h1>
            <p className="text-xl text-white/70">{t('subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {allServices.map((service, i) => {
              const Icon = iconMap[service.icon] || HiOfficeBuilding;
              return (
                <AnimatedSection key={service.id} delay={i * 0.15}>
                  <div className="bg-gray-50 rounded-2xl p-10 hover:shadow-xl transition-all duration-500 group border border-gray-100 hover:border-gold/20 h-full">
                    <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                      <Icon className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary-dark mb-4">
                      {getLocalized(service, 'title', locale)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {getLocalized(service, 'description', locale)}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
