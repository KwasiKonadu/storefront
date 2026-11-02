export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\+?[\d\s()-]{6,}$/;

export const isEmail = (v: string | undefined | null) => EMAIL_RE.test(v ?? '');
export const isPhone = (v: string | undefined | null) => PHONE_RE.test(v ?? '');
export const isStrongPassword = (v: string | undefined | null) =>
  (v ?? '').length >= 8 && /[a-zA-Z]/.test(v ?? '') && /\d/.test(v ?? '');

export const passwordRules = (v: string) => ({
  len: v.length >= 8,
  letter: /[a-zA-Z]/.test(v),
  num: /\d/.test(v),
});
