import { isEmail } from '../validation';
import { ApiError } from './errors';

export const contact = {
  /** Sends the message to the store (it lands in SalesPoint). */
  async send({ name, email, phone, subject, message, company }: { name: string; email: string; phone?: string; subject: string; message: string; company?: string }) {
    if (!name?.trim()) throw new ApiError('Please enter your name.', { field: 'name' });
    if (!isEmail(email)) throw new ApiError('Please enter a valid email address.', { field: 'email' });
    if ((message || '').trim().length < 10) throw new ApiError('Please write a message of at least 10 characters.', { field: 'message' });
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, subject, message, company }),
    }).catch(() => null);
    if (!res) throw new ApiError('We couldn’t reach the store. Check your connection and try again.');
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data.error ?? 'Could not send your message. Please try again.', { field: data.field ?? undefined });
    return { ok: true };
  },
};
