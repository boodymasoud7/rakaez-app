#!/usr/bin/env node
/**
 * Generate a bcrypt hash for an admin password.
 *
 * Usage:
 *   node scripts/hash-password.mjs "MyPassword123"
 *
 * Copy the printed hash into your ADMIN_USERS env var.
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs <password>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters long.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

const jsonValue = JSON.stringify([
  {
    email: 'admin@rakaez.com',
    passwordHash: hash,
    name: 'Admin',
    role: 'admin',
  },
]);

// dotenv (and Next.js's @next/env) treats $XYZ in env values as variable
// references and will silently strip unknown vars. Bcrypt hashes always
// contain $ characters (e.g. "$2b$12$..."), so we escape every $ with \
// to keep the hash intact when the value is loaded.
const escapedForEnv = jsonValue.replace(/\$/g, '\\$');

console.log('\nPassword hash:');
console.log(hash);
console.log('\nLine to paste into .env.local / Vercel env (do NOT escape on Vercel):');
console.log(`ADMIN_USERS=${escapedForEnv}`);
console.log('\nFor Vercel / hosts that don\'t need escaping, paste this raw JSON instead:');
console.log(jsonValue);
console.log('');
