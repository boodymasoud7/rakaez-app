import os
import json
import re
import fitz  # PyMuPDF

NEW_PDF_DIR = r"C:\Users\boody\OneDrive\Desktop\pdf\New folder"
APP_DIR = r"c:\Users\boody\OneDrive\Desktop\rakaez-app"
PUBLIC_UPLOADS_DIR = os.path.join(APP_DIR, "public", "uploads", "projects")
PROJECTS_JSON_PATH = os.path.join(APP_DIR, "content", "projects.json")

PDF_TO_SLUG_MAP = {
    "116 B.pdf": "116b",
    "177 a.pdf": "177a",
    "198 b..pdf": "198b",
    "25 .pdf": "25a",
    "61_compressed.pdf": "61b",
    "97.pdf": "532-97",
    "bet new_compressed.pdf": "masterplan-bayt-al-watan"
}

def extract_pdf_pages(pdf_path, output_dir, prefix):
    os.makedirs(output_dir, exist_ok=True)
    images = []
    try:
        doc = fitz.open(pdf_path)
        zoom = 2.0  # high resolution render (~150-200 dpi)
        mat = fitz.Matrix(zoom, zoom)
        
        for i, page in enumerate(doc):
            pix = page.get_pixmap(matrix=mat)
            img_filename = f"{prefix}-brochure-p{i+1}.jpg"
            img_path = os.path.join(output_dir, img_filename)
            pix.save(img_path)
            web_url = f"/uploads/projects/{prefix}/{img_filename}"
            images.append(web_url)
            
        doc.close()
        print(f"Extracted {len(images)} pages from {os.path.basename(pdf_path)} -> {prefix}")
    except Exception as e:
        print(f"Error extracting {pdf_path}: {e}")
    return images

def process():
    print("Reading content/projects.json...")
    with open(PROJECTS_JSON_PATH, 'r', encoding='utf-8') as f:
        projects = json.load(f)

    # Convert projects list to a dict for easy updating by slug
    proj_map = {p['slug']: p for p in projects}

    for pdf_filename, target_slug in PDF_TO_SLUG_MAP.items():
        pdf_path = os.path.join(NEW_PDF_DIR, pdf_filename)
        if not os.path.exists(pdf_path):
            print(f"Warning: File not found {pdf_path}")
            continue

        if target_slug == "masterplan-bayt-al-watan":
            # Add masterplan images to all main Bayt Al Watan projects
            target_dir = os.path.join(PUBLIC_UPLOADS_DIR, "masterplan")
            extracted = extract_pdf_pages(pdf_path, target_dir, "masterplan")
            for slug in ["25a", "116b", "61b", "532-97", "177a", "198b"]:
                if slug in proj_map:
                    existing_urls = [g['url'] for g in proj_map[slug].get('gallery', [])]
                    for img_url in extracted:
                        if img_url not in existing_urls:
                            proj_map[slug]['gallery'].append({
                                "url": img_url,
                                "sort_order": len(proj_map[slug]['gallery']) + 1
                            })
            continue

        target_dir = os.path.join(PUBLIC_UPLOADS_DIR, target_slug)
        extracted_images = extract_pdf_pages(pdf_path, target_dir, target_slug)

        if not extracted_images:
            continue

        if target_slug in proj_map:
            proj = proj_map[target_slug]
            
            # Set cover image if missing or update with 1st brochure render if available
            if not proj.get('cover_image'):
                proj['cover_image'] = extracted_images[0]
            
            # Merge extracted images into project gallery
            existing_urls = set([g['url'] for g in proj.get('gallery', [])])
            if proj.get('cover_image'):
                existing_urls.add(proj['cover_image'])

            for img in extracted_images:
                if img not in existing_urls:
                    proj['gallery'].append({
                        "url": img,
                        "sort_order": len(proj['gallery']) + 1
                    })
                    existing_urls.add(img)

    # Save back to content/projects.json
    updated_projects_list = list(proj_map.values())
    with open(PROJECTS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(updated_projects_list, f, ensure_ascii=False, indent=2)

    print(f"Successfully updated projects in {PROJECTS_JSON_PATH}!")

if __name__ == "__main__":
    process()
