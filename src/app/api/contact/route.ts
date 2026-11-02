import { NextRequest, NextResponse } from 'next/server';
import { authHeader, salespointBase } from '@/lib/server/salespoint';

/** Backend-for-frontend: the contact form posts here and the storefront forwards it to SalesPoint. */
export async function POST(req: NextRequest) {
  const base = salespointBase();
  if (!base) return NextResponse.json({ error: 'SALESPOINT_URL is not set' }, { status: 500 });
  try {
    const res = await fetch(`${base}/api/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeader()), 'x-forwarded-for': req.headers.get('x-forwarded-for') ?? '' },
      body: await req.text(),
      cache: 'no-store',
    });
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'The store is unreachable right now. Please try again.' }, { status: 502 });
  }
}
