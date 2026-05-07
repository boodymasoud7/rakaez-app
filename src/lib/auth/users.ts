import 'server-only';
import bcrypt from 'bcryptjs';

export interface AdminUser {
  email: string;
  passwordHash: string;
  name?: string;
  role?: 'admin' | 'editor';
}

/**
 * Loads the list of admin users from the `ADMIN_USERS` env var. The env var
 * must be a JSON array of objects, e.g.
 *
 *   ADMIN_USERS='[{"email":"admin@rakaez.com","passwordHash":"$2a$10$...","name":"Admin","role":"admin"}]'
 *
 * Use `scripts/hash-password.mjs` to generate a hash for a new password.
 */
export function getAdminUsers(): AdminUser[] {
  const raw = process.env.ADMIN_USERS;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u): u is AdminUser =>
        typeof u === 'object' &&
        u !== null &&
        typeof u.email === 'string' &&
        typeof u.passwordHash === 'string'
    );
  } catch (err) {
    console.error('[auth] Failed to parse ADMIN_USERS env var:', err);
    return [];
  }
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<AdminUser | null> {
  if (!email || !password) return null;
  const users = getAdminUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) {
    // Run a dummy compare to avoid timing attacks revealing user existence
    await bcrypt.compare(
      password,
      '$2a$10$DUMMY.HASH.TO.AVOID.TIMING.ATTACK.AAAAAAAAAAAAAAAAAAAA'
    );
    return null;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}
