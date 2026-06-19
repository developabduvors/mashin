'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ReviewItem } from '@/lib/types';
import { ReviewForm } from './ReviewForm';

// 5 ta yulduz — to'ldirilgan/bo'sh holatda
const Stars = ({ value = 5 }: { value?: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`h-4 w-4 ${i < value ? 'text-yellow-400' : 'text-zinc-200'}`}
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

  // Yangi yozilgan otziv ro'yxat boshiga (eng yangi) qo'shiladi.
  const handleCreated = (review: ReviewItem) =>
    setReviews((prev) => [review, ...prev]);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Otziv yozish formasi (login bo'lsa) / kirishga taklif */}
        <div className="mx-auto mb-14 max-w-2xl">
          <ReviewForm onCreated={handleCreated} />
        </div>

        {loading ? (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="mb-6 animate-pulse rounded-2xl bg-zinc-100"
                style={{ height: `${180 + (i % 3) * 50}px` }}
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-zinc-400">Пока нет отзывов. Станьте первым!</p>
          </div>
        ) : (
          <>
            {/* editorial section header — hairline rule, not a stat card */}
            <div className="flex items-baseline justify-between border-b border-zinc-900 pb-4">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-zinc-900 md:text-3xl">
                Реальные истории
              </h2>
              <span className="font-display text-sm font-bold uppercase tracking-wider text-zinc-400">
                {reviews.length} отзывов
              </span>
            </div>

            {/* masonry wall — varied heights via CSS columns */}
            <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
              {reviews.map((review, idx) => (
            <article
              key={review.id}
              className="animate-rise mb-6 break-inside-avoid rounded-2xl bg-zinc-50 p-7 ring-1 ring-zinc-100 transition-colors hover:ring-brand/40"
              style={{ animationDelay: `${Math.min(idx * 60, 480)}ms` }}
            >
              {/* small red quote accent — the editorial signature, repeated small */}
              <span aria-hidden className="font-display text-5xl leading-none text-brand/25">
                &ldquo;
              </span>
              <p className="-mt-3 text-[15px] leading-relaxed text-zinc-700">
                {review.text}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-200/70 pt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-black text-white">
                    {review.author.trim().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{review.author}</div>
                    <div className="text-xs text-zinc-400">{review.source || 'Покупатель'}</div>
                  </div>
                </div>
                <Stars value={review.rating || 5} />
              </div>
            </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
