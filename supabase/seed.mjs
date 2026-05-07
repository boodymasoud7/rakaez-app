// Seed the Supabase database with demo data
// Usage: node supabase/seed.mjs

const SUPABASE_URL = 'https://tqxwzfagoeecbxlqawsd.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxeHd6ZmFnb2VlY2J4bHFhd3NkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY1NTIwNSwiZXhwIjoyMDg5MjMxMjA1fQ.3i2QUbfjquEUduFMTTn8_60ZM9Kxom1Lz-zpfPzSUp4';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Prefer': 'return=minimal',
};

async function insert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST', headers, body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    console.log(`  ✗ ${table}: ${err.substring(0, 120)}`);
  } else {
    console.log(`  ✓ ${table}: ${Array.isArray(data) ? data.length : 1} row(s)`);
  }
}

async function seed() {
  console.log('Seeding projects...');
  await insert('projects', [
    {
      name_en: 'Al Noor Residences', name_ar: 'مساكن النور', slug: 'al-noor-residences',
      location_en: 'New Cairo, Egypt', location_ar: 'القاهرة الجديدة، مصر',
      description_en: 'A prestigious residential development offering luxury apartments with stunning views, world-class amenities, and modern architecture in the heart of Egypt.',
      description_ar: 'مشروع سكني فاخر يقدم شققاً فاخرة مع إطلالات خلابة ومرافق عالمية المستوى وعمارة حديثة في قلب مصر.',
      status: 'ongoing', featured: true, lat: 30.0291, lng: 31.4932,
      cover_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    },
    {
      name_en: 'The Pearl Gardens', name_ar: 'حدائق اللؤلؤ', slug: 'the-pearl-gardens',
      location_en: '6th of October City, Egypt', location_ar: 'مدينة 6 أكتوبر، مصر',
      description_en: 'An exclusive gated community featuring luxury villas surrounded by lush gardens, private pools, and premium lifestyle facilities.',
      description_ar: 'مجتمع سكني حصري يضم فلل فاخرة محاطة بحدائق غناء ومسابح خاصة ومرافق نمط حياة متميزة.',
      status: 'upcoming', featured: true, lat: 29.9602, lng: 30.9276,
      cover_image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    },
    {
      name_en: 'Marina Business Tower', name_ar: 'برج مارينا للأعمال', slug: 'marina-business-tower',
      location_en: 'New Administrative Capital, Egypt', location_ar: 'العاصمة الإدارية الجديدة، مصر',
      description_en: 'A state-of-the-art commercial tower offering premium office spaces with panoramic views of the Arabian Gulf.',
      description_ar: 'برج تجاري حديث يوفر مساحات مكتبية فاخرة مع إطلالات بانورامية على الخليج العربي.',
      status: 'completed', featured: true, lat: 30.0196, lng: 31.7636,
      cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    },
    {
      name_en: 'Sunset Heights', name_ar: 'مرتفعات الغروب', slug: 'sunset-heights',
      location_en: 'North Coast, Egypt', location_ar: 'الساحل الشمالي، مصر',
      description_en: 'Modern residential apartments designed for comfortable family living with scenic views and convenient access to amenities.',
      description_ar: 'شقق سكنية عصرية مصممة للحياة العائلية المريحة مع إطلالات خلابة ووصول مريح للمرافق.',
      status: 'ongoing', featured: false, lat: 31.0409, lng: 28.0572,
      cover_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    },
  ]);

  console.log('Seeding blog posts...');
  await insert('blog_posts', [
    {
      title_en: 'Egypt Real Estate Market Outlook 2024', title_ar: 'توقعات سوق العقارات في مصر 2024',
      slug: 'egypt-real-estate-market-outlook-2024',
      content_en: '<p>The Egyptian real estate market continues to show strong growth driven by government initiatives, foreign investment, and infrastructure development. Key trends include luxury segment growth, sustainable building practices, and digital transformation.</p><h2>Key Highlights</h2><ul><li>15% growth in luxury property demand</li><li>New infrastructure projects boosting property values</li><li>Increasing foreign investment in real estate</li></ul>',
      content_ar: '<p>يواصل سوق العقارات في مصر نموه القوي مدفوعاً بالمبادرات الحكومية والاستثمار الأجنبي وتطوير البنية التحتية.</p>',
      excerpt_en: 'Analysis of key trends and opportunities in Egyptian real estate.',
      excerpt_ar: 'تحليل لأهم الاتجاهات والفرص في سوق العقارات المصري.',
      image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
      published: true,
    },
    {
      title_en: 'Al Noor Residences Construction Update', title_ar: 'تحديث بناء مساكن النور',
      slug: 'al-noor-residences-construction-update',
      content_en: '<p>Construction at Al Noor Residences has reached the 15th floor, marking a significant milestone. The project remains on schedule for completion in Q4 2025.</p>',
      content_ar: '<p>وصل البناء في مساكن النور إلى الطابق الخامس عشر، مما يشكل معلماً هاماً في المشروع.</p>',
      excerpt_en: 'Latest construction progress at Al Noor Residences.',
      excerpt_ar: 'أحدث تقدم في بناء مساكن النور.',
      image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      published: true,
    },
    {
      title_en: 'Investing in Egypt: A Complete Guide', title_ar: 'الاستثمار في مصر: دليل شامل',
      slug: 'investing-in-egypt-guide',
      content_en: '<p>Egypt offers a unique real estate investment landscape with growing demand, massive urban development projects, and strong rental yields. This guide covers everything you need to know.</p>',
      content_ar: '<p>توفر مصر بيئة استثمارية عقارية فريدة مع طلب متزايد ومشاريع تنمية عمرانية ضخمة وعوائد إيجارية قوية.</p>',
      excerpt_en: 'Everything you need to know about real estate investment in Egypt.',
      excerpt_ar: 'كل ما تحتاج معرفته عن الاستثمار العقاري في مصر.',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      published: true,
    },
  ]);

  console.log('Seeding services...');
  await insert('services', [
    { title_en: 'Property Development', title_ar: 'التطوير العقاري', description_en: 'End-to-end property development from land acquisition to handover, creating iconic landmarks.', description_ar: 'تطوير عقاري شامل من الاستحواذ على الأراضي حتى التسليم.', icon: 'HiOfficeBuilding', sort_order: 1 },
    { title_en: 'Investment Advisory', title_ar: 'الاستشارات الاستثمارية', description_en: 'Expert guidance on real estate investment opportunities and portfolio management.', description_ar: 'إرشاد خبير حول فرص الاستثمار العقاري.', icon: 'HiTrendingUp', sort_order: 2 },
    { title_en: 'Property Management', title_ar: 'إدارة الممتلكات', description_en: 'Comprehensive property management services ensuring optimal performance.', description_ar: 'خدمات إدارة ممتلكات شاملة.', icon: 'HiCog', sort_order: 3 },
    { title_en: 'Design Consultation', title_ar: 'استشارات التصميم', description_en: 'Innovative design solutions that blend aesthetics with functionality.', description_ar: 'حلول تصميم مبتكرة تمزج بين الجماليات والوظائف.', icon: 'HiLightBulb', sort_order: 4 },
  ]);

  console.log('Seeding FAQ items...');
  await insert('faq_items', [
    { question_en: 'What types of properties does Rakaez develop?', question_ar: 'ما أنواع العقارات التي تطورها ركائز؟', answer_en: 'We develop residential apartments, luxury villas, commercial towers, and mixed-use developments.', answer_ar: 'نطور الشقق السكنية والفلل الفاخرة والأبراج التجارية والمشاريع متعددة الاستخدامات.', sort_order: 1 },
    { question_en: 'Can foreign nationals buy property in Egypt?', question_ar: 'هل يمكن للأجانب شراء عقارات في مصر؟', answer_en: 'Yes, foreign nationals can purchase property in Egypt in designated areas.', answer_ar: 'نعم، يمكن للأجانب شراء عقارات في مناطق محددة في مصر.', sort_order: 2 },
    { question_en: 'Do you offer payment plans?', question_ar: 'هل تقدمون خطط دفع؟', answer_en: 'Yes, we offer flexible payment plans tailored to suit different budgets and needs.', answer_ar: 'نعم، نقدم خطط دفع مرنة مصممة لتناسب مختلف الميزانيات والاحتياجات.', sort_order: 3 },
    { question_en: 'How can I schedule a property viewing?', question_ar: 'كيف يمكنني حجز معاينة للعقار؟', answer_en: 'Contact us via phone, email, or the website contact form to schedule a viewing.', answer_ar: 'تواصل معنا عبر الهاتف أو البريد الإلكتروني أو نموذج التواصل لحجز معاينة.', sort_order: 4 },
  ]);

  console.log('\n✅ Seeding complete!');
}

seed().catch(console.error);
