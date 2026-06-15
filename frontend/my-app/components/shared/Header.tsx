'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { CityItem } from '@/lib/types';

export const Header = () => {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('moskva');

  useEffect(() => {
    api.cities.getAll().then((data) => {
      setCities(data);
      const defaultCity = data.find(c => c.isDefault);
      if (defaultCity) setSelectedCity(defaultCity.slug);
    }).catch(console.error);
  }, []);

  return (
    <header className="w-full bg-white z-50">
      {/* Top Bar */}
      <div className="border-b border-zinc-100 bg-zinc-50 py-2.5">
        <div className="container mx-auto flex items-center justify-between px-4 text-[13px] text-zinc-600">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#C1121F] transition-colors">
              <svg className="h-4 w-4 text-[#C1121F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-bold text-zinc-900 focus:outline-none cursor-pointer"
              >
                {cities.map(city => (
                  <option key={city.id} value={city.slug}>{city.name}</option>
                ))}
                {cities.length === 0 && <option value="moskva">Москва</option>}
              </select>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>ул. Автозаводская, 23/15</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1.5">
              <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ежедневно: 09:00 — 21:00</span>
            </div>
            <a href="tel:+78005553535" className="flex items-center gap-1.5 font-black text-zinc-900 hover:text-[#C1121F] transition-colors">
              <svg className="h-4 w-4 text-[#C1121F]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.587 4.587l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +7 (800) 555-35-35
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Nav */}
      <div className="container mx-auto flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-3xl font-black italic tracking-tighter text-[#C1121F] leading-none">ABC AUTO</div>
            <div className="hidden h-10 w-[1.5px] bg-zinc-200 sm:block" />
            <div className="hidden text-[11px] font-bold leading-[1.2] text-zinc-400 sm:block uppercase tracking-wider">
              Федеральная сеть<br />автосалонов
            </div>
          </Link>

          <nav className="hidden lg:block ml-4">
            <ul className="flex items-center gap-7 text-[14px] font-extrabold uppercase tracking-[0.05em] text-zinc-900">
              <li><Link href="/cars" className="hover:text-[#C1121F] transition-colors relative group">Каталог<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C1121F] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/credit" className="hover:text-[#C1121F] transition-colors relative group">Автокредит<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C1121F] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/trade-in" className="hover:text-[#C1121F] transition-colors relative group">Trade-in<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C1121F] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/reviews" className="hover:text-[#C1121F] transition-colors relative group">Отзывы<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C1121F] transition-all group-hover:w-full"></span></Link></li>
              <li><Link href="/contacts" className="hover:text-[#C1121F] transition-colors relative group">Контакты<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C1121F] transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center gap-5">
          <button className="hidden xl:flex items-center gap-2 text-zinc-900 font-bold hover:text-[#C1121F] transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">Избранное</span>
          </button>
          
          <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors lg:hidden">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <button className="hidden rounded-xl bg-[#C1121F] px-6 py-3 text-[13px] font-black text-white transition-all hover:bg-[#A00F19] hover:shadow-lg active:scale-95 sm:block uppercase italic tracking-wider">
            Заказать звонок
          </button>
        </div>
      </div>
    </header>
  );
};
