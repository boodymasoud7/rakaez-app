import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { Octokit } from 'octokit';

export interface MediaFileEntry {
  /** Path relative to repo root, e.g. "public/uploads/projects/2026/01/abc.webp". */
  path: string;
  /** Public URL the file is served at, e.g. "/uploads/projects/2026/01/abc.webp". */
  url: string;
  name: string;
  size: number;
  modifiedAt: string | null;
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ROOT_REL = 'public/uploads';

/**
 * Walks the uploads tree and returns a flat list of files. Uses the local
 * filesystem in development, and the GitHub Trees API in production so
 * the same data shape is returned in both modes.
 */
export async function listMedia(): Promise<MediaFileEntry[]> {
  const useGithub = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
  if (useGithub) return listMediaFromGithub();
  return listMediaFromLocal();
}

async function listMediaFromLocal(): Promise<MediaFileEntry[]> {
  const baseDir = path.join(PUBLIC_DIR, 'uploads');
  const entries: MediaFileEntry[] = [];

  async function walk(dir: string, relParts: string[]): Promise<void> {
    let dirents;
    try {
      dirents = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return;
      throw err;
    }
    for (const dirent of dirents) {
      const full = path.join(dir, dirent.name);
      const next = [...relParts, dirent.name];
      if (dirent.isDirectory()) {
        await walk(full, next);
      } else if (dirent.isFile()) {
        const stat = await fs.stat(full);
        const repoPath = `${ROOT_REL}/${next.join('/')}`;
        entries.push({
          path: repoPath,
          url: `/uploads/${next.join('/')}`,
          name: dirent.name,
          size: stat.size,
          modifiedAt: stat.mtime.toISOString(),
        });
      }
    }
  }

  await walk(baseDir, []);
  return entries.sort((a, b) =>
    (b.modifiedAt || '').localeCompare(a.modifiedAt || '')
  );
}

async function listMediaFromGithub(): Promise<MediaFileEntry[]> {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const repoEnv = process.env.GITHUB_REPO!;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const [owner, repo] = repoEnv.split('/');

  // Get the tree SHA for the branch's HEAD commit
  const ref = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const commit = await octokit.rest.git.getCommit({
    owner,
    repo,
    commit_sha: ref.data.object.sha,
  });
  const tree = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: commit.data.tree.sha,
    recursive: 'true',
  });

  const entries: MediaFileEntry[] = [];
  for (const item of tree.data.tree) {
    if (item.type !== 'blob' || !item.path) continue;
    if (!item.path.startsWith(`${ROOT_REL}/`)) continue;
    const relUrl = item.path.slice('public'.length);
    const name = item.path.split('/').pop() || item.path;
    entries.push({
      path: item.path,
      url: relUrl,
      name,
      size: item.size || 0,
      modifiedAt: null, // Trees API doesn't include mtime
    });
  }

  return entries;
}
