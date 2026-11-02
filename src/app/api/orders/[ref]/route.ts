import { NextRequest, NextResponse } from 'next/server';

/** Current state of one order (reference + the phone number on it). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const base = process.env.SALESPOINT_URL;
  if (!base) return NextResponse.json({ error: 'SALESPOINT_URL is not set' }, { status: 500 });
  const { ref } = await params;
  const phone = req.nextUrl.searchParams.get('phone') ?? '';
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/public/orders/${encodeURIComponent(ref)}?phone=${encodeURIComponent(phone)}`, { cache: 'no-store', headers: { 'x-forwarded-for': req.headers.get('x-forwarded-for') ?? '' } });
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'The store is unreachable right now.' }, { status: 502 });
  }
}
