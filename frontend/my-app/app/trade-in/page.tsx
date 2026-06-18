import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/shared/LeadForm';
import { ValueEstimator } from './_components/ValueEstimator';

export const metadata: Metadata = {
  title: 'Trade-in — обмен автомобиля с выгодой | ABC AUTO',
  description:
    'Сдайте свой автомобиль в Trade-in и получите новый с минимальной доплатой. Бесплатная оценка за 15 минут.',
};

const STEPS = [
  { n: '01', title: 'Заявка', text: 'Оставьте онлайн-заявку или приезжайте в салон в удобное время.' },
  { n: '02', title: 'Оценка', text: 'Эксперт бесплатно осмотрит и оценит ваш автомобиль за 15 минут.' },
  { n: '03', title: 'Предложение', text: 'Фиксируем цену и подбираем новое авто под ваш бюджет.' },
  { n: '04', title: 'Сделка', text: 'Доплачиваете разницу — и уезжаете на новом автомобиле.' },
];

export default function TradeInPage() {
  return (
    <div className="bg-white">
      {/* ===== HERO — light blueprint, estimator on the right ===== */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div className="absolute inset-0 bg-grid-light" />
        <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
        <div className="container relative mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1fr_auto]">
          {/* left: thesis */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
                Trade-in
              </span>
            </div>
            <h1 className="mt-5 max-w-2xl text-5xl font-bold uppercase leading-[0.92] tracking-tight text-zinc-900 md:text-7xl">
              Узнайте, сколько
              <span className="block">стоит ваше авто</span>
              <span className="mt-1 block text-brand">прямо сейчас</span>
            </h1>
            <p className="mt-6 max-w-md text-zinc-600">
              Подвиньте ползунки — и увидите предварительную стоимость в зачёт нового
              автомобиля. Без звонков и регистрации.
            </p>

            {/* inline trust ledger */}
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {[
                ['15 мин', 'на оценку'],
                ['0 ₽', 'диагностика'],
                ['до 300 000 ₽', 'доп. выгода'],
              ].map(([num, label]) => (
                <div key={label} className="border-l-2 border-brand pl-3">
                  <dt className="font-display text-2xl font-bold leading-none text-zinc-900">{num}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-zinc-400">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* right: signature estimator */}
          <div className="w-full lg:w-[380px]">
            <ValueEstimator />
          </div>
        </div>
      </section>

      {/* ===== PROCESS — connected track (real sequence) ===== */}
      <section className="bg-zinc-950 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              Маршрут сделки
            </span>
          </div>
          <h2 className="mt-4 max-w-2xl text-4xl font-bold uppercase tracking-tight md:text-5xl">
            От заявки до ключей — четыре шага
          </h2>

          <ol className="relative mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* connecting rail */}
            <span className="absolute left-0 top-3 hidden h-px w-full bg-gradient-to-r from-brand via-zinc-700 to-zinc-800 lg:block" />
            {STEPS.map((s) => (
              <li key={s.n} className="relative lg:pr-8">
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-brand font-display text-xs font-bold text-white ring-4 ring-zinc-950">
                  {s.n}
                </span>
                <h3 className="mt-5 text-xl font-bold uppercase tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== CTA + FORM — light, paired with estimator promise ===== */}
      <section id="zayavka" className="scroll-mt-24 bg-white py-20">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold uppercase leading-none tracking-tight text-zinc-900 md:text-5xl">
              Готовы к точной
              <span className="block text-brand">оценке?</span>
            </h2>
            <p className="mt-6 max-w-md text-zinc-600">
              Калькулятор даёт ориентир. Чтобы зафиксировать реальную цену, оставьте телефон —
              эксперт осмотрит авто и назовёт сумму за 15 минут.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-zinc-700">
              {['Бесплатная оценка', 'Без обязательств', 'Честная рыночная цена', 'Документы оформляем сами'].map((li) => (
                <li key={li} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                    ✓
                  </span>
                  {li}
                </li>
              ))}
            </ul>
            <Link href="/cars" className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand transition-colors hover:text-brand-dark">
              Смотреть каталог авто
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 shadow-xl">
            <LeadForm
              type="CALLBACK"
              title="Оценить автомобиль"
              subtitle="Заполните форму — мы перезвоним и назовём цену вашего авто."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
