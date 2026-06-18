import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CarListItem } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface CarCardProps {
  car: CarListItem;
}

const BODY_RU: Record<string, string> = {
  SEDAN: 'Седан',
  SUV: 'Внедорожник',
  HATCHBACK: 'Хэтчбек',
  CROSSOVER: 'Кроссовер',
  MINIVAN: 'Минивэн',
  COUPE: 'Купе',
};

export const CarCard = ({ car }: CarCardProps) => {
  const isNew = car.condition === 'NEW';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_20px_50px_-20px_rgba(193,18,31,0.45)]">
      <Link href={`/cars/${car.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <Image
          src={car.coverImage || '/design/bois/7-mashina-detali-A.jpg'}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* pastki gradient — badge va kelajakdagi matn o'qilishi uchun */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />

        {/* badge'lar */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {car.hasPts && (
            <span className="rounded bg-green-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg">
              В наличии · ПТС
            </span>
          )}
        </div>
        <span
          className={`absolute right-3 top-3 rounded px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-wider shadow-lg ${
            isNew ? 'bg-brand text-white' : 'bg-zinc-900 text-white'
          }`}
        >
          {isNew ? 'Новый' : `${car.year} · с пробегом`}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/cars/${car.id}`} className="block">
          <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-zinc-900 line-clamp-1 transition-colors group-hover:text-brand">
            {car.brand} {car.model}
          </h3>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-zinc-400 line-clamp-1">
            {car.trim} · {car.year}
          </p>
        </Link>

        {/* spec chip'lar */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[BODY_RU[car.bodyType] ?? car.bodyType, `${car.year}`].map((chip) => (
            <span
              key={chip}
              className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-500"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-zinc-100 pt-4">
          <div>
            <div className="font-display text-2xl font-bold leading-none text-zinc-900">
              {formatNumber(car.price)} ₽
            </div>
            {car.monthlyFrom && (
              <div className="mt-1 text-xs font-bold text-brand">
                от {formatNumber(car.monthlyFrom)} ₽ / мес.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/cars/${car.id}/credit`}
            className="inline-flex h-8 flex-1 items-center justify-center rounded-md bg-[#C1121F] px-3 text-[11px] font-medium tracking-wide text-white transition-colors hover:bg-[#A00F19]"
          >
            В КРЕДИТ
          </Link>
          <Link
            href={`/cars/${car.id}`}
            className="inline-flex h-8 flex-1 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-[11px] font-medium tracking-wide text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            РЕЗЕРВ
          </Link>
        </div>
      </div>
    </div>
  );
};
