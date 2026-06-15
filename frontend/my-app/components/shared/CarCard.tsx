import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CarListItem } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface CarCardProps {
  car: CarListItem;
}

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <Link href={`/cars/${car.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-50">
        <Image
          src={car.coverImage || '/design/bois/7-mashina-detali-A.jpg'}
          alt={`${car.brand.name} ${car.model.name}`}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
        {car.hasPts && (
          <div className="absolute top-4 left-4 rounded-md bg-green-600 px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-wider shadow-lg">
            В наличии с ПТС
          </div>
        )}
      </Link>
      
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/cars/${car.id}`}>
          <h3 className="text-lg font-bold text-zinc-900 line-clamp-1">
            {car.brand.name} {car.model.name}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            {car.trim} {car.year}
          </p>
        </Link>
        
        <div className="mt-4 flex flex-col gap-1">
          <div className="text-2xl font-black text-zinc-900">
            {car.price.toLocaleString()} ₽
          </div>
          {car.monthlyFrom && (
            <div className="text-sm font-medium text-[#C1121F]">
              от {car.monthlyFrom.toLocaleString()} ₽ / мес.
            </div>
          )}
        </div>
        
        <div className="mt-6 flex gap-2">
          <Button variant="primary" size="sm" className="flex-1 text-xs">
            КУПИТЬ В КРЕДИТ
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            РЕЗЕРВ
          </Button>
        </div>
      </div>
    </div>
  );
};
