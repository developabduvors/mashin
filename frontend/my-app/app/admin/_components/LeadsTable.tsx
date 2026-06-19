'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { LeadItem, LeadStatus } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import {
  STATUS_LABELS,
  STATUS_ORDER,
  TYPE_LABELS,
  TYPE_STYLES,
} from './labels';

interface Props {
  leads: LeadItem[];
  // Kredit rejimida summa/muddat/boshlang'ich ustunlari ko'rinadi.
  creditMode?: boolean;
  // Status yangilangach parent ro'yxatni yangilashi uchun.
  onUpdated: (lead: LeadItem) => void;
}

const fmt = (n: number | null) =>
  n === null ? '—' : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export function LeadsTable({ leads, creditMode = false, onUpdated }: Props) {
  // Qaysi qator yangilanayotganini ko'rsatish uchun.
  const [savingId, setSavingId] = useState<string | null>(null);

  async function changeStatus(lead: LeadItem, status: LeadStatus) {
    if (status === lead.status) return;
    setSavingId(lead.id);
    try {
      const updated = await api.admin.leads.updateStatus(lead.id, status);
      onUpdated(updated);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSavingId(null);
    }
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center text-zinc-500">
        Hozircha hech narsa yo'q.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
            <th className="px-4 py-3 font-bold">Ism</th>
            <th className="px-4 py-3 font-bold">Telefon</th>
            {!creditMode && <th className="px-4 py-3 font-bold">Tur</th>}
            {creditMode && <th className="px-4 py-3 font-bold">Summa</th>}
            {creditMode && <th className="px-4 py-3 font-bold">Muddat</th>}
            {creditMode && <th className="px-4 py-3 font-bold">Boshlang'ich</th>}
            <th className="px-4 py-3 font-bold">Izoh</th>
            <th className="px-4 py-3 font-bold">Sana</th>
            <th className="px-4 py-3 font-bold">Holat</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/60">
              <td className="px-4 py-3 font-medium text-zinc-900">{lead.name || '—'}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <a href={`tel:+${lead.phone}`} className="text-brand hover:underline">
                  +{lead.phone}
                </a>
              </td>

              {!creditMode && (
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${TYPE_STYLES[lead.type]}`}>
                    {TYPE_LABELS[lead.type]}
                  </span>
                </td>
              )}

              {creditMode && (
                <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                  {lead.creditAmount !== null ? `${fmt(lead.creditAmount)} ₽` : '—'}
                </td>
              )}
              {creditMode && (
                <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                  {lead.termMonths ? `${lead.termMonths} oy` : '—'}
                </td>
              )}
              {creditMode && (
                <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                  {lead.downPayment !== null ? `${fmt(lead.downPayment)} ₽` : '—'}
                </td>
              )}

              <td className="px-4 py-3 max-w-xs truncate text-zinc-600" title={lead.note || ''}>
                {lead.note || '—'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-zinc-500">{fmtDate(lead.createdAt)}</td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={lead.status} />
                  <select
                    value={lead.status}
                    disabled={savingId === lead.id}
                    onChange={(e) => changeStatus(lead, e.target.value as LeadStatus)}
                    className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs disabled:opacity-50"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
