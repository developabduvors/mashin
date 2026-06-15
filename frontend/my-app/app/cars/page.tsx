'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CarListItem, BrandWithModels, Paginated } from '@/lib/types';
import { CarCard } from '@/components/shared/CarCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import Image from 'next/image';

const CatalogContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [carsData, setCarsData] = useState<Paginated<CarListItem> | null>(null);
  const [brands, setBrands] = useState<BrandWithModels[]>([]);
  const [loading, setLoading] = useState(true);

  const currentBrand = searchParams.get('brand') || '';
  const currentCondition = searchParams.get('condition') || '';

  useEffect(() => {
    Promise.all([
      api.brands.getAll(),
      api.cars.getAll(Object.fromEntries(searchParams.entries()))
    ]).then(([brandsData, cars]) => {
      setBrands(brandsData);
      setCarsData(cars);
    }).catch(console.error).finally(() => setLoading(false));
  }, [searchParams]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 mb-8">
        Каталог автомобилей
      </h1>

      {/* Brands Grid */}
      <div className="mb-12 grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-10">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => updateFilters('brand', brand.slug === currentBrand ? '' : brand.slug)}
            className={`flex flex-col items-center justify-center rounded-lg border p-2 transition-all ${
              currentBrand === brand.slug ? 'border-[#C1121F] bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300'
            }`}
          >
            <div className="relative h-8 w-full">
              <Image
                src={brand.logoUrl || '/placeholder-logo.png'}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="mt-1 text-[8px] font-bold uppercase text-zinc-400">
              {brand.name}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-8">
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 mb-6">Фильтры</h3>
            
            <div className="space-y-6">
              <Select
                label="Состояние"
                value={currentCondition}
                onChange={(e) => updateFilters('condition', e.target.value)}
                options={[
                  { label: 'Любое', value: '' },
                  { label: 'Новые', value: 'NEW' },
                  { label: 'С пробегом', value: 'USED' },
                ]}
              />
              
              <Select
                label="Марка"
                value={currentBrand}
                onChange={(e) => updateFilters('brand', e.target.value)}
                options={[
                  { label: 'Все марки', value: '' },
                  ...brands.map(b => ({ label: b.name, value: b.slug }))
                ]}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Цена от, ₽</label>
                <input type="number" className="h-10 rounded-md border border-zinc-200 px-3 text-sm" placeholder="0" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Цена до, ₽</label>
                <input type="number" className="h-10 rounded-md border border-zinc-200 px-3 text-sm" placeholder="10 000 000" />
              </div>

              <Button 
                variant="primary" 
                className="w-full uppercase font-bold text-xs tracking-widest"
                onClick={() => router.push('/cars')}
              >
                Сбросить
              </Button>
            </div>
          </div>
        </aside>

        {/* Cars Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-500">
              Найдено: <span className="text-zinc-900 font-bold">{carsData?.total || 0} авто</span>
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-400">Сортировка:</span>
              <select className="font-bold text-zinc-900 focus:outline-none bg-transparent">
                <option>По умолчанию</option>
                <option>Сначала дешевле</option>
                <option>Сначала дороже</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[400px] w-full animate-pulse rounded-lg bg-zinc-100" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {carsData?.items.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              
              {carsData && carsData.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Button variant="outline" size="lg" className="uppercase font-black italic">
                    Показать ещё
                  </Button>
                </div>
              )}
              
              {carsData?.items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-xl font-bold text-zinc-400">Автомобили не найдены по вашему запросу</p>
                  <Button variant="outline" className="mt-4" onClick={() => router.push('/cars')}>
                    Сбросить все фильтры
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-20 text-center">Загрузка каталога...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
