'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { HiHome, HiArrowRight, HiArrowLeft } from 'react-icons/hi';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFoundPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const Arrow = isAr ? HiArrowLeft : HiArrowRight;

  return (
    <>
      <Header />
      <section className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative mb-8">
              <span className="text-[180px] font-bold text-gray-100 select-none leading-none">404</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center">
                  <HiHome className="w-12 h-12 text-gold" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
            </h1>
            <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">
              {isAr
                ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
                : "Sorry, the page you're looking for doesn't exist or has been moved."}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-white font-semibold rounded-full hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/20 group"
              >
                <HiHome className="w-5 h-5" />
                {isAr ? 'الصفحة الرئيسية' : 'Go Home'}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-all group"
              >
                {isAr ? 'تواصل معنا' : 'Contact Us'}
                <Arrow className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}
