'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { AdminUserItem, AdminCar, AdminPurchase } from '@/lib/types';

function carLabel(c: AdminCar): string {
  return `${c.brand.name} ${c.model.name} ${c.trim} (${c.year})`;
}

export default function AdminPurchasesPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [purchases, setPurchases] = useState<AdminPurchase[]>([]);
  const [userId, setUserId] = useState('');
  const [carId, setCarId] = useState('');
  const [date, setDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    Promise.all([
      api.admin.users.list(),
      api.admin.cars.list(1, 100),
      api.admin.purchases.list(),
    ])
      .then(([u, c, p]) => {
        setUsers(u);
        setCars(c.items);
        setPurchases(p.items);
      })
      .catch((e) => setError((e as Error).message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !carId) {
      setError('Foydalanuvchi va mashina tanlang');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const item = await api.admin.purchases.create({
        userId,
        carId,
        ...(date ? { purchasedAt: new Date(date).toISOString() } : {}),
      });
      setPurchases((prev) => [item, ...prev]);
      setUserId('');
      setCarId('');
      setDate('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(p: AdminPurchase) {
    if (!confirm(`"${p.user.fullName} — ${carLabel(p.car)}" yozuvini o'chirasizmi?`)) return;
    setDeletingId(p.id);
    try {
      await api.admin.purchases.remove(p.id);
      setPurchases((prev) => prev.filter((x) => x.id !== p.id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  const field =
    'h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-brand focus:outline-none';

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-zinc-900">
        Sotuvlar
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Mashinani xaridorga biriktiring — u xaridorning profilida ko&apos;rinadi.
      </p>

      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {/* ===== Yangi sotuv formasi ===== */}
      <form
        onSubmit={onCreate}
        className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-6 md:grid-cols-4"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Xaridor</label>
          <select value={userId} onChange={(e) => setUserId(e.target.value)} className={field}>
            <option value="">— tanlang —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} ({u.email})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Mashina</label>
          <select value={carId} onChange={(e) => setCarId(e.target.value)} className={field}>
            <option value="">— tanlang —</option>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {carLabel(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Sana (ixtiyoriy)</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="h-10 w-full rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-[#A00F19] disabled:opacity-50"
          >
            {saving ? 'Saqlanmoqda…' : '+ Biriktirish'}
          </button>
        </div>
      </form>

      {/* ===== Mavjud sotuvlar ===== */}
      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {purchases.length === 0 ? (
          <p className="p-6 text-zinc-400">Hozircha sotuvlar yo&apos;q.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
                <th className="px-4 py-3">Xaridor</th>
                <th className="px-4 py-3">Mashina</th>
                <th className="px-4 py-3">Sana</th>
                <th className="px-4 py-3 text-right">Amal</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-zinc-900">{p.user.fullName}</p>
                    <p className="text-xs text-zinc-500">{p.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{carLabel(p.car)}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {new Date(p.purchasedAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(p)}
                      disabled={deletingId === p.id}
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === p.id ? "O'chirilmoqda…" : "O'chirish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
