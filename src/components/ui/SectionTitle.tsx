'use client';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  light = false,
  center = true,
}: SectionTitleProps) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
        light ? 'text-white' : 'text-secondary-dark'
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${
          light ? 'text-white/60' : 'text-gray-500'
        }`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-6 h-1 w-20 bg-gold rounded-full ${center ? 'mx-auto' : ''}`} />
    </div>
  );
}
