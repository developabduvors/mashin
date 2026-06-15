'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { ReviewItem } from '@/lib/types';

// 5 ta yulduz — to'ldirilgan/bo'sh holatda
const Stars = ({ value = 5, size = 'h-4 w-4' }: { value?: number; size?: string }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`${size} ${i < value ? 'text-yellow-400' : 'text-zinc-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export const ReviewsList = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reviews
      .getAll()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // O'rtacha reyting va statistika — bir marta hisoblanadi
  const avg = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  if (loading) {
    return (
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-20 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-zinc-100" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-lg text-zinc-400">Пока нет отзывов. Станьте первым!</p>
      </div>
    );
  }

  return (
    <section className="bg-zinc-50 py-20">
      <div className="container mx-auto px-4">
        {/* ===== AGGREGATE STAT BAR ===== */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:p-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
                Реальные отзывы
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-bold uppercase tracking-tight text-zinc-900 md:text-4xl">
              Нам доверяют
            </h2>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="font-display text-5xl font-bold leading-none text-brand">
                {avg.toFixed(1)}
              </span>
              <div className="mt-2">
                <Stars value={Math.round(avg)} />
              </div>
            </div>
            <div className="h-12 w-px bg-zinc-200" />
            <div className="flex flex-col">
              <span className="font-display text-5xl font-bold leading-none text-zinc-900">
                {reviews.length}
              </span>
              <span className="mt-2 text-xs uppercase tracking-wider text-zinc-400">
                отзывов
              </span>
            </div>
          </div>
        </div>

        {/* ===== REVIEWS GRID ===== */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, idx) => (
            <article
              key={review.id}
              className="animate-rise group flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand hover:shadow-xl"
              style={{ animationDelay: `${Math.min(idx * 60, 480)}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Foto yo'q — ism bosh harfidan avatar */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand text-lg font-black text-white">
                    {review.author.trim().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900">{review.author}</h3>
                    <p className="text-xs text-zinc-400">{review.source || 'Покупатель'}</p>
                  </div>
                </div>
                {/* Dekorativ qo'shtirnoq */}
                <span className="font-display text-6xl leading-none text-zinc-100 transition-colors group-hover:text-brand/15">
                  &rdquo;
                </span>
              </div>

              <p className="mt-5 flex-1 text-sm leading-relaxed text-zinc-600">
                {review.text}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                <Stars value={review.rating || 5} />
                <span className="text-xs font-bold text-zinc-400">
                  {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
