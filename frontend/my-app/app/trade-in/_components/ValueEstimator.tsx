'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

// Taxminiy bozor bazasi (RUB) — marka bo'yicha o'rtacha trade-in qiymati.
const BRANDS: Record<string, number> = {
  Toyota: 1_900_000,
  Kia: 1_400_000,
  Hyundai: 1_350_000,
  Volkswagen: 1_550_000,
  BMW: 2_700_000,
  'Mercedes-Benz': 2_950_000,
  Chery: 1_250_000,
  Lada: 780_000,
};

const CONDITIONS: { key: string; label: string; factor: number }[] = [
  { key: 'great', label: 'Отличное', factor: 1.0 },
  { key: 'good', label: 'Хорошее', factor: 0.9 },
  { key: 'fair', label: 'Среднее', factor: 0.78 },
];

const CURRENT_YEAR = 2025;
const fmt = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n / 1000) * 1000);

// requestAnimationFrame bilan raqamni count-up animatsiya qiladi.
function useCountUp(target: number, ms = 550) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(from + (target - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, ms]);

  return value;
}

export const ValueEstimator = () => {
  const [brand, setBrand] = useState<keyof typeof BRANDS>('Toyota');
  const [year, setYear] = useState(2020);
  const [mileage, setMileage] = useState(80_000);
  const [condition, setCondition] = useState(CONDITIONS[0]);

  const estimate = useMemo(() => {
    const base = BRANDS[brand];
    const ageFactor = Math.max(0.35, 1 - (CURRENT_YEAR - year) * 0.055);
    const mileageFactor = Math.max(0.45, 1 - (mileage / 300_000) * 0.5);
    return base * ageFactor * mileageFactor * condition.factor;
  }, [brand, year, mileage, condition]);

  const animated = useCountUp(estimate);

  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-7 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)] md:p-8">
      {/* readout header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">
          Оценка авто
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          online
        </span>
      </div>

      {/* big animated value */}
      <div className="mt-3 border-b border-dashed border-zinc-200 pb-6">
        <div className="flex items-end gap-2">
          <span className="font-display text-5xl font-bold leading-none tracking-tight text-zinc-900 md:text-6xl tabular-nums">
            {fmt(animated)}
          </span>
          <span className="mb-1 font-display text-2xl font-bold text-brand">₽</span>
        </div>
        <p className="mt-2 text-xs text-zinc-400">
          Предварительная стоимость в зачёт нового авто
        </p>
      </div>

      {/* controls */}
      <div className="mt-6 space-y-5">
        {/* brand */}
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Марка</span>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value as keyof typeof BRANDS)}
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-semibold text-zinc-900 focus:border-brand focus:outline-none"
          >
            {Object.keys(BRANDS).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>

        {/* year slider */}
        <label className="block">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Год выпуска</span>
            <span className="font-display text-lg font-bold text-zinc-900 tabular-nums">{year}</span>
          </div>
          <input
            type="range" min={2008} max={2024} step={1} value={year}
            onChange={(e) => setYear(+e.target.value)}
            className="mt-2 w-full accent-brand"
          />
        </label>

        {/* mileage slider */}
        <label className="block">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Пробег</span>
            <span className="font-display text-lg font-bold text-zinc-900 tabular-nums">
              {fmt(mileage)} км
            </span>
          </div>
          <input
            type="range" min={0} max={250_000} step={5_000} value={mileage}
            onChange={(e) => setMileage(+e.target.value)}
            className="mt-2 w-full accent-brand"
          />
        </label>

        {/* condition segmented */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Состояние</span>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-lg bg-zinc-100 p-1">
            {CONDITIONS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCondition(c)}
                className={`rounded-md py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                  c.key === condition.key
                    ? 'bg-white text-brand shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#zayavka"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 font-display text-sm font-bold uppercase italic tracking-wider text-white shadow-[0_12px_30px_-10px_rgba(193,18,31,0.7)] transition-all hover:bg-brand-dark active:scale-[0.98]"
      >
        Зафиксировать цену
        <span aria-hidden>→</span>
      </a>
      <p className="mt-3 text-center text-[10px] leading-relaxed text-zinc-400">
        Расчёт предварительный. Точную цену назовёт эксперт после осмотра — бесплатно за 15 минут.
      </p>
    </div>
  );
};
