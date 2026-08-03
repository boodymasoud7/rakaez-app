'use client';

import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppWidget({
  phoneNumber = '201000444276',
  message = 'مرحباً، أريد الاستفسار عن مشاريعكم العقارية',
}: WhatsAppWidgetProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-7 h-7 text-white" />
      </a>
    </div>
  );
}
