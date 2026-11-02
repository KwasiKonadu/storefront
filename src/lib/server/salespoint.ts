import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'sp_session';
export const SESSION_DAYS = 30;

/** SalesPoint's address, or null when it isn't configured. Server-side only. */
export const salespointBase = () => process.env.SALESPOINT_URL?.replace(/\/$/, '') ?? null;

/** The customer's sign-in token from the httpOnly cookie, as an Authorization header (or nothing). */
export async function authHeader(): Promise<Record<string, string>> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}
