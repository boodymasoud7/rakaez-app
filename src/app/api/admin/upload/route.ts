import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { requireAdmin } from '@/lib/auth/guard';
import { writeFiles } from '@/lib/content/writer';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

function safeExtension(file: File): string {
  if (file.type && EXTENSION_BY_MIME[file.type]) {
    return EXTENSION_BY_MIME[file.type];
  }
  const dot = file.name.lastIndexOf('.');
  if (dot > -1) {
    return file.name
      .slice(dot + 1)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 5);
  }
  return 'bin';
}

/**
 * POST /api/admin/upload
 * Body: multipart/form-data with `file` and optional `folder` (default "uploads").
 *
 * Stores the file under `public/uploads/<folder>/yyyy/mm/<hash>.<ext>` so
 * it is served as a static asset at `/uploads/<folder>/yyyy/mm/<hash>.<ext>`.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const form = await request.formData();
  const file = form.get('file');
  const folderInput = (form.get('folder') as string) || 'uploads';
  const folder = folderInput.replace(/[^a-z0-9_-]/gi, '').slice(0, 32) || 'uploads';

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: 'A file is required (multipart field "file").' },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json({ error: 'File is empty.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large. Max ${MAX_BYTES / 1024 / 1024} MB.` },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const hash = randomBytes(6).toString('hex');
  const ext = safeExtension(file);

  const relPath = `uploads/${folder}/${yyyy}/${mm}/${hash}.${ext}`;
  const repoPath = `public/${relPath}`;
  const publicUrl = `/${relPath}`;

  await writeFiles(
    [{ path: repoPath, content: buffer }],
    `feat(media): upload ${relPath}`
  );

  return NextResponse.json({
    url: publicUrl,
    path: repoPath,
    size: file.size,
    type: file.type,
  });
}
