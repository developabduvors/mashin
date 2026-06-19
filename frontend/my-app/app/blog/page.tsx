import React from 'react';
import type { Metadata } from 'next';
import { BlogList } from './_components/BlogList';

export const metadata: Metadata = {
  title: 'Блог и статьи | ABC AUTO',
  description:
    'Полезные статьи об автомобилях, автокредите, trade-in и обслуживании от экспертов автосалона ABC AUTO.',
};

export default function BlogPage() {
  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden border-b border-zinc-200">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
            Блог ABC AUTO
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-zinc-900 md:text-6xl">
            Всё об автомобилях, кредите и сервисе
          </h1>
          <p className="mt-6 max-w-xl text-zinc-600">
            Экспертные материалы, советы по выбору и обслуживанию авто, разбор условий
            кредитования и trade-in — от команды ABC AUTO.
          </p>
        </div>
      </section>

      {/* ===== СТАТЬИ (client) ===== */}
      <BlogList />
    </div>
  );
}
