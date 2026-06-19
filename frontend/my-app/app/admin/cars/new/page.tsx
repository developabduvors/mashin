'use client';

import Link from 'next/link';
import { CarForm } from '../_components/CarForm';

export default function AdminCarNewPage() {
  return (
    <div>
      <Link href="/admin/cars" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Mashinalar
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-zinc-900">
        Yangi mashina
      </h1>
      <p className="mb-8 mt-1 text-sm text-zinc-500">Katalogga yangi mashina qo&apos;shing.</p>

      <CarForm mode="create" />
    </div>
  );
}
