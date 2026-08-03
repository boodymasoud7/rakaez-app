'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
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

      // Send business event to HeronSignal
      try {
        const { trackHeronEvent } = await import('@/components/HeronSignalProvider');
        trackHeronEvent('lead_submitted', { type: 'contact' });
      } catch {
        // ignore if analytics fails
      }

      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
    }
  };

  // Dynamic from admin settings
  const phone = get('phone', locale) || '17074';
  const whatsapp = get('whatsapp', locale) || '01000444276';
  const email = get('email', locale) || 'info@rakaezdevelopment.com';
  const address = get('address', locale) || (locale === 'ar' ? 'دمياط الجديدة - تقاطع شارع البشبيشي مع شارع ابوالخير' : 'New Damietta - Al-Bishbishy & Abou Al-Kheir St.');
  const mapLink = get('map_link', locale) || 'https://maps.app.goo.gl/Zt6qyKMRy89wxU786';
  const fbLink = get('facebook', locale) || 'https://www.facebook.com/rakaezdevelopment';
  const igLink = get('instagram', locale) || 'https://www.instagram.com/rakaez_development/';

  const contactInfo = [
    { icon: HiPhone, label: locale === 'ar' ? 'الخط الساخن' : 'Hotline', value: phone, href: `tel:${phone}` },
    { icon: FaWhatsapp, label: locale === 'ar' ? 'واتساب' : 'WhatsApp', value: whatsapp, href: `https://wa.me/2${whatsapp}` },
    { icon: HiMail, label: t('emailLabel'), value: email, href: `mailto:${email}` },
    { icon: HiLocationMarker, label: t('addressLabel'), value: address, href: mapLink },
  ];

  const socials = [
    { icon: FaFacebookF, href: fbLink, label: 'Facebook' },
    { icon: FaInstagram, href: igLink, label: 'Instagram' },
    { icon: FaWhatsapp, href: `https://wa.me/2${whatsapp}`, label: 'WhatsApp' },
  ];

  return (
    <>
      <Header />
      <section className="relative w-full min-h-[350px] sm:min-h-[450px] lg:min-h-[600px] aspect-[2.4/1] flex items-center overflow-hidden bg-[#10141e]">
        <Image src="/images/contact-hero-v1.jpg" alt="Contact Rakaez" fill unoptimized className="object-cover object-center" priority />
        <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-secondary-dark/80 via-transparent to-transparent" />
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="h-1 w-16 bg-gold mb-6" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">{t('title')}</h1>
            <p className="text-xl text-white/90 drop-shadow-md">{t('subtitle')}</p>
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
                    <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-start gap-4 group">
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
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gold hover:border-gold/50 transition-all">
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
      <section className="h-96 relative">
        <a 
          href={mapLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute inset-0 bg-primary/80 hover:bg-primary/70 transition-colors z-10 flex flex-col items-center justify-center text-white p-6 text-center group"
        >
          <HiLocationMarker className="w-12 h-12 text-gold mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-2">{locale === 'ar' ? 'موقعنا على خرائط جوجل' : 'Our Location on Google Maps'}</h3>
          <p className="text-white/80 text-sm max-w-md mb-4">{address}</p>
          <span className="px-6 py-2.5 bg-gold text-white font-semibold rounded-full group-hover:bg-gold-light transition-all shadow-lg">
            {locale === 'ar' ? 'افتح الخريطة مباشرة' : 'Open Location in Maps'}
          </span>
        </a>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d57600!2d31.4932!3d30.0291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg"
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="w-full h-full filter blur-[2px]"
        />
      </section>

      <Footer />
    </>
  );
}
