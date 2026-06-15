import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/shared/LeadForm';

export const metadata: Metadata = {
  title: 'Trade-in — обмен автомобиля с выгодой | ABC AUTO',
  description:
    'Сдайте свой автомобиль в Trade-in и получите новый с минимальной доплатой. Бесплатная оценка за 15 минут.',
};

const STEPS = [
  { n: '01', title: 'Заявка', text: 'Оставьте заявку онлайн или приезжайте в салон в удобное время.' },
  { n: '02', title: 'Оценка', text: 'Эксперт бесплатно оценит ваш автомобиль за 15 минут.' },
  { n: '03', title: 'Предложение', text: 'Фиксируем цену и подбираем новое авто под ваш бюджет.' },
  { n: '04', title: 'Сделка', text: 'Доплачиваете разницу — и уезжаете на новом автомобиле.' },
];

const BENEFITS = [
  {
    title: 'Оценка за 15 минут',
    text: 'Быстрая и бесплатная диагностика без очередей.',
    path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Честная рыночная цена',
    text: 'Прозрачная оценка по реальной стоимости авто.',
    path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Зачёт в счёт нового',
    text: 'Стоимость вашего авто идёт в счёт покупки.',
    path: 'M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4',
  },
  {
    title: 'Все документы — на нас',
    text: 'Берём оформление и переоформление на себя.',
    path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
];

export default function TradeInPage() {
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
              Trade-in · ABC Auto
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-8xl">
            Обмен авто
            <span className="block text-brand">с выгодой</span>
          </h1>
          <p className="mt-6 max-w-xl text-zinc-400">
            Сдайте свой автомобиль и пересаживайтесь на новый с минимальной доплатой.
            Бесплатная оценка за 15 минут — без скрытых условий.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#zayavka"
              className="rounded-lg bg-brand px-8 py-4 font-display text-sm font-bold uppercase italic tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(193,18,31,0.8)] transition-all hover:bg-brand-dark active:scale-95"
            >
              Оценить мой автомобиль
            </Link>
            <Link
              href="/cars"
              className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 font-display text-sm font-bold uppercase italic tracking-wider text-white backdrop-blur-md transition-all hover:bg-white/10"
            >
              Каталог авто
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            {[
              ['15 мин', 'оценка авто'],
              ['0 ₽', 'за диагностику'],
              ['до 300 000 ₽', 'дополнительная выгода'],
            ].map(([num, label]) => (
              <div key={label} className="flex flex-col">
                <span className="font-display text-2xl font-bold leading-none text-white">{num}</span>
                <span className="mt-1 text-xs uppercase tracking-wider text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STEPS ===== */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              Как это работает
            </span>
          </div>
          <h2 className="mt-4 text-4xl font-bold uppercase tracking-tight text-zinc-900 md:text-5xl">
            Четыре шага до нового авто
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition-all hover:border-brand hover:shadow-lg"
              >
                <span className="font-display text-5xl font-bold text-zinc-200 transition-colors group-hover:text-brand/30">
                  {s.n}
                </span>
                <h3 className="mt-4 text-xl font-bold uppercase tracking-tight text-zinc-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="bg-zinc-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold uppercase tracking-tight text-zinc-900 md:text-5xl">
            Почему <span className="text-brand">ABC Auto</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.path} />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-bold uppercase tracking-tight text-zinc-900">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                    Заявка на оценку
                  </span>
                </div>
                <h2 className="mt-4 text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl">
                  Узнайте цену
                  <span className="block text-brand">своего авто</span>
                </h2>
                <p className="mt-6 max-w-sm text-zinc-400">
                  Оставьте телефон — менеджер свяжется с вами в течение 15 минут,
                  проведёт оценку и предложит варианты обмена.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                  {['Бесплатная оценка', 'Без обязательств', 'Честная рыночная цена'].map((li) => (
                    <li key={li} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                        ✓
                      </span>
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* right: form */}
            <div className="bg-white p-10 md:p-12">
              <LeadForm
                type="CALLBACK"
                title="Оценить автомобиль"
                subtitle="Заполните форму — мы перезвоним и назовём цену вашего авто."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
