import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import { Octokit } from 'octokit';
import { revalidatePath } from 'next/cache';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

interface FileChange {
  /** Path relative to repo root (e.g. "content/projects.json" or "public/uploads/img.webp"). */
  path: string;
  /** UTF-8 string for text files; Buffer for binary. */
  content: string | Buffer;
}

/**
 * Writes one or more files atomically.
 *
 *  - In **production** (when `GITHUB_TOKEN` + `GITHUB_REPO` are set), all
 *    changes are batched into a single commit on GitHub via the Git Data
 *    API. The auto-deploy (Vercel/Netlify) picks them up within ~30s.
 *  - In **development** (no GitHub token), files are written directly to
 *    the local filesystem so changes appear instantly.
 */
export async function writeFiles(
  changes: FileChange[],
  commitMessage: string
): Promise<void> {
  if (changes.length === 0) return;

  const useGithub = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);

  if (useGithub) {
    await commitToGithub(changes, commitMessage);
  } else {
    await writeToLocalFs(changes);
  }

  // Invalidate Next.js page cache so the public site reflects the change
  // on the next request (after the redeploy finishes in production).
  revalidatePath('/', 'layout');
}

/**
 * Convenience helper: read a JSON content file, run a transform, then write
 * it back. The full file is read+written so writes stay atomic.
 */
export async function updateJson<T>(
  fileName: string,
  transform: (current: T) => T,
  fallback: T,
  commitMessage: string
): Promise<T> {
  const filePath = path.join(CONTENT_DIR, fileName);
  let current: T = fallback;
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    current = JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err;
    }
  }

  const next = transform(current);
  const json = JSON.stringify(next, null, 2) + '\n';

  await writeFiles(
    [{ path: `content/${fileName}`, content: json }],
    commitMessage
  );

  return next;
}

// ============================================================
// Local filesystem implementation (development)
// ============================================================

async function writeToLocalFs(changes: FileChange[]): Promise<void> {
  for (const change of changes) {
    const absPath = resolveLocalPath(change.path);
    await fs.mkdir(path.dirname(absPath), { recursive: true });
    if (typeof change.content === 'string') {
      await fs.writeFile(absPath, change.content, 'utf8');
    } else {
      await fs.writeFile(absPath, change.content);
    }
  }
}

function resolveLocalPath(repoPath: string): string {
  if (repoPath.startsWith('content/')) {
    return path.join(CONTENT_DIR, repoPath.slice('content/'.length));
  }
  if (repoPath.startsWith('public/')) {
    return path.join(PUBLIC_DIR, repoPath.slice('public/'.length));
  }
  // Default: resolve relative to repo root
  return path.join(process.cwd(), repoPath);
}

// ============================================================
// GitHub Git Data API implementation (production)
// ============================================================

let cachedOctokit: Octokit | null = null;
function getOctokit(): Octokit {
  if (!cachedOctokit) {
    cachedOctokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }
  return cachedOctokit;
}

function getRepoInfo() {
  const repo = process.env.GITHUB_REPO; // "owner/repo"
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!repo || !repo.includes('/')) {
    throw new Error('GITHUB_REPO must be set in the format "owner/repo"');
  }
  const [owner, name] = repo.split('/');
  return { owner, repo: name, branch };
}

async function commitToGithub(
  changes: FileChange[],
  message: string
): Promise<void> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoInfo();

  // 1. Get current branch HEAD
  const ref = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const baseSha = ref.data.object.sha;

  // 2. Get base tree
  const baseCommit = await octokit.rest.git.getCommit({
    owner,
    repo,
    commit_sha: baseSha,
  });
  const baseTreeSha = baseCommit.data.tree.sha;

  // 3. Create blobs for each file
  const blobs = await Promise.all(
    changes.map(async (change) => {
      const isBuffer = Buffer.isBuffer(change.content);
      const content = isBuffer
        ? (change.content as Buffer).toString('base64')
        : (change.content as string);
      const encoding = isBuffer ? 'base64' : 'utf-8';
      const blob = await octokit.rest.git.createBlob({
        owner,
        repo,
        content,
        encoding,
      });
      return { path: change.path, sha: blob.data.sha };
    })
  );

  // 4. Create new tree based on the base tree, with our blobs
  const tree = await octokit.rest.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: blobs.map((b) => ({
      path: b.path,
      mode: '100644',
      type: 'blob',
      sha: b.sha,
    })),
  });

  // 5. Create commit pointing to the new tree
  const commit = await octokit.rest.git.createCommit({
    owner,
    repo,
    message,
    tree: tree.data.sha,
    parents: [baseSha],
  });

  // 6. Move branch ref forward
  await octokit.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: commit.data.sha,
  });
}
