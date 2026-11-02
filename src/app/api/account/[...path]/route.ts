import { NextRequest, NextResponse } from 'next/server';
import { authHeader, clearSessionCookie, salespointBase, setSessionCookie } from '@/lib/server/salespoint';

/**
 * Backend-for-frontend for customer accounts. The browser only ever talks to this route; the sign-in token lives
 * in an httpOnly cookie that scripts on the page cannot read, and is attached to the call to SalesPoint here.
 */
async function forward(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const route = path.join('/');

  if (route === 'logout') {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  }

  const base = salespointBase();
  if (!base) return NextResponse.json({ error: 'SALESPOINT_URL is not set' }, { status: 500 });

  const hasBody = req.method !== 'GET' && req.method !== 'DELETE';
  try {
    const res = await fetch(`${base}/api/public/account/${route}`, {
      method: req.method,
      headers: { ...(hasBody ? { 'Content-Type': 'application/json' } : {}), ...(await authHeader()), 'x-forwarded-for': req.headers.get('x-forwarded-for') ?? '' },
      body: hasBody ? await req.text() : undefined,
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));

    // Sign-in, sign-up and password change hand back a token: keep it in the cookie, not in the page.
    if (res.ok && typeof data.token === 'string') {
      await setSessionCookie(data.token);
      delete data.token;
    }
    // A rejected token means the cookie is stale; drop it.
    if (res.status === 401 && route === 'me') await clearSessionCookie();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'The store is unreachable right now. Please try again.' }, { status: 502 });
  }
}

export { forward as GET, forward as POST, forward as PUT, forward as DELETE };
