'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BrandWithModels } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export const BrandsGrid = () => {
  const [brands, setBrands] = useState<BrandWithModels[]>([]);

  useEffect(() => {
    api.brands.getAll().then(setBrands).catch(console.error);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left: Brands Grid */}
          <div className="flex-1">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-8">
              Выберите марку
            </h2>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/cars?brand=${brand.slug}`}
                  className="group flex flex-col items-center justify-center rounded-lg border border-zinc-100 p-4 transition-all hover:border-brand hover:shadow-lg"
                >
                  <div className="relative h-12 w-full grayscale transition-all group-hover:grayscale-0">
                    <Image
                      src={brand.logoUrl || '/placeholder-logo.png'}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
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

              <form className="mt-8 flex flex-col gap-4">
                <Select
                  label="Марка"
                  options={[
                    { label: 'Все марки', value: '' },
                    ...brands.map(b => ({ label: b.name, value: b.slug }))
                  ]}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
                
                <Select
                  label="Тип кузова"
                  options={[
                    { label: 'Все типы', value: '' },
                    { label: 'Седан', value: 'SEDAN' },
                    { label: 'Внедорожник', value: 'SUV' },
                    { label: 'Хэтчбек', value: 'HATCHBACK' },
                  ]}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Цена до</label>
                  <input 
                    type="range" 
                    min="500000" 
                    max="10000000" 
                    step="100000"
                    className="h-2 w-full appearance-none rounded-lg bg-zinc-700 accent-brand"
                  />
                  <div className="flex justify-between text-xs font-bold text-zinc-400">
                    <span>500 000 ₽</span>
                    <span>10 000 000 ₽</span>
                  </div>
                </div>

                <Button variant="primary" size="lg" className="mt-4 uppercase italic font-black">
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
