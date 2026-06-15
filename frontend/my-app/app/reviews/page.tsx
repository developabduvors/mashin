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

const STATS: [string, string][] = [
  ['12 000+', 'довольных клиентов'],
  ['4.9', 'средний рейтинг'],
  ['98%', 'рекомендуют нас'],
];

export default function ReviewsPage() {
  return (
    <div className="bg-zinc-50">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rotate-12 bg-brand/20 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              Отзывы · ABC Auto
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-8xl">
            Что говорят
            <span className="block text-brand">наши клиенты</span>
          </h1>
          <p className="mt-6 max-w-xl text-zinc-400">
            Тысячи людей доверили нам покупку автомобиля. Делимся честными отзывами —
            без фильтров и накруток.
          </p>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            {STATS.map(([num, label]) => (
              <div key={label} className="flex flex-col">
                <span className="font-display text-2xl font-bold leading-none text-white">{num}</span>
                <span className="mt-1 text-xs uppercase tracking-wider text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS LIST (client) ===== */}
      <ReviewsList />

      {/* ===== CTA + FORM ===== */}
      <section id="zayavka" className="scroll-mt-24 bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl lg:grid-cols-2">
            {/* left: dark promise */}
            <div className="relative overflow-hidden bg-zinc-950 p-10 text-white md:p-12">
              <div className="absolute inset-0 bg-grid opacity-50" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-brand" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
                    Присоединяйтесь
                  </span>
                </div>
                <h2 className="mt-4 text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl">
                  Хотите так же?
                  <span className="block text-brand">начните с заявки</span>
                </h2>
                <p className="mt-6 max-w-sm text-zinc-400">
                  Оставьте телефон — менеджер подберёт автомобиль под ваш бюджет
                  и условия. А свой отзыв вы оставите уже за рулём нового авто.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/cars"
                    className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 font-display text-sm font-bold uppercase italic tracking-wider text-white backdrop-blur-md transition-all hover:bg-white/10"
                  >
                    Смотреть каталог
                  </Link>
                </div>
              </div>
            </div>

            {/* right: form */}
            <div className="bg-white p-10 md:p-12">
              <LeadForm
                type="CALLBACK"
                title="Получить консультацию"
                subtitle="Заполните форму — мы перезвоним и подберём для вас автомобиль."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
