'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { CarDetail, CreditProgramItem } from '@/lib/types';
import { LeadForm } from '@/components/shared/LeadForm';
import { formatNumber } from '@/lib/utils';

// Annuitet oylik to'lov: P * r / (1 - (1+r)^-n)
function annuity(principal: number, annualPercent: number, months: number) {
  const r = annualPercent / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export default function CarCreditPage() {
  const { id } = useParams();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [programs, setPrograms] = useState<CreditProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  // calculator state
  const [down, setDown] = useState(0);
  const [term, setTerm] = useState(60);
  const [programId, setProgramId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.cars.getById(id as string), api.creditPrograms.getAll()])
      .then(([c, progs]) => {
        setCar(c);
        setDown(Math.round((c.price * 0.2) / 50_000) * 50_000); // default 20%
        // faqat kredit/rassrochka turidagi, stavkasi bor dasturlar
        const usable = progs.filter((p) => p.ratePercent != null);
        setPrograms(usable);
        const cheapest = [...usable].sort((a, b) => (a.ratePercent! - b.ratePercent!))[0];
        if (cheapest) setProgramId(cheapest.id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const program = programs.find((p) => p.id === programId);
  const rate = program?.ratePercent ?? 4.9;

  const calc = useMemo(() => {
    if (!car) return { loan: 0, monthly: 0, total: 0, overpay: 0 };
    const loan = Math.max(0, car.price - down);
    const monthly = loan > 0 ? annuity(loan, rate, term) : 0;
    const total = monthly * term + down;
    return { loan, monthly, total, overpay: monthly * term - loan };
  }, [car, down, term, rate]);

  if (loading) return <div className="container mx-auto p-20 text-center text-zinc-500">Загрузка...</div>;
  if (!car) return <div className="container mx-auto p-20 text-center text-zinc-500">Автомобиль не найден</div>;

  const maxDown = Math.round((car.price * 0.9) / 50_000) * 50_000;

  return (
    <div className="bg-zinc-50">
      {/* ===== breadcrumb + car header ===== */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Link href="/cars" className="hover:text-brand">Каталог</Link>
            <span aria-hidden>/</span>
            <Link href={`/cars/${car.id}`} className="hover:text-brand">{car.brand} {car.model}</Link>
            <span aria-hidden>/</span>
            <span className="text-brand">В кредит</span>
          </nav>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-24 w-36 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100">
              <Image
                src={car.coverImage || car.images?.[0]?.url || '/design/bois/7-mashina-detali-A.jpg'}
                alt={`${car.brand} ${car.model}`}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-zinc-900 md:text-4xl">
                {car.brand} {car.model} <span className="text-brand">в кредит</span>
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {car.trim} · {car.year} · цена {formatNumber(car.price)} ₽
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== calculator + application ===== */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 lg:grid-cols-[1fr_400px]">
          {/* calculator */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm md:p-10">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-zinc-900">
              Кредитный калькулятор
            </h2>

            {/* program chips */}
            {programs.length > 0 && (
              <div className="mt-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Программа</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {programs.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProgramId(p.id)}
                      className={`rounded-lg border px-4 py-2 text-left transition-all ${
                        p.id === programId
                          ? 'border-brand bg-brand/5'
                          : 'border-zinc-200 hover:border-brand/50'
                      }`}
                    >
                      <span className="block text-xs font-bold uppercase tracking-wide text-zinc-900">{p.title}</span>
                      <span className="block font-display text-lg font-bold leading-tight text-brand">от {p.ratePercent}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* down payment */}
            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Первоначальный взнос
                </span>
                <span className="font-display text-lg font-bold text-zinc-900 tabular-nums">
                  {formatNumber(down)} ₽ · {Math.round((down / car.price) * 100)}%
                </span>
              </div>
              <input
                type="range" min={0} max={maxDown} step={50_000} value={down}
                onChange={(e) => setDown(+e.target.value)}
                className="mt-3 w-full accent-brand"
              />
            </div>

            {/* term */}
            <div className="mt-7">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Срок кредита</span>
                <span className="font-display text-lg font-bold text-zinc-900 tabular-nums">{term} мес.</span>
              </div>
              <input
                type="range" min={12} max={84} step={6} value={term}
                onChange={(e) => setTerm(+e.target.value)}
                className="mt-3 w-full accent-brand"
              />
            </div>

            {/* result */}
            <div className="mt-9 rounded-2xl bg-zinc-950 p-7 text-white">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">
                Ежемесячный платёж
              </span>
              <div className="mt-2 flex items-end gap-2">
                <span className="font-display text-5xl font-bold leading-none tracking-tight tabular-nums md:text-6xl">
                  {formatNumber(calc.monthly)}
                </span>
                <span className="mb-1 font-display text-2xl font-bold text-brand">₽/мес</span>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5 text-sm">
                <div>
                  <dt className="text-xs text-zinc-500">Сумма кредита</dt>
                  <dd className="mt-1 font-bold tabular-nums">{formatNumber(calc.loan)} ₽</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Ставка</dt>
                  <dd className="mt-1 font-bold tabular-nums">{rate}%</dd>
                </div>
                <div>
                  <dt className="text-xs text-zinc-500">Переплата</dt>
                  <dd className="mt-1 font-bold tabular-nums">{formatNumber(calc.overpay)} ₽</dd>
                </div>
              </dl>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">
              Расчёт предварительный и не является публичной офертой. Точные условия определит банк
              после рассмотрения заявки.
            </p>
          </div>

          {/* application — sticky */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border-2 border-brand bg-white shadow-xl">
              <LeadForm
                type="CREDIT_APPLICATION"
                carId={car.id}
                creditAmount={calc.loan}
                downPayment={down}
                termMonths={term}
                note={`${car.brand} ${car.model} ${car.trim} · ставка ${rate}% · платёж ~${formatNumber(calc.monthly)} ₽/мес`}
                title="Заявка на кредит"
                subtitle={`${car.brand} ${car.model} · ${formatNumber(calc.monthly)} ₽/мес`}
              />
            </div>
            <Link
              href={`/cars/${car.id}`}
              className="mt-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-500 transition-colors hover:text-brand"
            >
              ← Вернуться к автомобилю
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
