'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { CreditProgramItem, CreditKind } from '@/lib/types';

// CreditKind → ko'rinadigan ruscha yorliq (badge uchun)
const KIND_LABELS: Record<CreditKind, string> = {
  CREDIT: 'Кредит',
  INSTALLMENT: 'Рассрочка',
  TRADE_IN: 'Trade-in',
  TAXI: 'Для такси',
  SPECIAL: 'Спецпредложение',
};

export const CreditProgramsGrid = () => {
  const [programs, setPrograms] = useState<CreditProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.creditPrograms
      .getAll()
      .then(setPrograms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-zinc-100" />
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-lg text-zinc-400">Программы кредитования скоро появятся.</p>
      </div>
    );
  }

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* editorial section header — hairline rule (sayt bo'ylab takrorlanadigan signature) */}
        <div className="flex items-baseline justify-between border-b border-zinc-900 pb-4">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-zinc-900 md:text-3xl">
            Программы кредитования
          </h2>
          <span className="font-display text-sm font-bold uppercase tracking-wider text-zinc-400">
            {programs.length} программ
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, idx) => (
            <Link
              key={p.id}
              href={`/credit/${p.slug}`}
              className="animate-rise group relative flex flex-col overflow-hidden rounded-3xl bg-zinc-50 ring-1 ring-zinc-100 transition-all hover:-translate-y-1 hover:ring-brand/40 hover:shadow-xl"
              style={{ animationDelay: `${Math.min(idx * 60, 480)}ms` }}
            >
              {/* cover */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200">
                <Image
                  src={p.imageUrl || '/placeholder-credit-hero.jpg'}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* kind badge */}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-900 backdrop-blur">
                  {KIND_LABELS[p.kind] ?? p.kind}
                </span>
                {/* rate badge */}
                {p.ratePercent != null && (
                  <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-sm font-black text-white">
                    от {p.ratePercent}%
                  </span>
                )}
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-zinc-900">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-600">
                    {p.description}
                  </p>
                )}
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand transition-colors group-hover:text-brand-dark">
                  Подробнее и расчёт
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
