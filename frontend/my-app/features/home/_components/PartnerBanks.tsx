'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { PartnerBankItem } from '@/lib/types';

export const PartnerBanks = () => {
  const [partners, setPartners] = useState<PartnerBankItem[]>([]);

  useEffect(() => {
    api.partnerBanks.getAll().then(setPartners).catch(console.error);
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-12 text-center lg:text-left">
          Банки-партнёры
        </h2>
        
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {partners.map((bank) => (
            <div 
              key={bank.id}
              className="flex items-center justify-center grayscale transition-all hover:grayscale-0"
            >
              <div className="relative h-12 w-full">
                <Image
                  src={bank.logoUrl || '/placeholder-bank.png'}
                  alt={bank.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
