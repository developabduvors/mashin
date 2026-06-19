'use client';

interface Props {
  page: number;
  totalPages: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, onChange }: Props) {
  if (totalPages <= 1) {
    return (
      <p className="text-sm text-zinc-500">Jami: {total} ta</p>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-zinc-500">
        Jami {total} ta · {page}-sahifa / {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-zinc-50"
        >
          ← Oldingi
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-zinc-50"
        >
          Keyingi →
        </button>
      </div>
    </div>
  );
}
