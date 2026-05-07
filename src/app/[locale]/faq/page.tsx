'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionTitle from '@/components/ui/SectionTitle';
import { demoFaqItems } from '@/lib/demo-data';
import { useFaqItems } from '@/hooks/useContent';
import type { Locale } from '@/lib/content/types';
import { getLocalized } from '@/lib/content/types';

function FaqAccordion({ item, locale }: { item: typeof demoFaqItems[0]; locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-gold/30 transition-colors">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-6 text-start gap-4">
        <h3 className="text-lg font-semibold text-secondary-dark">{getLocalized(item, 'question', locale)}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <HiChevronDown className="w-5 h-5 text-gold flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              {getLocalized(item, 'answer', locale)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const t = useTranslations('faq');
  const locale = useLocale() as Locale;
  const { items: sbItems } = useFaqItems();
  const allItems = sbItems.length > 0 ? sbItems : demoFaqItems;

  return (
    <>
      <Header />
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <Image src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1920&q=80" alt="FAQ" fill className="object-cover" priority />
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {allItems.sort((a, b) => a.sort_order - b.sort_order).map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 0.1}>
                <FaqAccordion item={item} locale={locale} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
