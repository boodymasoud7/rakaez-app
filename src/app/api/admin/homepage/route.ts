import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { updateJson, writeFiles } from '@/lib/content/writer';
import type { Project, SiteSettings } from '@/lib/content/types';
import { promises as fs } from 'fs';
import path from 'path';
import { Octokit } from 'octokit';

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function readJsonContent<T>(fileName: string, fallback: T): Promise<T> {
  const tokenAvailable = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
  const isProd = process.env.NODE_ENV === 'production';
  const forced = process.env.CONTENT_USE_GITHUB === 'true';
  const useGithub = tokenAvailable && (isProd || forced);

  if (useGithub) {
    try {
      const repo = process.env.GITHUB_REPO || '';
      const branch = process.env.GITHUB_BRANCH || 'main';
      const [owner, repoName] = repo.split('/');
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
      const res = await octokit.rest.repos.getContent({
        owner,
        repo: repoName,
        path: `content/${fileName}`,
        ref: branch,
        headers: { 'Cache-Control': 'no-cache' },
      });
      if ('content' in res.data && typeof res.data.content === 'string') {
        const decoded = Buffer.from(res.data.content, 'base64').toString('utf8');
        return JSON.parse(decoded) as T;
      }
    } catch (githubErr) {
      console.warn(`Failed to fetch latest content/${fileName} from GitHub:`, githubErr);
    }
  }

  try {
    const filePath = path.join(CONTENT_DIR, fileName);
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * POST /api/admin/homepage
 * Body: { settings?: SiteSettings, featuredProjectIds?: string[] }
 * Batch saves homepage settings and featured projects in ONE single atomic commit & deployment.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  let body: { settings?: SiteSettings; featuredProjectIds?: string[] };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { settings, featuredProjectIds } = body || {};

  try {
    const changes: { path: string; content: string }[] = [];

    if (settings && typeof settings === 'object') {
      const settingsJson = JSON.stringify(settings, null, 2) + '\n';
      changes.push({ path: 'content/settings.json', content: settingsJson });
    }

    if (Array.isArray(featuredProjectIds)) {
      const currentProjects = await readJsonContent<Project[]>('projects.json', []);
      const updatedProjects = currentProjects.map((p) => ({
        ...p,
        featured: featuredProjectIds.includes(p.id),
      }));
      const projectsJson = JSON.stringify(updatedProjects, null, 2) + '\n';
      changes.push({ path: 'content/projects.json', content: projectsJson });
    }

    if (changes.length > 0) {
      await writeFiles(changes, 'chore(content): update homepage settings and featured projects');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to save homepage data:', err);
    return NextResponse.json(
      { error: (err as Error)?.message || 'Failed to save homepage data' },
      { status: 500 }
    );
  }
}
