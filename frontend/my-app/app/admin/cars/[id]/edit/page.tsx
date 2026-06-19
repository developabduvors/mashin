'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { AdminCar } from '@/lib/types';
import { CarForm } from '../../_components/CarForm';

export default function AdminCarEditPage() {
  const { id } = useParams();
  const [car, setCar] = useState<AdminCar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.admin.cars
      .get(id as string)
      .then(setCar)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Link href="/admin/cars" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Mashinalar
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-zinc-900">
        Mashinani tahrirlash
      </h1>
      {car && (
        <p className="mb-8 mt-1 text-sm text-zinc-500">
          {car.brand.name} {car.model.name} {car.trim}
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-zinc-400">Yuklanmoqda...</p>
      ) : car ? (
        <CarForm mode="edit" initial={car} />
      ) : (
        !error && <p className="mt-6 text-zinc-400">Mashina topilmadi.</p>
      )}
    </div>
  );
}
