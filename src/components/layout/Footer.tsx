'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const { get } = useSiteSettings();

  // Dynamic contact info with fallbacks
  const phone = get('phone', locale) || '17074';
  const whatsapp = get('whatsapp', locale) || '01000444276';
  const email = get('email', locale) || 'info@rakaezdevelopment.com';
  const address = get('address', locale) || (locale === 'ar' ? 'دمياط الجديدة - تقاطع شارع البشبيشي مع شارع ابوالخير' : 'New Damietta - Al-Bishbishy & Abou Al-Kheir St.');

  // Dynamic social links
  const fbLink = get('facebook', locale) || '#';
  const igLink = get('instagram', locale) || '#';
  const liLink = get('linkedin', locale) || '#';

  const navLinks = [
    { href: `/${locale}`, label: t('nav.home') },
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/projects`, label: t('nav.projects') },
    { href: `/${locale}/services`, label: t('nav.services') },
    { href: `/${locale}/blog`, label: t('nav.blog') },
    { href: `/${locale}/faq`, label: t('nav.faq') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: fbLink, label: 'Facebook' },
    { icon: FaInstagram, href: igLink, label: 'Instagram' },
    { icon: FaLinkedinIn, href: liLink, label: 'LinkedIn' },
    { icon: FaWhatsapp, href: `https://wa.me/2${whatsapp}`, label: 'WhatsApp' },
  ];

  return (
    <footer className="bg-gradient-dark text-white">
      <div className="h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16">
                <Image src="/images/logo.png" alt="Rakaez" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-gold font-bold text-lg mb-2">
              {locale === 'ar' ? 'نبني حياة' : 'Building Life'}
            </p>
            <p className="text-white/60 leading-relaxed text-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-semibold text-lg mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gold font-semibold text-lg mb-6">{t('footer.contactInfo')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <HiPhone className="w-5 h-5 text-gold flex-shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-gold transition-colors font-medium">{phone} <span className="text-white/40 font-normal">Hotline</span></a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <FaWhatsapp className="w-5 h-5 text-gold flex-shrink-0" />
                <a href={`https://wa.me/2${whatsapp}`} className="hover:text-gold transition-colors">{whatsapp}</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <HiMail className="w-5 h-5 text-gold flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold transition-colors">{email}</a>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <HiLocationMarker className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-gold font-semibold text-lg mb-6">{t('footer.followUs')}</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Rakaez Development. {t('footer.rights')}
            </p>
            <p className="text-white/40 text-sm flex items-center gap-3">
              <span className="flex items-center gap-1"><HiPhone className="w-4 h-4 text-gold" /><a href={`tel:${phone}`} className="hover:text-gold transition-colors font-medium">{phone}</a></span>
              <span className="flex items-center gap-1"><FaWhatsapp className="w-4 h-4 text-gold" /><a href={`https://wa.me/2${whatsapp}`} className="hover:text-gold transition-colors font-medium">{whatsapp}</a></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
