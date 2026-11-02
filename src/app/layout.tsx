import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';
import { AppProviders, SiteLayout } from '@/components/templates';
import '@/styles/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  let name = '';
  try {
    const base = process.env.SALESPOINT_URL?.replace(/\/$/, '');
    if (base) name = (await (await fetch(`${base}/api/public/catalog`, { next: { revalidate: 60 } })).json()).store?.name ?? '';
  } catch { /* fall back to a plain title */ }
  return {
    title: name ? `${name} — Home & Living` : 'Home & Living',
    description: `${name || 'Our store'} — kitchen, table and home objects made from honest materials. Browse, order, and reorder with ease.`,
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        />
      </head>
      <body>
        <AppProviders>
          {/* useSearchParams in the chrome/pages needs a Suspense boundary for static prerendering */}
          <Suspense fallback={null}>
            <SiteLayout>{children}</SiteLayout>
          </Suspense>
        </AppProviders>
      </body>
    </html>
  );
}
