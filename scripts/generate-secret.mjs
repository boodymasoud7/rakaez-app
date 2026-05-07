#!/usr/bin/env node
/**
 * Generate a cryptographically random 64-char string suitable for the
 * SESSION_SECRET env var.
 *
 *   node scripts/generate-secret.mjs
 */

import { randomBytes } from 'node:crypto';

const secret = randomBytes(48).toString('base64').replace(/[+/=]/g, '').slice(0, 64);
console.log(secret);
