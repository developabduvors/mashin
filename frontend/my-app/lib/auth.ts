// Admin-only ichki vosita — token localStorage'da saqlanadi.
// (Mijoz sayti auth ishlatmaydi; bu faqat /admin uchun.)

const TOKEN_KEY = 'abc_admin_token';
const USER_KEY = 'abc_admin_user';

import type { AuthUser, LoginResult } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function isAuthed(): boolean {
  return !!getToken();
}

// Login: token + user'ni saqlaydi. Faqat ADMIN kira oladi (boshqa rol → xato).
export async function login(email: string, password: string): Promise<AuthUser> {
  // Brauzer autofill ko'pincha email'ni katta harf bilan boshlaydi yoki bo'sh
  // joy qo'shadi — backend aniq mos kelishni kutadi, shuning uchun normallashtiramiz.
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? 'Kirish amalga oshmadi');
  }

  const data = (await res.json()) as LoginResult;
  if (data.user.role !== 'ADMIN') {
    throw new Error('Bu akkaunt admin emas — kirish taqiqlangan');
  }

  localStorage.setItem(TOKEN_KEY, data.tokens.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

// Mavjud (buyer) sessiyadan admin sessiyasini o'rnatadi — ADMIN rolli foydalanuvchi
// oddiy /login orqali kirsa, qayta so'rovsiz admin panelга kira oladi. Token bir xil
// (JWT'da role bor), shuning uchun uni admin kalit ostiga ham yozamiz.
export function setAdminSession(user: AuthUser, accessToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
