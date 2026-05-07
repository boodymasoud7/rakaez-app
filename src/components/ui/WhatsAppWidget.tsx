'use client';

import { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppWidget({
  phoneNumber = '201000444276',
  message = 'مرحباً، أريد الاستفسار عن مشاريعكم العقارية',
}: WhatsAppWidgetProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 flex flex-col items-end rtl:items-start gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="relative bg-white rounded-2xl shadow-xl p-4 max-w-[260px] animate-fade-in">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 rtl:right-auto rtl:left-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-3 h-3" />
          </button>
          <p className="text-sm text-gray-700 font-medium pe-4">
            👋 هل تحتاج مساعدة؟ تواصل معنا عبر الواتساب
          </p>
        </div>
      )}

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

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
