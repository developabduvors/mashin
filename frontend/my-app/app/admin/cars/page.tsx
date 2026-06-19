'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { AdminCar } from '@/lib/types';
import { Pagination } from '../_components/Pagination';

const PAGE_SIZE = 20;

// Narx Decimal -> string keladi; minglik ajratgich bilan ko'rsatamiz.
function formatPrice(value: string): string {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString('ru-RU') + " so'm" : value;
}

function cover(car: AdminCar): string | null {
  return (car.images.find((i) => i.isCover) ?? car.images[0])?.url ?? null;
}

export default function AdminCarsPage() {
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api.admin.cars
      .list(page, PAGE_SIZE)
      .then((res) => {
        setCars(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(car: AdminCar) {
    const name = `${car.brand.name} ${car.model.name} ${car.trim}`;
    if (!confirm(`"${name}" mashinasini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.`))
      return;
    setDeletingId(car.id);
    setError('');
    try {
      await api.admin.cars.remove(car.id);
      // Joyida olib tashlaymiz (re-fetch'siz).
      setCars((prev) => prev.filter((c) => c.id !== car.id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-zinc-900">
            Mashinalar
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Jami: {total} ta</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A00F19]"
        >
          + Mashina qo&apos;shish
        </Link>
      </div>

      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {loading ? (
          <p className="p-6 text-zinc-400">Yuklanmoqda...</p>
        ) : cars.length === 0 ? (
          <p className="p-6 text-zinc-400">Hozircha mashina yo&apos;q. &quot;Mashina qo&apos;shish&quot; tugmasini bosing.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3">Rasm</th>
                <th className="px-4 py-3">Mashina</th>
                <th className="px-4 py-3">Yil</th>
                <th className="px-4 py-3">Narx</th>
                <th className="px-4 py-3">Holat</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => {
                const img = cover(car);
                return (
                  <tr key={car.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" className="h-12 w-16 rounded-md object-cover" />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-md bg-zinc-100 text-[10px] text-zinc-400">
                          rasm yo&apos;q
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-900">
                        {car.brand.name} {car.model.name}
                      </p>
                      <p className="text-xs text-zinc-500">{car.trim}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{car.year}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{formatPrice(car.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          car.inStock ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {car.inStock ? 'Sotuvda' : 'Yo‘q'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/cars/${car.id}/edit`}
                          className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                        >
                          Tahrirlash
                        </Link>
                        <button
                          onClick={() => onDelete(car)}
                          disabled={deletingId === car.id}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === car.id ? "O'chirilmoqda..." : "O'chirish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-5">
        <Pagination page={page} totalPages={totalPages} total={total} onChange={setPage} />
      </div>
    </div>
  );
}
