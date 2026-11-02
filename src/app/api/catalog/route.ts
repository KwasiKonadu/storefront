import { NextResponse } from 'next/server';

/**
 * Backend-for-frontend: the browser asks the storefront, the storefront asks
 * SalesPoint. Keeps the SalesPoint address server-side and avoids CORS.
 */
export async function GET() {
  const base = process.env.SALESPOINT_URL;
  if (!base) return NextResponse.json({ error: 'SALESPOINT_URL is not set' }, { status: 500 });
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/public/catalog`, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ error: 'Catalogue unavailable' }, { status: 502 });
    return NextResponse.json(await res.json(), { headers: { 'Cache-Control': 'public, max-age=30' } });
  } catch {
    return NextResponse.json({ error: 'Catalogue unavailable' }, { status: 502 });
  }
}
