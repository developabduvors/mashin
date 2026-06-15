'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/shared/LeadForm';

export const BeatOffer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#C1121F] p-8 text-white md:p-16">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter md:text-5xl lg:text-6xl">
              Перебьём предложения конкурентов!
            </h2>
            <p className="mt-6 text-lg font-medium opacity-90 md:text-xl">
              У вас уже есть предложение от другого дилера? Пришлите его нам, и мы сделаем цену ещё ниже!
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              className="mt-10 bg-white text-[#C1121F] border-none font-black uppercase italic hover:bg-zinc-100"
              onClick={() => setIsModalOpen(true)}
            >
              Получить лучшее предложение
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-1/2" />
          <div className="absolute top-0 right-0 h-full w-1/4 bg-white/5 -skew-x-12 translate-x-1/4" />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LeadForm 
          type="BEAT_OFFER" 
          title="Лучшее предложение"
          subtitle="Оставьте ваши контакты, и мы перебьём цену любого конкурента!"
          onSuccess={() => setTimeout(() => setIsModalOpen(false), 3000)}
        />
      </Modal>
    </section>
  );
};
