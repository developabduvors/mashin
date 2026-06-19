'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CarListItem } from '@/lib/types';
import { CarCard } from '@/components/shared/CarCard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export default function FavoritesPage() {
  const router = useRouter();
  const { user, ready, favorites } = useAuth();
  const [cars, setCars] = useState<CarListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth tugagach: token yo'q bo'lsa → login.
  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace('/login?next=/favorites');
      return;
    }
    api.favorites
      .list()
      .then(setCars)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ready, user, router]);

  // Yurakcha o'chirilsa karta darhol yo'qoladi (context Set bilan sinxron).
  const visible = cars.filter((c) => favorites.has(c.id));

  if (!ready || (ready && !user)) {
    return <div className="py-24 text-center text-zinc-400">Загрузка…</div>;
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950">
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rotate-12 bg-brand/20 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              ABC Auto
            </span>
          </div>
          <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-7xl">
            Избранное
          </h1>
          <p className="mt-4 max-w-xl text-zinc-400">
            Автомобили, которые вы сохранили.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] w-full animate-pulse rounded-xl border border-zinc-100 bg-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-800/60"
              />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-24 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <div className="font-display text-2xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-50">
              Список пуст
            </div>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Нажмите на ♥ в карточке автомобиля, чтобы добавить его в Избранное.
            </p>
            <Link href="/cars">
              <Button variant="primary" className="mt-6 font-bold uppercase">
                В каталог
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
