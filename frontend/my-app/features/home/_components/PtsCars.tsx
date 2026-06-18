'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CarListItem } from '@/lib/types';
import { CarCard } from '@/components/shared/CarCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const PtsCars = () => {
  const [cars, setCars] = useState<CarListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.cars.getAll({ hasPts: true, inStock: true, limit: 6 })
      .then((data) => setCars(data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
              Автомобили в наличии с ПТС
            </h2>
            <p className="mt-2 text-zinc-500">
              Более 500 автомобилей готовы к выдаче в день обращения
            </p>
          </div>
          <Link href="/cars?hasPts=true" className="hidden sm:block">
            <Button variant="outline" className="font-bold uppercase tracking-wider text-xs">
              Смотреть все
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-[400px] w-full animate-pulse rounded-lg bg-zinc-200" />
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xl font-bold text-zinc-400">Автомобили не найдены</p>
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link href="/cars?hasPts=true">
            <Button variant="outline" className="w-full font-bold uppercase tracking-wider text-xs">
              Смотреть все
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
