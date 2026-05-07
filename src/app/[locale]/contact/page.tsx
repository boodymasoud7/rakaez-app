'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedSection from '@/components/ui/AnimatedSection';
import type { Locale } from '@/lib/content/types';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale() as Locale;
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const { get } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string || '',
      message: fd.get('message') as string,
      type: 'contact',
    };
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Notify failed');
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
    }
  };

  // Dynamic from admin
  const phone = get('phone', locale) || '17074';
  const whatsapp = get('whatsapp', locale) || '01000444276';
  const email = get('email', locale) || 'info@rakaezdevelopment.com';
  const address = get('address', locale) || (locale === 'ar' ? 'دمياط الجديدة - تقاطع شارع البشبيشي مع شارع ابوالخير' : 'New Damietta - Al-Bishbishy & Abou Al-Kheir St.');

  const contactInfo = [
    { icon: HiPhone, label: locale === 'ar' ? 'الخط الساخن' : 'Hotline', value: phone, href: `tel:${phone}` },
    { icon: FaWhatsapp, label: locale === 'ar' ? 'واتساب' : 'WhatsApp', value: whatsapp, href: `https://wa.me/2${whatsapp}` },
    { icon: HiMail, label: t('emailLabel'), value: email, href: `mailto:${email}` },
    { icon: HiLocationMarker, label: t('addressLabel'), value: address, href: '#' },
  ];

  const socials = [
    { icon: FaFacebookF, href: get('facebook', locale) || '#', label: 'Facebook' },
    { icon: FaInstagram, href: get('instagram', locale) || '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: get('linkedin', locale) || '#', label: 'LinkedIn' },
    { icon: FaWhatsapp, href: `https://wa.me/2${whatsapp}`, label: 'WhatsApp' },
  ];

  return (
    <>
      <Header />
      <section className="relative h-[50vh] min-h-[350px] flex items-center">
        <Image src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80" alt="Contact" fill className="object-cover" priority />
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
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Form */}
            <AnimatedSection className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-secondary-dark mb-8">{t('formTitle')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('name')}</label>
                    <input type="text" name="name" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')}</label>
                    <input type="email" name="email" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
                  <input type="tel" name="phone" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('message')}</label>
                  <textarea rows={5} name="message" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all resize-none" />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gold text-white font-semibold rounded-full hover:bg-gold-light transition-all disabled:opacity-50"
                >
                  {status === 'sending' ? t('sending') : t('send')}
                </button>
                {status === 'success' && <p className="text-green-600 font-medium">{t('success')}</p>}
                {status === 'error' && <p className="text-red-600 font-medium">{t('error')}</p>}
              </form>
            </AnimatedSection>

            {/* Info Sidebar */}
            <AnimatedSection className="lg:col-span-2" delay={0.2}>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="space-y-6 mb-10">
                  {contactInfo.map((item, i) => (
                    <a key={i} href={item.href} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                        <item.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">{item.label}</p>
                        <p className="font-semibold text-secondary-dark group-hover:text-gold transition-colors">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-dark mb-4">{t('followUs')}</h3>
                  <div className="flex gap-3">
                    {socials.map((s) => (
                      <a key={s.label} href={s.href} aria-label={s.label} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gold hover:border-gold/50 transition-all">
                        <s.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d57600!2d31.4932!3d30.0291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg"
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="w-full h-full"
        />
      </section>

      <Footer />
    </>
  );
}
