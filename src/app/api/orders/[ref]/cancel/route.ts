import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const base = process.env.SALESPOINT_URL;
  if (!base) return NextResponse.json({ error: 'SALESPOINT_URL is not set' }, { status: 500 });
  const { ref } = await params;
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/public/orders/${encodeURIComponent(ref)}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': req.headers.get('x-forwarded-for') ?? '' },
      body: await req.text(),
      cache: 'no-store',
    });
    return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
  } catch {
    return NextResponse.json({ error: 'The store is unreachable right now. Please try again.' }, { status: 502 });
  }
}
