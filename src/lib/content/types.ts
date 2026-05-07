/**
 * Types for content stored as JSON files in /content folder.
 * These replace the previous Supabase table types.
 */

export interface ProjectImage {
  url: string;
  sort_order?: number;
}

export interface ProjectVideo {
  url: string;
  title_en?: string;
  title_ar?: string;
}

export interface UnitType {
  name_en: string;
  name_ar: string;
  bedrooms: number;
  area: string;
  price: string;
}

export interface PaymentPlan {
  name_en: string;
  name_ar: string;
  details_en: string;
  details_ar: string;
}

export interface Amenity {
  name_en: string;
  name_ar: string;
  icon: string;
}

export interface Project {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  location_en: string;
  location_ar: string;
  description_en: string;
  description_ar: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  lat: number | null;
  lng: number | null;
  brochure_url: string | null;
  cover_image: string | null;
  featured: boolean;
  gallery: ProjectImage[];
  videos: ProjectVideo[];
  unit_types: UnitType[];
  payment_plans: PaymentPlan[];
  amenities: Amenity[];
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  content_en: string;
  content_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  category: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  sort_order: number;
}

export interface FaqItem {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  sort_order: number;
}

export interface SiteSettingValue {
  en: string;
  ar: string;
}

export type SiteSettings = Record<string, SiteSettingValue>;

export interface SeoPage {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  og_image: string | null;
}

export type SeoPages = Record<string, SeoPage>;

export type Locale = 'en' | 'ar';

// Helper type to access localized fields with type safety
export function getLocalized(
  item: object,
  field: string,
  locale: Locale
): string {
  const key = `${field}_${locale}`;
  const value = (item as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}
