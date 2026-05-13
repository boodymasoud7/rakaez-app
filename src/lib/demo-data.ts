import type { Project, BlogPost, Service, FaqItem } from '@/lib/content/types';

// Demo projects — intentionally empty. All real projects live in
// `content/projects.json`. Keeping the export so that the pages that
// fall back on it during the brief initial-load window still compile.
export const demoProjects: Project[] = [];

// Demo blog posts
export const demoBlogPosts: BlogPost[] = [
  {
    id: '1',
    title_en: 'Egypt Real Estate Market Outlook 2024',
    title_ar: 'توقعات سوق العقارات في مصر 2024',
    slug: 'egypt-real-estate-market-outlook-2024',
    content_en: '<p>The Egyptian real estate market continues to show strong growth in 2024, driven by government initiatives, infrastructure development, and increasing foreign investment. Key areas including New Cairo, the New Administrative Capital, and the North Coast are seeing significant appreciation in property values.</p><p>The residential sector remains particularly robust, with demand for luxury apartments and villas outpacing supply. Developers like Rakaez are responding with innovative projects that combine luxury living with sustainable design principles.</p><p>Looking ahead, the market is expected to maintain its upward trajectory, supported by Egypt\'s strategic location, growing economy, and ongoing urban development efforts.</p>',
    content_ar: '<p>يواصل سوق العقارات في مصر نموه القوي في 2024، مدفوعاً بالمبادرات الحكومية وتطوير البنية التحتية وزيادة الاستثمار الأجنبي. المناطق الرئيسية بما في ذلك القاهرة الجديدة والعاصمة الإدارية الجديدة والساحل الشمالي تشهد ارتفاعاً ملحوظاً في قيم العقارات.</p><p>يظل القطاع السكني قوياً بشكل خاص، مع تجاوز الطلب على الشقق والفلل الفاخرة للعرض. المطورون مثل ركائز يستجيبون بمشاريع مبتكرة تجمع بين المعيشة الفاخرة ومبادئ التصميم المستدام.</p>',
    excerpt_en: 'The Egyptian real estate market continues to show strong growth in 2024, driven by government initiatives and increasing foreign investment.',
    excerpt_ar: 'يواصل سوق العقارات في مصر نموه القوي في 2024، مدفوعاً بالمبادرات الحكومية وزيادة الاستثمار الأجنبي.',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    seo_title: 'Egypt Real Estate Market Outlook 2024',
    seo_description: 'Analysis of Egypt real estate market trends and outlook for 2024',
    category: 'market',
    published: true,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: '2',
    title_en: 'Al Noor Residences Construction Update',
    title_ar: 'تحديث أعمال البناء في مساكن النور',
    slug: 'al-noor-residences-construction-update',
    content_en: '<p>We are pleased to announce that construction at Al Noor Residences has reached a significant milestone. The structural work is now 60% complete, and we remain on track for our projected completion date.</p><p>The project team has been working diligently to ensure that every aspect of the development meets our exacting standards. Recent achievements include the completion of the building\'s core structure and the beginning of facade installation.</p>',
    content_ar: '<p>يسعدنا أن نعلن أن أعمال البناء في مساكن النور قد بلغت مرحلة هامة. الأعمال الإنشائية مكتملة الآن بنسبة 60%، ونحن في المسار الصحيح لموعد الانتهاء المتوقع.</p><p>يعمل فريق المشروع بجد لضمان أن كل جانب من جوانب التطوير يلبي معاييرنا الدقيقة.</p>',
    excerpt_en: 'Construction at Al Noor Residences has reached a significant milestone with 60% structural completion.',
    excerpt_ar: 'بلغت أعمال البناء في مساكن النور مرحلة هامة مع اكتمال 60% من الأعمال الإنشائية.',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    seo_title: 'Al Noor Residences Construction Update',
    seo_description: 'Latest construction progress at Al Noor Residences by Rakaez',
    category: 'projects',
    published: true,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
  },
  {
    id: '3',
    title_en: 'Investing in Egypt: A Guide for International Buyers',
    title_ar: 'الاستثمار في مصر: دليل للمشترين الدوليين',
    slug: 'investing-in-egypt-guide',
    content_en: '<p>Egypt offers a compelling proposition for international real estate investors. With its strategic location, growing economy, and massive urban development projects, the country has become an increasingly attractive destination for property investment.</p><p>This comprehensive guide covers everything you need to know about buying property in Egypt, including legal requirements, financing options, and the best areas to invest.</p>',
    content_ar: '<p>تقدم مصر عرضاً مقنعاً للمستثمرين العقاريين الدوليين. بموقعها الاستراتيجي واقتصادها المتنامي ومشاريع التنمية العمرانية الضخمة، أصبحت البلاد وجهة جذابة بشكل متزايد للاستثمار العقاري.</p>',
    excerpt_en: 'Egypt offers a compelling proposition for international real estate investors with its strategic location and growing economy.',
    excerpt_ar: 'تقدم مصر عرضاً مقنعاً للمستثمرين العقاريين الدوليين بموقعها الاستراتيجي واقتصادها المتنامي.',
    image_url: 'https://images.unsplash.com/photo-1582407947092-50ce85a4ced6?w=800&q=80',
    seo_title: 'Investing in Egypt Real Estate Guide',
    seo_description: 'Complete guide to investing in Egypt real estate for international buyers',
    category: 'tips',
    published: true,
    created_at: '2024-04-10T00:00:00Z',
    updated_at: '2024-04-10T00:00:00Z',
  },
];

// Demo services
export const demoServices: Service[] = [
  {
    id: '1',
    title_en: 'Real Estate Development',
    title_ar: 'التطوير العقاري',
    description_en: 'From concept to completion, we develop premium residential and commercial properties that set new standards in quality, design, and sustainability. Our developments are crafted with meticulous attention to detail.',
    description_ar: 'من الفكرة إلى الإنجاز، نطور عقارات سكنية وتجارية فاخرة تضع معايير جديدة في الجودة والتصميم والاستدامة. مشاريعنا مصممة بعناية فائقة بكل التفاصيل.',
    icon: 'HiOfficeBuilding',
    sort_order: 1,
  },
  {
    id: '2',
    title_en: 'Investment Consultation',
    title_ar: 'الاستشارات الاستثمارية',
    description_en: 'Expert guidance to help you make informed real estate investment decisions. Our team provides comprehensive market analysis, risk assessment, and portfolio optimization strategies.',
    description_ar: 'إرشاد خبير لمساعدتك في اتخاذ قرارات استثمارية عقارية مدروسة. فريقنا يقدم تحليلاً شاملاً للسوق وتقييم المخاطر واستراتيجيات تحسين المحفظة.',
    icon: 'HiTrendingUp',
    sort_order: 2,
  },
  {
    id: '3',
    title_en: 'Property Management',
    title_ar: 'إدارة العقارات',
    description_en: 'Professional management services to maintain and enhance your property value. We handle everything from tenant relations to maintenance, ensuring your investment performs optimally.',
    description_ar: 'خدمات إدارة احترافية للحفاظ على قيمة عقارك وتعزيزها. نتولى كل شيء من العلاقات مع المستأجرين إلى الصيانة، لضمان أداء استثمارك بشكل مثالي.',
    icon: 'HiCog',
    sort_order: 3,
  },
  {
    id: '4',
    title_en: 'Real Estate Advisory',
    title_ar: 'الاستشارات العقارية',
    description_en: 'Strategic advice on market trends, opportunities, and property portfolio optimization. Our advisors provide personalized recommendations based on your investment goals.',
    description_ar: 'نصائح استراتيجية حول اتجاهات السوق والفرص وتحسين محفظتك العقارية. مستشارونا يقدمون توصيات مخصصة بناءً على أهدافك الاستثمارية.',
    icon: 'HiLightBulb',
    sort_order: 4,
  },
];

// Demo FAQ items
export const demoFaqItems: FaqItem[] = [
  {
    id: '1',
    question_en: 'Can foreigners buy property in Egypt?',
    question_ar: 'هل يمكن للأجانب شراء عقارات في مصر؟',
    answer_en: 'Yes, foreigners can purchase property in Egypt. Popular areas include New Cairo, the New Administrative Capital, 6th of October City, and the North Coast. Rakaez can guide you through the entire purchase process.',
    answer_ar: 'نعم، يمكن للأجانب شراء عقارات في مصر. تشمل المناطق الشائعة القاهرة الجديدة، العاصمة الإدارية الجديدة، مدينة 6 أكتوبر، والساحل الشمالي. يمكن لركائز إرشادك خلال عملية الشراء بأكملها.',
    sort_order: 1,
  },
  {
    id: '2',
    question_en: 'What payment plans are available?',
    question_ar: 'ما هي خطط الدفع المتاحة؟',
    answer_en: 'We offer flexible payment plans tailored to each project. Typically, our plans include down payment options starting from 10%, with the balance payable in monthly installments during construction and post-handover. Contact our team for specific project payment plans.',
    answer_ar: 'نقدم خطط دفع مرنة مصممة لكل مشروع. عادةً، تتضمن خططنا خيارات دفعة أولى تبدأ من 10%، مع سداد الرصيد بأقساط شهرية أثناء البناء وبعد التسليم. تواصل مع فريقنا لمعرفة خطط الدفع الخاصة بكل مشروع.',
    sort_order: 2,
  },
  {
    id: '3',
    question_en: 'How can I schedule a property viewing?',
    question_ar: 'كيف يمكنني حجز معاينة للعقار؟',
    answer_en: 'You can schedule a viewing by calling us at 17074, filling out the contact form on our website, or visiting our sales office. Our team is available 7 days a week to accommodate your schedule.',
    answer_ar: 'يمكنك حجز معاينة بالاتصال بنا على 17074، أو ملء نموذج التواصل على موقعنا، أو زيارة مكتب المبيعات. فريقنا متاح 7 أيام في الأسبوع لتناسب جدولك.',
    sort_order: 3,
  },
  {
    id: '4',
    question_en: 'What after-sales support do you provide?',
    question_ar: 'ما هو دعم ما بعد البيع الذي تقدمونه؟',
    answer_en: 'We provide comprehensive after-sales support including property management, maintenance services, warranty coverage, and dedicated customer service. Our commitment to our clients extends well beyond the point of sale.',
    answer_ar: 'نقدم دعماً شاملاً لما بعد البيع يشمل إدارة العقارات، خدمات الصيانة، تغطية الضمان، وخدمة عملاء مخصصة. التزامنا تجاه عملائنا يمتد إلى ما بعد نقطة البيع بكثير.',
    sort_order: 4,
  },
  {
    id: '5',
    question_en: 'Are your properties eligible for residency permits?',
    question_ar: 'هل عقاراتكم مؤهلة للحصول على تصاريح إقامة؟',
    answer_en: 'Yes, property owners in Egypt may be eligible for residency permits, subject to meeting minimum property value requirements and other regulatory conditions. Our team can provide guidance on eligibility.',
    answer_ar: 'نعم، قد يكون مالكو العقارات في مصر مؤهلين للحصول على تصاريح إقامة، بشرط استيفاء متطلبات الحد الأدنى لقيمة العقار والشروط التنظيمية الأخرى. يمكن لفريقنا تقديم إرشادات حول الأهلية.',
    sort_order: 5,
  },
];
