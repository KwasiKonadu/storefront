/** Salted, iterated SHA-256 (PBKDF-style). Demo-grade — a real backend should use argon2/bcrypt server-side. */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const subtle = typeof crypto !== 'undefined' ? crypto.subtle : undefined;
  if (subtle) {
    let buf: Uint8Array<ArrayBuffer> = new TextEncoder().encode(`mp1:${salt}:${password}`);
    for (let i = 0; i < 300; i++) buf = new Uint8Array(await subtle.digest('SHA-256', buf));
    return 'pbk1$' + [...buf].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // fallback for non-secure contexts (plain http on a LAN address)
  let h1 = 0x811c9dc5;
  let h2 = 0x1000193;
  const s = `${salt}::${password}`;
  for (let i = 0; i < s.length; i++) {
    h1 = Math.imul(h1 ^ s.charCodeAt(i), 16777619) >>> 0;
    h2 = Math.imul(h2 + s.charCodeAt(i) * 31, 2246822519) >>> 0;
  }
  return 'fbk1$' + h1.toString(16) + h2.toString(16);
}
