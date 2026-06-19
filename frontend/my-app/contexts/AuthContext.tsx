'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { api } from '@/lib/api';
import {
  getBuyerToken,
  getBuyerUser,
  loginBuyer,
  registerBuyer,
  logoutBuyer,
  persistBuyerUser,
  type RegisterPayload,
} from '@/lib/buyer-auth';
import type { AuthUser } from '@/lib/types';

interface AuthContextValue {
  user: AuthUser | null;
  favorites: Set<string>;     // saqlangan mashina ID'lari
  ready: boolean;             // mount + dastlabki yuklash tugadimi
  isFavorite: (carId: string) => boolean;
  toggleFavorite: (carId: string) => Promise<void>; // auth talab qiladi
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateUser: (user: AuthUser) => void; // profil tahrirlangach
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  // Saqlangan favorites'ni serverdan yuklaydi (faqat token bo'lsa).
  const loadFavorites = useCallback(async () => {
    try {
      const cars = await api.favorites.list();
      setFavorites(new Set(cars.map((c) => c.id)));
    } catch {
      setFavorites(new Set());
    }
  }, []);

  // Mount: localStorage'dagi sessiyani tiklaydi.
  useEffect(() => {
    const existing = getBuyerUser();
    if (existing && getBuyerToken()) {
      setUser(existing);
      loadFavorites().finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [loadFavorites]);

  const isFavorite = useCallback((carId: string) => favorites.has(carId), [favorites]);

  // Optimistik: avval UI yangilanadi, xato bo'lsa rollback.
  const toggleFavorite = useCallback(
    async (carId: string) => {
      const wasFav = favorites.has(carId);
      setFavorites((prev) => {
        const next = new Set(prev);
        wasFav ? next.delete(carId) : next.add(carId);
        return next;
      });
      try {
        if (wasFav) await api.favorites.remove(carId);
        else await api.favorites.add(carId);
      } catch (e) {
        // rollback
        setFavorites((prev) => {
          const next = new Set(prev);
          wasFav ? next.add(carId) : next.delete(carId);
          return next;
        });
        throw e;
      }
    },
    [favorites],
  );

  const login = useCallback(async (email: string, password: string) => {
    const u = await loginBuyer(email, password);
    setUser(u);
    await loadFavorites();
  }, [loadFavorites]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const u = await registerBuyer(payload);
    setUser(u);
    setFavorites(new Set()); // yangi akkaunt — bo'sh
  }, []);

  // Profil tahrirlangach: context + localStorage'ni yangilaydi.
  const updateUser = useCallback((u: AuthUser) => {
    setUser(u);
    persistBuyerUser(u);
  }, []);

  const logout = useCallback(() => {
    logoutBuyer();
    setUser(null);
    setFavorites(new Set());
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, favorites, ready, isFavorite, toggleFavorite, login, register, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  return ctx;
}
