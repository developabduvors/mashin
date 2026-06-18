'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CityItem } from '@/lib/types';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/cars', label: 'Каталог' },
  { href: '/credit', label: 'Автокредит' },
  { href: '/trade-in', label: 'Trade-in' },
  { href: '/reviews', label: 'Отзывы' },
  { href: '/contacts', label: 'Контакты' },
];

export const Header = () => {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('moskva');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.cities.getAll().then((data) => {
      setCities(data);
      const def = data.find((c) => c.isDefault);
      if (def) setSelectedCity(def.slug);
    }).catch(console.error);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* ===== TOP BAR (dark) ===== */}
      <div className="bg-zinc-950 text-[13px] text-zinc-400">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="cursor-pointer bg-transparent font-bold text-white focus:outline-none [&>option]:bg-zinc-900 [&>option]:text-white"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.slug}>{city.name}</option>
                ))}
                {cities.length === 0 && <option value="moskva">Москва</option>}
              </select>
            </div>
            <span className="hidden items-center gap-1.5 sm:flex">
              <svg className="h-4 w-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              ул. Автозаводская, 23/15
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden items-center gap-1.5 md:flex">
              <svg className="h-4 w-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ежедневно: 09:00 — 21:00
            </span>
            <a href="tel:+78005553535" className="flex items-center gap-1.5 font-display font-bold tracking-wide text-white transition-colors hover:text-brand">
              <svg className="h-4 w-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.587 4.587l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +7 (800) 555-35-35
            </a>
          </div>
        </div>
      </div>

      {/* ===== MAIN NAV ===== */}
      <div className="border-b border-zinc-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <span className="font-display text-3xl font-bold italic uppercase leading-none tracking-tight text-brand">
                ABC<span className="text-zinc-900">AUTO</span>
              </span>
              <span className="hidden h-9 w-px bg-zinc-200 sm:block" />
              <span className="hidden text-[10px] font-bold uppercase leading-tight tracking-wider text-zinc-400 sm:block">
                Федеральная сеть<br />автосалонов
              </span>
            </Link>

            <nav className="hidden lg:block">
              <ul className="flex items-center gap-7 font-display text-sm font-semibold uppercase tracking-wide text-zinc-900">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="group relative transition-colors hover:text-brand">
                      {item.label}
                      <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-brand transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden items-center gap-2 font-semibold text-zinc-900 transition-colors hover:text-brand xl:flex">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">Избранное</span>
            </button>

            <a
              href="tel:+78005553535"
              className="hidden rounded-lg bg-brand px-6 py-3 font-display text-[13px] font-bold uppercase italic tracking-wider text-white shadow-[0_8px_20px_-8px_rgba(193,18,31,0.7)] transition-all hover:bg-brand-dark active:scale-95 sm:block"
            >
              Заказать звонок
            </a>

            {/* mobile toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Меню"
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-brand lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ===== MOBILE MENU ===== */}
        <div
          className={cn(
            'overflow-hidden border-t border-zinc-100 bg-white transition-[max-height] duration-300 ease-out lg:hidden',
            menuOpen ? 'max-h-96' : 'max-h-0',
          )}
        >
          <nav className="container mx-auto px-4 py-2">
            <ul className="flex flex-col font-display text-base font-semibold uppercase tracking-wide text-zinc-900">
              {NAV.map((item) => (
                <li key={item.href} className="border-b border-zinc-100 last:border-0">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 transition-colors hover:text-brand"
                  >
                    {item.label}
                    <span className="text-brand">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href="tel:+78005553535"
              className="my-3 block rounded-lg bg-brand py-3 text-center font-display text-sm font-bold uppercase italic tracking-wider text-white"
            >
              Заказать звонок
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
