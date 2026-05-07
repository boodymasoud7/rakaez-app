import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Octokit } from 'octokit';
import { requireAdmin } from '@/lib/auth/guard';
import { revalidatePath } from 'next/cache';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

/**
 * POST /api/admin/media/delete
 * Body: { path: "public/uploads/..." }
 *
 * Removes the file from the repo. Uses the local filesystem in dev or
 * GitHub Git Data API in prod.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  let body: { path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const target = body?.path?.trim();
  if (!target || !target.startsWith('public/uploads/')) {
    return NextResponse.json(
      { error: 'Path must start with "public/uploads/"' },
      { status: 400 }
    );
  }
  // Block path traversal
  if (target.includes('..')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const tokenAvailable = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
  const isProd = process.env.NODE_ENV === 'production';
  const forced = process.env.CONTENT_USE_GITHUB === 'true';
  const useGithub = tokenAvailable && (isProd || forced);

  if (useGithub) {
    await deleteFromGithub(target);
  } else {
    await deleteFromLocal(target);
  }

  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true });
}

async function deleteFromLocal(repoPath: string): Promise<void> {
  const rel = repoPath.slice('public/'.length);
  const abs = path.join(PUBLIC_DIR, rel);
  try {
    await fs.unlink(abs);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }
}

async function deleteFromGithub(repoPath: string): Promise<void> {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repoEnv = process.env.GITHUB_REPO!;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const [owner, repo] = repoEnv.split('/');

  // Need the file's blob SHA to delete via the contents API
  const contents = await octokit.rest.repos
    .getContent({ owner, repo, path: repoPath, ref: branch })
    .catch(() => null);

  if (!contents || Array.isArray(contents.data) || contents.data.type !== 'file') {
    // Already gone
    return;
  }

  await octokit.rest.repos.deleteFile({
    owner,
    repo,
    path: repoPath,
    branch,
    message: `chore(media): delete ${repoPath}`,
    sha: contents.data.sha,
  });
}
