import type { SessionOptions } from 'iron-session';

export interface SessionData {
  email?: string;
  name?: string;
  role?: 'admin' | 'editor';
  loggedInAt?: number;
}

export const SESSION_COOKIE_NAME = 'rakaez-session';

export function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      'SESSION_SECRET env var must be set and at least 32 characters long.'
    );
  }
  return {
    password,
    cookieName: SESSION_COOKIE_NAME,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}
