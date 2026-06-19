'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { BrandWithModels } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { BrandLogo } from '@/components/shared/BrandLogo';

const PRICE_MIN = 500_000;
const PRICE_MAX = 10_000_000;

export const BrandsGrid = () => {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandWithModels[]>([]);

  // Быстрый подбор form state
  const [brand, setBrand] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);

  useEffect(() => {
    api.brands.getAll().then(setBrands).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (bodyType) params.set('bodyType', bodyType);
    // faqat slider haqiqatan pasaytirilgan bo'lsa filter qo'shamiz
    if (maxPrice < PRICE_MAX) params.set('maxPrice', String(maxPrice));
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <section className="py-20 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left: Brands Grid */}
          <div className="flex-1">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-8 dark:text-zinc-50">
              Выберите марку
            </h2>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/cars?brand=${brand.slug}`}
                  className="group flex flex-col items-center justify-center rounded-lg border border-zinc-100 p-4 transition-all hover:border-brand hover:shadow-lg dark:border-zinc-800"
                >
                  <div className="relative h-12 w-full grayscale transition-all group-hover:grayscale-0">
                    <BrandLogo src={brand.logoUrl} name={brand.name} />
                  </div>
                  <span className="mt-2 text-[10px] font-bold uppercase text-zinc-400 group-hover:text-brand">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Quick Selection */}
          <div className="w-full lg:w-[400px]">
            <div className="rounded-xl bg-zinc-900 p-8 text-white shadow-xl">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                Быстрый подбор авто
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Заполните параметры, чтобы найти идеальный вариант
              </p>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <Select
                  label="Марка"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  options={[
                    { label: 'Все марки', value: '' },
                    ...brands.map(b => ({ label: b.name, value: b.slug }))
                  ]}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />

                <Select
                  label="Тип кузова"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  options={[
                    { label: 'Все типы', value: '' },
                    { label: 'Седан', value: 'SEDAN' },
                    { label: 'Внедорожник', value: 'SUV' },
                    { label: 'Хэтчбек', value: 'HATCHBACK' },
                  ]}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    Цена до{' '}
                    <span className="font-black text-white">
                      {maxPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </label>
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={100000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="h-2 w-full appearance-none rounded-lg bg-zinc-700 accent-brand"
                  />
                  <div className="flex justify-between text-xs font-bold text-zinc-400">
                    <span>500 000 ₽</span>
                    <span>10 000 000 ₽</span>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="mt-4 uppercase italic font-black">
                  Показать варианты
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
