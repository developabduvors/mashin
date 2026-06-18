import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/shared/LeadForm';
import { ReviewsList } from './_components/ReviewsList';

export const metadata: Metadata = {
  title: 'Отзывы клиентов | ABC AUTO',
  description:
    'Реальные отзывы клиентов автосалона ABC AUTO о покупке автомобилей, автокредите и trade-in. Узнайте, почему нам доверяют.',
};

export default function ReviewsPage() {
  return (
    <div className="bg-white">
      {/* ===== HERO — editorial pull-quote ===== */}
      <section className="relative overflow-hidden border-b border-zinc-200">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            {/* featured quote */}
            <figure className="relative">
              {/* oversized signature quote mark */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-2 -top-16 select-none font-display text-[12rem] leading-none text-brand/15 md:-top-24 md:text-[18rem]"
              >
                &ldquo;
              </span>
              <div className="relative">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
                  Отзывы клиентов
                </span>
                <blockquote className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-zinc-900 md:text-6xl">
                  Думал, обмен старого авто — это головная боль. Уехал на новом за один день.
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-lg font-black text-white">
                    А
                  </span>
                  <div>
                    <div className="font-bold text-zinc-900">Алексей Морозов</div>
                    <div className="text-sm text-zinc-400">Купил Toyota Camry · Trade-in</div>
                  </div>
                </figcaption>
              </div>
            </figure>

            {/* rating badge — vertical, editorial */}
            <div className="flex shrink-0 flex-row gap-8 lg:flex-col lg:gap-6 lg:border-l lg:border-zinc-200 lg:pl-10">
              <div>
                <div className="font-display text-6xl font-bold leading-none text-brand md:text-7xl">4.9</div>
                <div className="mt-2 flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="lg:border-t lg:border-zinc-200 lg:pt-6">
                <div className="font-display text-4xl font-bold leading-none text-zinc-900">12 000+</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-zinc-400">довольных клиентов</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS WALL (client) ===== */}
      <ReviewsList />

      {/* ===== CTA — single centered band ===== */}
      <section id="zayavka" className="scroll-mt-24 border-t border-zinc-200 bg-zinc-50 py-20">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-4xl font-bold uppercase tracking-tight text-zinc-900 md:text-5xl">
            Свой отзыв вы оставите <span className="text-brand">за рулём</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-zinc-600">
            Оставьте телефон — менеджер подберёт автомобиль под ваш бюджет и условия.
          </p>
          <div className="mx-auto mt-10 max-w-md rounded-3xl border border-zinc-200 bg-white shadow-xl">
            <LeadForm
              type="CALLBACK"
              title="Получить консультацию"
              subtitle="Мы перезвоним и подберём для вас автомобиль."
            />
          </div>
          <Link href="/cars" className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand transition-colors hover:text-brand-dark">
            Смотреть каталог
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
