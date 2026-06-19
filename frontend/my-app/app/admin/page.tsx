'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { AdminStats } from '@/lib/types';
import { STATUS_LABELS, STATUS_ORDER } from './_components/labels';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.admin.stats().then(setStats).catch((e) => setError((e as Error).message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return <p className="text-zinc-400">Yuklanmoqda...</p>;

  const byStatus = (s: string) =>
    stats.leadsByStatus.find((x) => x.status === s)?.count ?? 0;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-zinc-900">
        Boshqaruv paneli
      </h1>
      <p className="mt-1 text-sm text-zinc-500">Umumiy ko'rsatkichlar</p>

      {/* Top cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card label="Yangi xabarlar" value={stats.leadsNew} accent />
        <Card label="Mashinalar" value={stats.cars} />
        <Card label="Brendlar" value={stats.brands} />
        <Card
          label="Jami arizalar"
          value={stats.leadsByStatus.reduce((a, b) => a + b.count, 0)}
        />
      </div>

      {/* Leads by status */}
      <h2 className="mt-10 font-display text-xl font-bold uppercase tracking-tight text-zinc-900">
        Holat bo'yicha
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="font-display text-3xl font-bold tabular-nums text-zinc-900">
              {byStatus(s)}
            </div>
            <div className="mt-1 text-xs font-medium text-zinc-500">{STATUS_LABELS[s]}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/leads"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800"
        >
          Barcha xabarlar →
        </Link>
        <Link
          href="/admin/credits"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          Kredit arizalari →
        </Link>
      </div>
    </div>
  );
}

function Card({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        accent ? 'border-brand bg-brand text-white' : 'border-zinc-200 bg-white'
      }`}
    >
      <div className="font-display text-4xl font-bold tabular-nums">{value}</div>
      <div className={`mt-1 text-sm font-medium ${accent ? 'text-white/80' : 'text-zinc-500'}`}>
        {label}
      </div>
    </div>
  );
}
