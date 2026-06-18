'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BrandWithModels } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

// Locale-independent: same output on server (Node) and client (browser).
// Avoids hydration mismatch from toLocaleString()'s env-dependent grouping.
const formatNumber = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const CreditCalculator = () => {
  const [brands, setBrands] = useState<BrandWithModels[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [models, setModels] = useState<{ label: string; value: string }[]>([]);
  
  const [amount, setAmount] = useState(1500000);
  const [term, setTerm] = useState(48);
  const [downPayment, setDownPayment] = useState(300000);

  useEffect(() => {
    api.brands.getAll().then(setBrands).catch(console.error);
  }, []);

  useEffect(() => {
    const brand = brands.find(b => b.id === selectedBrand);
    if (brand) {
      setModels(brand.models.map(m => ({ label: m.name, value: m.id })));
    } else {
      setModels([]);
    }
  }, [selectedBrand, brands]);

  const monthlyPayment = Math.round((amount - downPayment) / term * 1.05); // Simplified calculation

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left: Calculator */}
          <div className="flex-1 rounded-3xl bg-zinc-50 p-8 shadow-sm md:p-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-8">
              Заявка на автокредит
            </h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Select
                label="Марка"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                options={[
                  { label: 'Выберите марку', value: '' },
                  ...brands.map(b => ({ label: b.name, value: b.id }))
                ]}
              />
              <Select
                label="Модель"
                options={[
                  { label: 'Выберите модель', value: '' },
                  ...models
                ]}
              />
              
              <div className="flex flex-col gap-4 md:col-span-2">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-zinc-700">Сумма кредита</span>
                    <span className="text-brand">{formatNumber(amount)} ₽</span>
                  </div>
                  <input 
                    type="range" 
                    min="300000" 
                    max="10000000" 
                    step="50000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-2 w-full appearance-none rounded-lg bg-zinc-200 accent-brand"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-zinc-700">Срок (мес.)</span>
                    <span className="text-brand">{term} мес.</span>
                  </div>
                  <input 
                    type="range" 
                    min="6" 
                    max="84" 
                    step="6"
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className="h-2 w-full appearance-none rounded-lg bg-zinc-200 accent-brand"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-zinc-700">Первоначальный взнос</span>
                    <span className="text-brand">{formatNumber(downPayment)} ₽</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={amount * 0.9} 
                    step="10000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="h-2 w-full appearance-none rounded-lg bg-zinc-200 accent-brand"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Lead Form */}
          <div className="w-full lg:w-[450px]">
            <div className="h-full rounded-3xl border-4 border-brand bg-white p-8 shadow-2xl md:p-12">
              <div className="text-center">
                <div className="text-sm font-bold uppercase tracking-widest text-zinc-400">Ваш ежемесячный платёж</div>
                <div className="mt-2 text-5xl font-black text-brand">{formatNumber(monthlyPayment)} ₽</div>
                <div className="mt-8 rounded-lg bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                  Ваша выгода до 300 000 ₽
                </div>
              </div>

              <form className="mt-12 flex flex-col gap-4">
                <Input placeholder="Ваше имя" required />
                <Input placeholder="Ваш телефон" type="tel" required />
                <Button variant="primary" size="lg" className="mt-4 h-16 text-xl font-black uppercase italic">
                  Получить предложение
                </Button>
                <p className="mt-4 text-center text-[10px] text-zinc-400">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки данных
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
