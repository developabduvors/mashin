'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CreditProgramItem } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export const SpecialOffers = () => {
  const [programs, setPrograms] = useState<CreditProgramItem[]>([]);

  useEffect(() => {
    api.creditPrograms.getAll().then(setPrograms).catch(console.error);
  }, []);

  if (programs.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-12">
          Спецпредложения
        </h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div 
              key={program.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={program.imageUrl || '/placeholder-credit.jpg'}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 rounded-full bg-[#C1121F] px-4 py-1 text-sm font-black text-white">
                  {program.ratePercent}% ставка
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
                  {program.description}
                </p>
                <Link href={`/credit/${program.slug}`} className="mt-6">
                  <Button variant="outline" className="w-full font-bold uppercase tracking-wider text-xs">
                    Узнать больше
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
