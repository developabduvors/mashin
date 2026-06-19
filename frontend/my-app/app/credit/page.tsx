import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/shared/LeadForm';
import { CreditProgramsGrid } from './_components/CreditProgramsGrid';

export const metadata: Metadata = {
  title: 'Автокредит — выгодные программы кредитования | ABC AUTO',
  description:
    'Оформите автокредит на любой автомобиль ABC AUTO: льготные ставки, рассрочка, спецпрограммы и trade-in. Расчёт за минуту, решение за день.',
};

const PERKS = [
  { num: 'от 4.9%', label: 'льготная ставка' },
  { num: '15 мин', label: 'предварительное решение' },
  { num: '0 ₽', label: 'первый взнос по части программ' },
];

export default function CreditPage() {
  return (
    <div className="bg-white">
      {/* ===== HERO — light blueprint ===== */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div className="absolute inset-0 bg-grid-light" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              Автокредит
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold uppercase leading-[0.92] tracking-tight text-zinc-900 md:text-7xl">
            Новый автомобиль
            <span className="block">на выгодных</span>
            <span className="mt-1 block text-brand">условиях</span>
          </h1>
          <p className="mt-6 max-w-md text-zinc-600">
            Кредит, рассрочка и спецпрограммы от банков-партнёров. Выберите программу,
            рассчитайте платёж и отправьте заявку — без визитов и лишних документов.
          </p>

          {/* inline trust ledger */}
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {PERKS.map((p) => (
              <div key={p.label} className="border-l-2 border-brand pl-3">
                <dt className="font-display text-2xl font-bold leading-none text-zinc-900">{p.num}</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-zinc-400">{p.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== PROGRAMS GRID (client) ===== */}
      <CreditProgramsGrid />

      {/* ===== CTA + FORM ===== */}
      <section id="zayavka" className="scroll-mt-24 border-t border-zinc-200 bg-zinc-50 py-20">
        <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold uppercase leading-none tracking-tight text-zinc-900 md:text-5xl">
              Не нашли подходящую
              <span className="block text-brand">программу?</span>
            </h2>
            <p className="mt-6 max-w-md text-zinc-600">
              Оставьте телефон — кредитный специалист подберёт условия под ваш бюджет
              и автомобиль, рассчитает платёж и поможет с документами.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-zinc-700">
              {['Решение за один день', 'Без скрытых комиссий', 'Подбор под ваш бюджет', 'Документы оформляем сами'].map((li) => (
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

          <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl">
            <LeadForm
              type="CREDIT_APPLICATION"
              title="Заявка на автокредит"
              subtitle="Заполните форму — специалист перезвонит и рассчитает платёж."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
