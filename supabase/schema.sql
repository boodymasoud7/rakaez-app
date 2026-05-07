-- ============================================
-- Rakaez Real Estate Database Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location_en TEXT NOT NULL DEFAULT '',
  location_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  brochure_url TEXT,
  cover_image TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE project_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE project_videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title_en TEXT DEFAULT '',
  title_ar TEXT DEFAULT ''
);

CREATE TABLE unit_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  bedrooms INT DEFAULT 0,
  area TEXT DEFAULT '',
  price TEXT DEFAULT ''
);

CREATE TABLE payment_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  details_en TEXT DEFAULT '',
  details_ar TEXT DEFAULT ''
);

CREATE TABLE amenities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  icon TEXT DEFAULT 'HiCheckCircle'
);

-- ============================================
-- BLOG
-- ============================================
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_en TEXT DEFAULT '',
  content_ar TEXT DEFAULT '',
  excerpt_en TEXT DEFAULT '',
  excerpt_ar TEXT DEFAULT '',
  image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SERVICES
-- ============================================
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  icon TEXT DEFAULT 'HiOfficeBuilding',
  sort_order INT DEFAULT 0
);

-- ============================================
-- CONTACTS / INQUIRIES
-- ============================================
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  message TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'contact' CHECK (type IN ('contact', 'inquiry', 'consultation')),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SITE SETTINGS
-- ============================================
CREATE TABLE site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value_en TEXT DEFAULT '',
  value_ar TEXT DEFAULT ''
);

-- Seed default settings
INSERT INTO site_settings (key, value_en, value_ar) VALUES
  ('phone', '17074', '17074'),
  ('whatsapp', '+97317074', '+97317074'),
  ('email', 'info@rakaez.com', 'info@rakaez.com'),
  ('address_en', 'Egypt', ''),
  ('address_ar', '', 'جمهورية مصر العربية'),
  ('facebook', '', ''),
  ('instagram', '', ''),
  ('linkedin', '', ''),
  ('hero_title_en', 'Building the Future of Real Estate', ''),
  ('hero_title_ar', '', 'نبني مستقبل العقارات'),
  ('hero_subtitle_en', 'Premium developments that redefine luxury living', ''),
  ('hero_subtitle_ar', '', 'مشاريع فاخرة تعيد تعريف الحياة العصرية'),
  ('about_preview_en', 'Rakaez Real Estate Development is a leading developer creating landmark projects.', ''),
  ('about_preview_ar', '', 'ركائز للتطوير العقاري شركة رائدة في تطوير مشاريع عقارية فريدة.'),
  ('stats_projects', '15', '15'),
  ('stats_units', '2500', '2500'),
  ('stats_clients', '1800', '1800'),
  ('cta_text_en', 'Explore Projects', ''),
  ('cta_text_ar', '', 'استكشف المشاريع'),
  ('featured_project_ids', '', '');

-- ============================================
-- SEO PAGES
-- ============================================
CREATE TABLE seo_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page TEXT UNIQUE NOT NULL,
  title_en TEXT DEFAULT '',
  title_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  og_image TEXT
);

INSERT INTO seo_pages (page, title_en, title_ar, description_en, description_ar) VALUES
  ('home', 'Rakaez Real Estate Development', 'ركائز للتطوير العقاري', 'Premium real estate development in Egypt', 'التطوير العقاري الفاخر في مصر'),
  ('about', 'About Rakaez', 'عن ركائز', 'Learn about Rakaez Real Estate', 'تعرف على ركائز'),
  ('projects', 'Our Projects', 'مشاريعنا', 'Premium developments by Rakaez', 'مشاريع ركائز الفاخرة'),
  ('services', 'Our Services', 'خدماتنا', 'Real estate services', 'خدماتنا العقارية'),
  ('blog', 'Blog & News', 'المدونة', 'Latest news', 'آخر الأخبار'),
  ('contact', 'Contact Us', 'تواصل معنا', 'Get in touch', 'تواصل معنا'),
  ('faq', 'FAQ', 'الأسئلة الشائعة', 'Frequently asked questions', 'الأسئلة المتكررة');

-- ============================================
-- FAQ
-- ============================================
CREATE TABLE faq_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_en TEXT NOT NULL,
  question_ar TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read project_images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Public read project_videos" ON project_videos FOR SELECT USING (true);
CREATE POLICY "Public read unit_types" ON unit_types FOR SELECT USING (true);
CREATE POLICY "Public read payment_plans" ON payment_plans FOR SELECT USING (true);
CREATE POLICY "Public read amenities" ON amenities FOR SELECT USING (true);
CREATE POLICY "Public read published blog" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read seo" ON seo_pages FOR SELECT USING (true);
CREATE POLICY "Public read faq" ON faq_items FOR SELECT USING (true);

-- Public insert for contacts
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin all projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all project_images" ON project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all project_videos" ON project_videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all unit_types" ON unit_types FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all payment_plans" ON payment_plans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all amenities" ON amenities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all blog" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all seo" ON seo_pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all faq" ON faq_items FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKETS (run in Supabase dashboard)
-- ============================================
-- Create buckets: projects, blog, brochures, media
-- Set all to public for read access
