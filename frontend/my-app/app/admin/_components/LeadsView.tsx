'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { LeadItem, LeadStatus, LeadType } from '@/lib/types';
import { LeadsTable } from './LeadsTable';
import { Pagination } from './Pagination';
import { STATUS_LABELS, STATUS_ORDER, TYPE_LABELS, TYPE_ORDER } from './labels';

interface Props {
  title: string;
  subtitle?: string;
  // Berilsa — type filtri qat'iy belgilanadi (masalan kredit sahifasi) va
  // tur tanlovchi yashiriladi.
  fixedType?: LeadType;
  creditMode?: boolean;
}

const PAGE_SIZE = 20;

export function LeadsView({ title, subtitle, fixedType, creditMode = false }: Props) {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<LeadStatus | ''>('');
  const [type, setType] = useState<LeadType | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api.admin.leads
      .list({
        type: fixedType ?? (type || undefined),
        status: status || undefined,
        page,
        limit: PAGE_SIZE,
      })
      .then((res) => {
        setLeads(res.items);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [fixedType, type, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Status o'zgargach — qatorni joyida yangilash (re-fetch'siz).
  function onUpdated(updated: LeadItem) {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-zinc-900">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}

      {/* Filtrlar */}
      <div className="mt-6 flex flex-wrap items-end gap-3">
        {!fixedType && (
          <Filter
            label="Tur"
            value={type}
            onChange={(v) => {
              setType(v as LeadType | '');
              setPage(1);
            }}
            options={[
              { value: '', label: 'Barchasi' },
              ...TYPE_ORDER.map((t) => ({ value: t, label: TYPE_LABELS[t] })),
            ]}
          />
        )}
        <Filter
          label="Holat"
          value={status}
          onChange={(v) => {
            setStatus(v as LeadStatus | '');
            setPage(1);
          }}
          options={[
            { value: '', label: 'Barchasi' },
            ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
          ]}
        />
        <button
          onClick={load}
          className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Yangilash
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-zinc-400">Yuklanmoqda...</p>
        ) : (
          <LeadsTable leads={leads} creditMode={creditMode} onUpdated={onUpdated} />
        )}
      </div>

      <div className="mt-5">
        <Pagination page={page} totalPages={totalPages} total={total} onChange={setPage} />
      </div>
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
