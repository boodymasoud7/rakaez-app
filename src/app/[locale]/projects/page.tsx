'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionTitle from '@/components/ui/SectionTitle';
import ProjectCard from '@/components/ui/ProjectCard';
import { demoProjects } from '@/lib/demo-data';
import { useProjects } from '@/hooks/useContent';
import type { Locale } from '@/lib/content/types';

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const locale = useLocale() as Locale;
  const [filter, setFilter] = useState<string>('all');
  const { projects: sbProjects } = useProjects();
  const allProjects = sbProjects.length > 0 ? sbProjects : demoProjects;

  const filters = [
    { key: 'all', label: t('filterAll') },
    { key: 'upcoming', label: t('filterUpcoming') },
    { key: 'ongoing', label: t('filterOngoing') },
    { key: 'completed', label: t('filterCompleted') },
  ];

  const filtered = filter === 'all' ? allProjects : allProjects.filter(p => p.status === filter);

  return (
    <>
      <Header />
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <Image src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80" alt="Projects" fill className="object-cover" priority />
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
          <AnimatedSection>
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {filters.map((f) => (
                <button key={f.key} onClick={() => setFilter(f.key)} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${filter === f.key ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-600 hover:bg-primary/5 hover:text-primary border border-gray-200'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">{locale === 'ar' ? 'لا توجد مشاريع' : 'No projects found'}</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
