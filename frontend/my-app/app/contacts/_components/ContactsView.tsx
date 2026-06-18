'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CityItem, Dealership } from '@/lib/types';

// lat/lng dan Yandex Karta havolasi (RU bozor uchun mosroq).
const mapUrl = (d: Dealership) =>
  d.lat != null && d.lng != null
    ? `https://yandex.ru/maps/?pt=${d.lng},${d.lat}&z=16&l=map`
    : `https://yandex.ru/maps/?text=${encodeURIComponent(d.address)}`;

export const ContactsView = () => {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [city, setCity] = useState<string | undefined>(undefined); // slug
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [loading, setLoading] = useState(true);

  // Shaharlar ro'yxati — bir marta.
  useEffect(() => {
    api.cities.getAll().then((data) => {
      setCities(data);
      const def = data.find((c) => c.isDefault) ?? data[0];
      setCity(def?.slug);
    }).catch(console.error);
  }, []);

  // Tanlangan shahar o'zgarsa — kontaktlarni qayta yuklash.
  useEffect(() => {
    if (cities.length === 0) return; // hali shaharlar kelmagan
    setLoading(true);
    api.contacts
      .get(city)
      .then((res) => setDealerships(res.dealerships))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city, cities.length]);

  return (
    <section className="bg-zinc-50 py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* ===== CITY SWITCHER ===== */}
        <div className="mb-10 flex flex-wrap items-center gap-3">
          <span className="mr-2 text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
            Город
          </span>
          {cities.map((c) => (
            <button
              key={c.id}
              onClick={() => setCity(c.slug)}
              className={`rounded-lg border px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition-all ${
                c.slug === city
                  ? 'border-brand bg-brand text-white shadow-[0_8px_20px_-8px_rgba(193,18,31,0.7)]'
                  : 'border-zinc-200 bg-white text-zinc-900 hover:border-brand hover:text-brand'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* ===== DEALERSHIPS ===== */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-zinc-100" />
            ))}
          </div>
        ) : dealerships.length === 0 ? (
          <div className="py-20 text-center text-lg text-zinc-400">
            В этом городе пока нет автосалонов.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {dealerships.map((d, idx) => (
              <article
                key={d.id}
                className="animate-rise flex flex-col rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-xl"
                style={{ animationDelay: `${Math.min(idx * 80, 480)}ms` }}
              >
                {/* address */}
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-lg font-bold leading-snug text-zinc-900">{d.address}</p>
                </div>

                {/* schedule */}
                {d.schedule && (
                  <div className="mt-5 flex items-center gap-3 text-sm text-zinc-600">
                    <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {d.schedule}
                  </div>
                )}

                {/* phones */}
                {d.phones.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {d.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                        className="flex items-center gap-3 font-display text-lg font-bold tracking-wide text-zinc-900 transition-colors hover:text-brand"
                      >
                        <svg className="h-5 w-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.587 4.587l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {phone}
                      </a>
                    ))}
                  </div>
                )}

                {/* map link */}
                <a
                  href={mapUrl(d)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-bold uppercase tracking-wide text-brand transition-colors hover:text-brand-dark"
                >
                  Показать на карте
                  <span aria-hidden>→</span>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
