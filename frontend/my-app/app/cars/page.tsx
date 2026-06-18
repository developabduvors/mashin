'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CarListItem, BrandWithModels, Paginated } from '@/lib/types';
import { CarCard } from '@/components/shared/CarCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { cn, formatNumber } from '@/lib/utils';
import Image from 'next/image';

const BODY_OPTIONS = [
  { label: 'Любой кузов', value: '' },
  { label: 'Седан', value: 'SEDAN' },
  { label: 'Внедорожник', value: 'SUV' },
  { label: 'Кроссовер', value: 'CROSSOVER' },
  { label: 'Хэтчбек', value: 'HATCHBACK' },
  { label: 'Минивэн', value: 'MINIVAN' },
  { label: 'Купе', value: 'COUPE' },
];

const SORT_OPTIONS = [
  { label: 'По умолчанию', value: '' },
  { label: 'Сначала дешевле', value: 'price_asc' },
  { label: 'Сначала дороже', value: 'price_desc' },
  { label: 'Сначала новые', value: 'newest' },
];

const CatalogContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [carsData, setCarsData] = useState<Paginated<CarListItem> | null>(null);
  const [brands, setBrands] = useState<BrandWithModels[]>([]);
  const [loading, setLoading] = useState(true);

  const currentBrand = searchParams.get('brand') || '';
  const currentCondition = searchParams.get('condition') || '';
  const currentBody = searchParams.get('bodyType') || '';
  const currentSort = searchParams.get('sort') || '';

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.brands.getAll(),
      api.cars.getAll(Object.fromEntries(searchParams.entries())),
    ])
      .then(([brandsData, cars]) => {
        setBrands(brandsData);
        setCarsData(cars);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const pushParams = (mutate: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`/cars?${params.toString()}`);
  };

  const updateFilter = (key: string, value: string) =>
    pushParams((p) => (value ? p.set(key, value) : p.delete(key)));

  const applyPrice = () =>
    pushParams((p) => {
      minPrice ? p.set('minPrice', minPrice) : p.delete('minPrice');
      maxPrice ? p.set('maxPrice', maxPrice) : p.delete('maxPrice');
    });

  const resetAll = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push('/cars');
  };

  const total = carsData?.total ?? 0;
  const hasFilters = [...searchParams.keys()].length > 0;

  return (
    <div className="bg-zinc-50">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-grid opacity-60" />
        {/* diagonal qizil aksent */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rotate-12 bg-brand/20 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16 md:py-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              ABC Auto · Москва
            </span>
          </div>
          <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-8xl">
            Каталог
            <span className="block text-brand">автомобилей</span>
          </h1>
          <p className="mt-6 max-w-xl text-zinc-400">
            Более 500 автомобилей в наличии с ПТС. Кредит, рассрочка и Trade-in —
            оформление в день обращения.
          </p>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-display text-5xl font-bold text-white">
              {loading ? '—' : formatNumber(total)}
            </span>
            <span className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              авто по запросу
            </span>
          </div>
        </div>
      </section>

      {/* ===== BRAND SCROLLER ===== */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {brands.map((brand) => {
              const active = currentBrand === brand.slug;
              return (
                <button
                  key={brand.id}
                  onClick={() => updateFilter('brand', active ? '' : brand.slug)}
                  className={cn(
                    'flex min-w-[92px] flex-shrink-0 flex-col items-center gap-2 rounded-xl border px-4 py-3 transition-all',
                    active
                      ? 'border-brand bg-brand/5 shadow-sm'
                      : 'border-zinc-200 bg-white hover:border-zinc-400',
                  )}
                >
                  <div className="relative h-8 w-16">
                    <Image
                      src={brand.logoUrl || '/placeholder-logo.png'}
                      alt={brand.name}
                      fill
                      className={cn(
                        'object-contain transition',
                        active ? '' : 'opacity-70 grayscale group-hover:grayscale-0',
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wide',
                      active ? 'text-brand' : 'text-zinc-500',
                    )}
                  >
                    {brand.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BODY ===== */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72">
            <div className="lg:sticky lg:top-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight text-zinc-900">
                  Фильтры
                </h3>
                {hasFilters && (
                  <button
                    onClick={resetAll}
                    className="text-[11px] font-bold uppercase tracking-wide text-brand hover:underline"
                  >
                    Сбросить
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <Select
                  label="Состояние"
                  value={currentCondition}
                  onChange={(e) => updateFilter('condition', e.target.value)}
                  options={[
                    { label: 'Любое', value: '' },
                    { label: 'Новые', value: 'NEW' },
                    { label: 'С пробегом', value: 'USED' },
                  ]}
                />

                <Select
                  label="Марка"
                  value={currentBrand}
                  onChange={(e) => updateFilter('brand', e.target.value)}
                  options={[
                    { label: 'Все марки', value: '' },
                    ...brands.map((b) => ({ label: b.name, value: b.slug })),
                  ]}
                />

                <Select
                  label="Тип кузова"
                  value={currentBody}
                  onChange={(e) => updateFilter('bodyType', e.target.value)}
                  options={BODY_OPTIONS}
                />

                <div>
                  <label className="text-sm font-semibold text-zinc-700">Цена, ₽</label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="от"
                      className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none"
                    />
                    <span className="text-zinc-300">—</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="до"
                      className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full font-display text-sm font-bold uppercase tracking-widest"
                  onClick={applyPrice}
                >
                  Применить
                </Button>
              </div>
            </div>
          </aside>

          {/* RESULTS */}
          <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-medium text-zinc-500">
                Найдено:{' '}
                <span className="font-display text-base font-bold text-zinc-900">
                  {formatNumber(total)}
                </span>{' '}
                авто
              </p>
              <div className="w-full sm:w-56">
                <Select
                  value={currentSort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  options={SORT_OPTIONS}
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[420px] w-full animate-pulse rounded-xl border border-zinc-100 bg-zinc-200/60"
                  />
                ))}
              </div>
            ) : carsData && carsData.items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {carsData.items.map((car, i) => (
                    <div
                      key={car.id}
                      className="animate-rise"
                      style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                    >
                      <CarCard car={car} />
                    </div>
                  ))}
                </div>

                {carsData.totalPages > 1 && carsData.items.length < total && (
                  <div className="mt-12 flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      className="font-display font-bold uppercase tracking-widest"
                      onClick={() =>
                        updateFilter('limit', String(carsData.items.length + 12))
                      }
                    >
                      Показать ещё
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-24 text-center">
                <div className="font-display text-2xl font-bold uppercase tracking-tight text-zinc-900">
                  Ничего не найдено
                </div>
                <p className="mt-2 max-w-sm text-sm text-zinc-500">
                  Попробуйте изменить параметры поиска или сбросить фильтры.
                </p>
                <Button variant="primary" className="mt-6 uppercase font-bold" onClick={resetAll}>
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-20 text-center font-display text-xl uppercase tracking-widest text-zinc-400">
          Загрузка каталога…
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
