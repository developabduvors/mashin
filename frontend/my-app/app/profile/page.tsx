'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CarListItem } from '@/lib/types';
import { CarCard } from '@/components/shared/CarCard';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { ProfileEditForm } from './_components/ProfileEditForm';
import { PasswordForm } from './_components/PasswordForm';

export default function ProfilePage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [cars, setCars] = useState<CarListItem[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);

  // Auth tugagach: token yo'q bo'lsa → login.
  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace('/login?next=/profile');
      return;
    }
    api.purchases
      .list()
      .then(setCars)
      .catch(console.error)
      .finally(() => setLoadingCars(false));
  }, [ready, user, router]);

  if (!ready || !user) {
    return <div className="py-24 text-center text-zinc-400">Загрузка…</div>;
  }

  return (
    <div>
      <div className="min-h-[80vh] bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto max-w-5xl px-4 py-12">
          {/* ===== Header card ===== */}
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-black text-white">
                {user.fullName.trim().charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-50">
                  {user.fullName}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
              </div>
            </div>

            {/* Light/Dark toggle — global theme */}
            <ThemeToggle className="border border-zinc-200 dark:border-zinc-700" />
          </div>

          {/* ===== Forms ===== */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ProfileEditForm />
            <PasswordForm />
          </div>

          {/* ===== Purchased cars ===== */}
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-50">
              Мои автомобили
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Автомобили, которые вы приобрели в ABC AUTO.
            </p>

            <div className="mt-6">
              {loadingCars ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-[420px] w-full animate-pulse rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60"
                    />
                  ))}
                </div>
              ) : cars.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="font-display text-xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
                    Пока нет купленных автомобилей
                  </div>
                  <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                    После покупки автомобиля он появится здесь.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
