import React from 'react';
import type { Metadata } from 'next';
import { LeadForm } from '@/components/shared/LeadForm';
import { ContactsView } from './_components/ContactsView';

export const metadata: Metadata = {
  title: 'Контакты | ABC AUTO',
  description:
    'Адреса автосалонов ABC AUTO, телефоны и часы работы. Выберите свой город и приезжайте — или оставьте заявку, и мы перезвоним.',
};

export default function ContactsPage() {
  return (
    <div className="bg-zinc-50">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rotate-12 bg-brand/20 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              Контакты · ABC Auto
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-8xl">
            Как нас
            <span className="block text-brand">найти</span>
          </h1>
          <p className="mt-6 max-w-xl text-zinc-400">
            Федеральная сеть автосалонов. Выберите город — покажем адреса, телефоны
            и часы работы ближайшего салона.
          </p>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            {[
              ['Ежедневно', '09:00 — 21:00'],
              ['Горячая линия', '+7 (800) 555-35-35'],
              ['Звонок', 'бесплатный по РФ'],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col">
                <span className="font-display text-lg font-bold leading-none text-white">{value}</span>
                <span className="mt-1 text-xs uppercase tracking-wider text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEALERSHIPS (client) ===== */}
      <ContactsView />

      {/* ===== CTA + FORM ===== */}
      <section id="zayavka" className="scroll-mt-24 bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-zinc-200 shadow-xl lg:grid-cols-2">
            {/* left: dark promise */}
            <div className="relative overflow-hidden bg-zinc-950 p-10 text-white md:p-12">
              <div className="absolute inset-0 bg-grid opacity-50" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-brand" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
                    Не дозвонились?
                  </span>
                </div>
                <h2 className="mt-4 text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl">
                  Перезвоним
                  <span className="block text-brand">за 5 минут</span>
                </h2>
                <p className="mt-6 max-w-sm text-zinc-400">
                  Оставьте телефон — менеджер свяжется с вами, ответит на вопросы
                  и подберёт удобное время визита в салон.
                </p>
              </div>
            </div>

            {/* right: form */}
            <div className="bg-white p-10 md:p-12">
              <LeadForm
                type="CALLBACK"
                title="Заказать звонок"
                subtitle="Заполните форму — мы перезвоним в ближайшее время."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
