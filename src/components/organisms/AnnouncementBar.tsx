'use client';

import { useDbReady, useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';

/**
 * Top-of-page line, controlled entirely from SalesPoint ("Announcement bar" card):
 * shown while that card is live, hidden when it is off, scheduled, ended or not set up.
 */
export function AnnouncementBar() {
  const ready = useDbReady();
  const { version } = useStore();
  void version; // re-read after every catalogue refresh
  const text = ready ? api.catalog.slots('announcement')[0]?.title : '';
  if (!text) return null;
  return <div className="announce">{text}</div>;
}
