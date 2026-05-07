import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coming Soon — Rakaez Real Estate Development | قريباً — ركائز للتطوير العقاري',
  description: 'Our website is under development. Stay tuned for the launch.',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden text-white"
      style={{
        background:
          'radial-gradient(circle at 20% 0%, #0a4a4d 0%, #042021 50%, #021011 100%)',
      }}
    >
      {/* Decorative blurred orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #C4A265 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #C4A265 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-between px-6 py-10 text-center">
        {/* Top spacer */}
        <div />

        {/* Center content */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 animate-float">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full opacity-60 blur-2xl"
              style={{ background: 'radial-gradient(circle, #C4A265 0%, transparent 70%)' }}
            />
            <Image
              src="/images/logo.png"
              alt="Rakaez Real Estate"
              fill
              className="relative z-10 object-contain drop-shadow-[0_0_25px_rgba(196,162,101,0.4)]"
              priority
            />
          </div>

          <div
            className="inline-flex items-center gap-3 rounded-full border border-[#C4A265]/30 bg-[#C4A265]/5 px-5 py-2 text-sm tracking-widest backdrop-blur-sm"
            style={{ color: '#d4b87a' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C4A265] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C4A265]" />
            </span>
            COMING SOON · قريباً
          </div>

          {/* Arabic block */}
          <div
            dir="rtl"
            lang="ar"
            className="space-y-4"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          >
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              موقعنا تحت{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #C4A265 0%, #d4b87a 100%)',
                }}
              >
                التطوير
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              نعمل بكامل طاقتنا لتقديم تجربة مميزة. تابعونا قريباً لاكتشاف
              مشاريعنا العقارية المتميزة.
            </p>
          </div>

          <div
            aria-hidden
            className="flex w-32 items-center justify-center gap-1.5"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#C4A265] opacity-90"
              style={{ animation: 'mw-bounce 1.4s infinite ease-in-out 0s' }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#C4A265] opacity-70"
              style={{ animation: 'mw-bounce 1.4s infinite ease-in-out 0.16s' }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#C4A265] opacity-50"
              style={{ animation: 'mw-bounce 1.4s infinite ease-in-out 0.32s' }}
            />
          </div>

          {/* English block */}
          <div lang="en" className="space-y-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Our website is{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #C4A265 0%, #d4b87a 100%)',
                }}
              >
                under development
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
              We&apos;re crafting something special. Check back soon for premium
              real estate developments by Rakaez.
            </p>
          </div>

          {/* Contact pills */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href="tel:17074"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80 backdrop-blur-sm transition hover:border-[#C4A265]/50 hover:bg-[#C4A265]/10 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-[#C4A265]"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              17074
            </a>
            <a
              href="mailto:info@rakaezdevelopment.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/80 backdrop-blur-sm transition hover:border-[#C4A265]/50 hover:bg-[#C4A265]/10 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-[#C4A265]"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              info@rakaezdevelopment.com
            </a>
          </div>
        </div>

        {/* Footer credit */}
        <footer className="mt-10 flex flex-col items-center gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Rakaez Real Estate Development</p>
          <p className="flex items-center gap-1.5">
            <span>Developed by</span>
            <a
              href="http://codaweb.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-semibold tracking-wide text-[#C4A265] transition hover:text-[#d4b87a]"
            >
              Coda
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes mw-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
