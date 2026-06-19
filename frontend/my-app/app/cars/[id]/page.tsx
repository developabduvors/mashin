'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CarDetail } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/shared/LeadForm';
import Image from 'next/image';

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'CAR_INQUIRY' | 'CREDIT_APPLICATION'>('CAR_INQUIRY');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      api.cars.getById(id as string)
        .then(setCar)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="container mx-auto p-20 text-center">Загрузка автомобиля...</div>;
  if (!car) return <div className="container mx-auto p-20 text-center">Автомобиль не найден</div>;

  const handleAction = (type: 'CAR_INQUIRY' | 'CREDIT_APPLICATION') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left: Gallery */}
          <div className="flex-1">
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={car.images[activeImage]?.url || car.coverImage || '/placeholder-car.jpg'}
                alt={car.brand}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
              {car.images.map((img, idx) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImage(idx)}
                  className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    activeImage === idx ? 'border-[#C1121F]' : 'border-transparent'
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-full lg:w-[450px]">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-50">
              {car.brand} {car.model}
            </h1>
            <p className="mt-2 text-xl text-zinc-500">
              {car.trim} {car.year}
            </p>
            
            <div className="mt-8 flex items-baseline gap-4">
              <span className="text-4xl font-black text-[#C1121F]">
                {car.price.toLocaleString()} ₽
              </span>
              {car.monthlyFrom && (
                <span className="text-lg font-bold text-zinc-400">
                  от {car.monthlyFrom.toLocaleString()} ₽/мес.
                </span>
              )}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <Link
                href={`/cars/${car.id}/credit`}
                className="inline-flex h-14 items-center justify-center rounded-md bg-[#C1121F] font-black uppercase italic text-white transition-colors hover:bg-[#A00F19]"
              >
                В кредит
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="h-14 font-black uppercase italic"
                onClick={() => handleAction('CAR_INQUIRY')}
              >
                Забронировать
              </Button>
            </div>

            <div className="mt-12 rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900">
              <h3 className="font-bold text-zinc-900 mb-4 dark:text-zinc-50">Характеристики</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm">
                  <dt className="text-zinc-500">Год выпуска</dt>
                  <dd className="font-bold text-zinc-900 dark:text-zinc-100">{car.year}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-zinc-500">Пробег</dt>
                  <dd className="font-bold text-zinc-900 dark:text-zinc-100">{car.mileage?.toLocaleString() || 0} км</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-zinc-500">Коробка</dt>
                  <dd className="font-bold text-zinc-900 dark:text-zinc-100">{car.transmission}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-zinc-500">Двигатель</dt>
                  <dd className="font-bold text-zinc-900 dark:text-zinc-100">{car.fuelType}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-zinc-500">Кузов</dt>
                  <dd className="font-bold text-zinc-900 dark:text-zinc-100">{car.bodyType}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-20 max-w-3xl">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 mb-6 dark:text-zinc-50">
            Описание автомобиля
          </h2>
          <div className="prose prose-zinc text-zinc-600 dark:text-zinc-300">
            {car.description || 'Описание временно отсутствует.'}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LeadForm 
          type={modalType} 
          carId={car.id}
          title={modalType === 'CREDIT_APPLICATION' ? 'Заявка на кредит' : 'Бронирование'}
          subtitle={`Вы выбрали ${car.brand} ${car.model}`}
          onSuccess={() => setTimeout(() => setIsModalOpen(false), 3000)}
        />
      </Modal>
    </div>
  );
}
