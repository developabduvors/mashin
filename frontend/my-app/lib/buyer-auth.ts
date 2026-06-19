// Buyer (mijoz) auth — admin'dan BUTUNLAY alohida token store.
// Admin tokeni (abc_admin_token, lib/auth.ts) bilan to'qnashmaydi.

import type { AuthUser, LoginResult } from './types';

const TOKEN_KEY = 'abc_buyer_token';
const USER_KEY = 'abc_buyer_user';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export function getBuyerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getBuyerUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

function persist(data: LoginResult): AuthUser {
  localStorage.setItem(TOKEN_KEY, data.tokens.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

async function authRequest(path: string, body: unknown): Promise<LoginResult> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message ?? 'So\'rov amalga oshmadi');
  }
  return (await res.json()) as LoginResult;
}

export async function registerBuyer(payload: RegisterPayload): Promise<AuthUser> {
  const data = await authRequest('/auth/register', {
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    password: payload.password,
  });
  return persist(data);
}

export async function loginBuyer(email: string, password: string): Promise<AuthUser> {
  // Brauzer autofill email'ni katta harf/bo'sh joy bilan beradi — normallashtiramiz.
  const data = await authRequest('/auth/login', {
    email: email.trim().toLowerCase(),
    password,
  });
  return persist(data);
}

// Profil tahrirlangach saqlangan user'ni yangilaydi (token o'zgarmaydi).
export function persistBuyerUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logoutBuyer(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
