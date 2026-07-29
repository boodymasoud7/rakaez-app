import os
import json
import re
import fitz  # PyMuPDF

PROJECTS_BASE_DIR = r"C:\Users\boody\OneDrive\Desktop\pdf\Rakaez Developments - Projects-20260729T190855Z-1-001\Rakaez Developments - Projects"
APP_DIR = r"c:\Users\boody\OneDrive\Desktop\rakaez-app"
PUBLIC_UPLOADS_DIR = os.path.join(APP_DIR, "public", "uploads", "projects")
PROJECTS_JSON_PATH = os.path.join(APP_DIR, "content", "projects.json")

os.makedirs(PUBLIC_UPLOADS_DIR, exist_ok=True)

# Default amenities & payment plans for real estate projects
DEFAULT_AMENITIES = [
    {"name_en": "Elevator", "name_ar": "مصعد هيدروليكي", "icon": "HiSparkles"},
    {"name_en": "Underground Parking", "name_ar": "جراج خاص مغطى", "icon": "HiShieldCheck"},
    {"name_en": "Surveillance Systems", "name_ar": "كاميرات مراقبة وأمن", "icon": "HiShieldCheck"},
    {"name_en": "Luxury Entrance", "name_ar": "مداخل رخام فاخرة", "icon": "HiStar"},
    {"name_en": "Intercom & Security", "name_ar": "أنظمة انتركم مرئي", "icon": "HiPhone"},
    {"name_en": "Landscape & Greenery", "name_ar": "مساحات خضراء ولاندسكيب", "icon": "HiLocationMarker"}
]

DEFAULT_PAYMENT_PLANS = [
    {
        "name_en": "Flexible Payment Plan",
        "name_ar": "نظام السداد المرن",
        "details_en": "Down payment with flexible installments over up to 48 months",
        "details_ar": "مقدم حجز ميسر وأقساط حتى 48 شهر بدون فوائد"
    }
]

def make_slug(name):
    clean = name.lower().strip()
    clean = clean.replace(' ', '-').replace('_', '-').replace('/', '-')
    clean = re.sub(r'[^a-z0-9\-]', '', clean)
    clean = re.sub(r'\-+', '-', clean).strip('-')
    return clean or "project"

def extract_pdf_images(pdf_path, output_folder, slug):
    saved_images = []
    try:
        doc = fitz.open(pdf_path)
        zoom = 2.0  # high resolution render (2x ~ 150-200 dpi)
        mat = fitz.Matrix(zoom, zoom)
        
        for i, page in enumerate(doc):
            pix = page.get_pixmap(matrix=mat)
            img_filename = f"{slug}-page-{i+1}.jpg"
            img_path = os.path.join(output_folder, img_filename)
            pix.save(img_path)
            web_url = f"/uploads/projects/{slug}/{img_filename}"
            saved_images.append(web_url)
            
        doc.close()
    except Exception as e:
        print(f"Error rendering PDF {pdf_path}: {e}")
    return saved_images

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text() + "\n"
        doc.close()
    except Exception as e:
        print(f"Error reading text from {pdf_path}: {e}")
    return text

def parse_unit_areas(text):
    # Find patterns like 195.5 m2, 237.5m², 163 م², 234م
    matches = re.findall(r'(\d+(?:\.\d+)?)\s*(?:m²|m2|م²|م)', text)
    areas = []
    for m in matches:
        try:
            val = float(m)
            if 50 <= val <= 600:
                areas.append(val)
        except ValueError:
            pass
    return sorted(list(set(areas)))

def copy_image_file(src_path, output_folder, slug, idx):
    ext = os.path.splitext(src_path)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
        return None
    img_filename = f"{slug}-img-{idx}{ext}"
    dest_path = os.path.join(output_folder, img_filename)
    try:
        with open(src_path, 'rb') as fsrc:
            with open(dest_path, 'wb') as fdest:
                fdest.write(fsrc.read())
        return f"/uploads/projects/{slug}/{img_filename}"
    except Exception as e:
        print(f"Error copying image {src_path}: {e}")
        return None

def process_all_projects():
    projects_dict = {}

    # Category 1: المشاريع الحالية (Ongoing Projects)
    ongoing_dir = os.path.join(PROJECTS_BASE_DIR, "المشاريع الحالية")
    if os.path.exists(ongoing_dir):
        for proj_folder in os.listdir(ongoing_dir):
            full_path = os.path.join(ongoing_dir, proj_folder)
            if os.path.isdir(full_path):
                slug = make_slug(proj_folder)
                out_dir = os.path.join(PUBLIC_UPLOADS_DIR, slug)
                os.makedirs(out_dir, exist_ok=True)
                
                images = []
                extracted_text = ""
                img_idx = 1
                
                for f in sorted(os.listdir(full_path)):
                    file_path = os.path.join(full_path, f)
                    if f.lower().endswith('.pdf'):
                        pdf_imgs = extract_pdf_images(file_path, out_dir, slug)
                        images.extend(pdf_imgs)
                        extracted_text += extract_text_from_pdf(file_path)
                    elif f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                        copied = copy_image_file(file_path, out_dir, slug, img_idx)
                        if copied:
                            images.append(copied)
                            img_idx += 1

                # Clean project metadata
                name_ar = f"مشروع {proj_folder}"
                name_en = f"Project {proj_folder}"
                if "diamond" in slug:
                    name_ar = "مشروع دايموند تاور - Diamond Tower"
                    name_en = "Diamond Tower Project"
                elif "valley-1" in slug:
                    name_ar = "مشروع فالي 1 - قطعة 9I (بيت الوطن)"
                    name_en = "Valley 1 Project - Plot 9I (Bayt Al Watan)"
                elif "valley-2" in slug:
                    name_ar = "مشروع فالي 2 - قطعة 138I (بيت الوطن)"
                    name_en = "Valley 2 Project - Plot 138I (Bayt Al Watan)"

                areas = parse_unit_areas(extracted_text)
                area_from = min(areas) if areas else 135
                area_to = max(areas) if areas else 240

                cover_image = images[0] if images else None
                gallery = [{"url": img, "sort_order": i+1} for i, img in enumerate(images[1:])] if len(images) > 1 else []

                projects_dict[slug] = {
                    "id": f"proj-{slug}",
                    "name_en": name_en,
                    "name_ar": name_ar,
                    "slug": slug,
                    "location_en": "Bayt Al Watan, New Cairo / Mansoura",
                    "location_ar": "بيت الوطن - التجمع الخامس / المنصورة",
                    "description_en": f"Luxury modern development featuring ultra-premium residential and commercial units with executive architectural design by Rakaez Developments.",
                    "description_ar": f"مشروع عقاري سكني وتجاري فاخر بتصميم معماري فريد، يتضمن وحدات سكنية ومساحات تجارية متميزة بأعلى معايير الجودة والرفاهية من شركة ركائز للتطوير العقاري.",
                    "status": "ongoing",
                    "lat": 30.0254,
                    "lng": 31.4912,
                    "brochure_url": None,
                    "cover_image": cover_image,
                    "featured": True,
                    "gallery": gallery,
                    "videos": [],
                    "unit_types": [
                        {
                            "category": "residential",
                            "area_from": int(area_from),
                            "area_to": int(area_to)
                        }
                    ],
                    "payment_plans": DEFAULT_PAYMENT_PLANS,
                    "amenities": DEFAULT_AMENITIES,
                    "created_at": "2024-06-01T00:00:00.000Z",
                    "updated_at": "2026-07-29T00:00:00.000Z"
                }

    # Category 2: سابقة الاعمال (Completed Projects)
    completed_dir = os.path.join(PROJECTS_BASE_DIR, "سابقة الاعمال")
    if os.path.exists(completed_dir):
        for item in sorted(os.listdir(completed_dir)):
            full_path = os.path.join(completed_dir, item)
            
            # Case A: Subfolder per project
            if os.path.isdir(full_path):
                slug = make_slug(item)
                out_dir = os.path.join(PUBLIC_UPLOADS_DIR, slug)
                os.makedirs(out_dir, exist_ok=True)
                
                images = []
                extracted_text = ""
                img_idx = 1
                
                for f in sorted(os.listdir(full_path)):
                    file_path = os.path.join(full_path, f)
                    if f.lower().endswith('.pdf'):
                        pdf_imgs = extract_pdf_images(file_path, out_dir, slug)
                        images.extend(pdf_imgs)
                        extracted_text += extract_text_from_pdf(file_path)
                    elif f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                        copied = copy_image_file(file_path, out_dir, slug, img_idx)
                        if copied:
                            images.append(copied)
                            img_idx += 1
                            
                name_ar = f"مشروع {item} - بيت الوطن"
                name_en = f"Project {item} - Bayt Al Watan"

                areas = parse_unit_areas(extracted_text)
                area_from = min(areas) if areas else 130
                area_to = max(areas) if areas else 235

                cover_image = images[0] if images else None
                gallery = [{"url": img, "sort_order": i+1} for i, img in enumerate(images[1:])] if len(images) > 1 else []

                projects_dict[slug] = {
                    "id": f"proj-{slug}",
                    "name_en": name_en,
                    "name_ar": name_ar,
                    "slug": slug,
                    "location_en": "Bayt Al Watan, New Cairo",
                    "location_ar": "بيت الوطن - القاهرة الجديدة",
                    "description_en": f"Completed premium residential building in Bayt Al Watan with elegant architecture, private garages, hydraulic elevators, and prime urban location.",
                    "description_ar": f"مشروع سكني مكتمل ومسلم بأعلى مواصفات التشطيب والجودة في حي بيت الوطن بالقاهرة الجديدة، ويتميز بواجهة كلاسيكية راقية ومداخل رخام ومصاعد هيدروليكية وجراجات خاصة.",
                    "status": "completed",
                    "lat": 30.0240,
                    "lng": 31.4930,
                    "brochure_url": None,
                    "cover_image": cover_image,
                    "featured": True if item in ["25A", "116B", "61B", "532-97", "177A", "109B", "198B"] else False,
                    "gallery": gallery,
                    "videos": [],
                    "unit_types": [
                        {
                            "category": "residential",
                            "area_from": int(area_from),
                            "area_to": int(area_to)
                        }
                    ],
                    "payment_plans": DEFAULT_PAYMENT_PLANS,
                    "amenities": DEFAULT_AMENITIES,
                    "created_at": "2024-01-01T00:00:00.000Z",
                    "updated_at": "2026-07-29T00:00:00.000Z"
                }

            # Case B: Standalone PDF files in سابقة الاعمال (e.g. 48 بروشور.pdf, rakaez 31-1.pdf)
            elif item.lower().endswith('.pdf'):
                proj_name = item.replace('.pdf', '').replace('بروشور', '').strip()
                slug = make_slug(proj_name)
                out_dir = os.path.join(PUBLIC_UPLOADS_DIR, slug)
                os.makedirs(out_dir, exist_ok=True)
                
                images = extract_pdf_images(full_path, out_dir, slug)
                extracted_text = extract_text_from_pdf(full_path)
                
                name_ar = f"مشروع {proj_name} - بيت الوطن"
                name_en = f"Project {proj_name} - Bayt Al Watan"

                areas = parse_unit_areas(extracted_text)
                area_from = min(areas) if areas else 140
                area_to = max(areas) if areas else 220

                cover_image = images[0] if images else None
                gallery = [{"url": img, "sort_order": i+1} for i, img in enumerate(images[1:])] if len(images) > 1 else []

                projects_dict[slug] = {
                    "id": f"proj-{slug}",
                    "name_en": name_en,
                    "name_ar": name_ar,
                    "slug": slug,
                    "location_en": "Bayt Al Watan, New Cairo",
                    "location_ar": "بيت الوطن - القاهرة الجديدة",
                    "description_en": f"High-end luxury residential building in Bayt Al Watan engineered with neoclassical facade and premium facilities.",
                    "description_ar": f"مشروع فاخر بتصميم معماري رائع ومواصفات هندسية دقيقة في بيت الوطن، يوفر بيئة سكنية هادئة وممتازة بالقرب من كافة الخدمات الرئيسية.",
                    "status": "completed",
                    "lat": 30.0245,
                    "lng": 31.4925,
                    "brochure_url": None,
                    "cover_image": cover_image,
                    "featured": True if "48" in slug or "31" in slug else False,
                    "gallery": gallery,
                    "videos": [],
                    "unit_types": [
                        {
                            "category": "residential",
                            "area_from": int(area_from),
                            "area_to": int(area_to)
                        }
                    ],
                    "payment_plans": DEFAULT_PAYMENT_PLANS,
                    "amenities": DEFAULT_AMENITIES,
                    "created_at": "2024-02-01T00:00:00.000Z",
                    "updated_at": "2026-07-29T00:00:00.000Z"
                }

    final_projects_list = list(projects_dict.values())
    
    # Save back to projects.json
    with open(PROJECTS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(final_projects_list, f, ensure_ascii=False, indent=2)

    print(f"Successfully processed {len(final_projects_list)} projects into {PROJECTS_JSON_PATH}!")

if __name__ == "__main__":
    process_all_projects()
