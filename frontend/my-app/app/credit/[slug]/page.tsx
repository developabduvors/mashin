'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { CreditProgramItem, BrandWithModels } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import Image from 'next/image';

export default function CreditProgramPage() {
  const { slug } = useParams();
  const [program, setProgram] = useState<CreditProgramItem | null>(null);
  const [brands, setBrands] = useState<BrandWithModels[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.creditPrograms.getAll(),
      api.brands.getAll()
    ]).then(([programs, brandsData]) => {
      const p = programs.find(p => p.slug === slug);
      setProgram(p || programs[0]);
      setBrands(brandsData);
    }).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="container mx-auto p-20 text-center">Загрузка программы...</div>;
  if (!program) return <div className="container mx-auto p-20 text-center">Программа не найдена</div>;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden bg-zinc-900">
        <Image
          src={program.imageUrl || '/placeholder-credit-hero.jpg'}
          alt={program.title}
          fill
          className="object-cover opacity-50"
        />
        <div className="container relative mx-auto flex h-full flex-col justify-center px-4 text-white">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter md:text-6xl">
            {program.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium opacity-90">
            {program.description}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="rounded-full bg-[#C1121F] px-6 py-2 text-2xl font-black">
              от {program.ratePercent}%
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">льготная ставка</span>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-12 lg:flex-row">
            <div className="flex-1 rounded-3xl bg-zinc-50 p-8 shadow-sm md:p-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-8">
                Рассчитать кредит
              </h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Select
                  label="Марка"
                  options={[
                    { label: 'Выберите марку', value: '' },
                    ...brands.map(b => ({ label: b.name, value: b.id }))
                  ]}
                />
                <Select
                  label="Модель"
                  options={[{ label: 'Выберите модель', value: '' }]}
                />
                
                <div className="flex flex-col gap-8 md:col-span-2 mt-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">Сумма кредита: 1 500 000 ₽</label>
                    <input type="range" className="h-2 w-full appearance-none rounded-lg bg-zinc-200 accent-[#C1121F]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">Срок: 48 мес.</label>
                    <input type="range" className="h-2 w-full appearance-none rounded-lg bg-zinc-200 accent-[#C1121F]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[450px]">
              <div className="rounded-3xl border-4 border-[#C1121F] bg-white p-8 shadow-2xl md:p-12">
                <h3 className="text-center text-xl font-black uppercase tracking-tighter mb-8">
                  Отправить заявку
                </h3>
                <form className="flex flex-col gap-4">
                  <Input placeholder="Ваше имя" required />
                  <Input placeholder="Ваш телефон" type="tel" required />
                  <Button variant="primary" size="lg" className="mt-4 h-16 text-xl font-black uppercase italic">
                    Оформить кредит
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
