import { NextResponse } from 'next/server';

/**
 * Backend-for-frontend: the browser asks the storefront, the storefront asks
 * SalesPoint. Keeps the SalesPoint address server-side and avoids CORS.
 * When it can't be reached the reply says why (and the host's logs do too), so a bad setup is easy to find.
 */
export async function GET() {
  const base = process.env.SALESPOINT_URL;
  if (!base) {
    console.error('Catalogue: SALESPOINT_URL is not set on the storefront.');
    return NextResponse.json({ error: 'Catalogue unavailable', reason: 'SALESPOINT_URL is not set' }, { status: 500 });
  }
  const url = `${base.replace(/\/$/, '')}/api/public/catalog`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const reason =
        res.status === 404
          ? 'SalesPoint has no /api/public/catalog — it is running an older version, or SALESPOINT_URL points at the wrong site'
          : `SalesPoint answered ${res.status}`;
      console.error(`Catalogue: ${reason} (${url})`);
      return NextResponse.json({ error: 'Catalogue unavailable', reason, status: res.status }, { status: 502 });
    }
    return NextResponse.json(await res.json(), { headers: { 'Cache-Control': 'public, max-age=30' } });
  } catch (e) {
    const reason = `Could not reach SalesPoint at ${base} (${e instanceof Error ? e.message : 'network error'})`;
    console.error(`Catalogue: ${reason}`);
    return NextResponse.json({ error: 'Catalogue unavailable', reason }, { status: 502 });
  }
}
