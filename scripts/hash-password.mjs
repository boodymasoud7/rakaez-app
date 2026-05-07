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

console.log('\nPassword hash:');
console.log(hash);
console.log('\nExample ADMIN_USERS env value:');
console.log(
  JSON.stringify([
    {
      email: 'admin@rakaez.com',
      passwordHash: hash,
      name: 'Admin',
      role: 'admin',
    },
  ])
);
console.log('');
