'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ContactsResult } from '@/lib/types';

export const MapContacts = () => {
  const [contacts, setContacts] = useState<ContactsResult | null>(null);

  useEffect(() => {
    api.contacts.get('moskva').then(setContacts).catch(console.error);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Left: Contacts Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-8">
              Контакты
            </h2>
            
            <div className="space-y-10">
              {contacts?.dealerships.map((dealer) => (
                <div key={dealer.id} className="border-l-4 border-brand pl-6">
                  <h3 className="text-xl font-bold text-zinc-900">{dealer.address}</h3>
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Телефоны:</p>
                      <div className="mt-1 flex flex-col gap-1">
                        {dealer.phones.map((phone, idx) => (
                          <a key={idx} href={`tel:${phone}`} className="text-lg font-bold text-zinc-900 hover:text-brand">
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">Режим работы:</p>
                      <p className="mt-1 text-sm font-medium text-zinc-600">
                        {dealer.schedule || 'Ежедневно: 09:00 — 21:00'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {!contacts && (
                <div className="border-l-4 border-brand pl-6">
                  <h3 className="text-xl font-bold text-zinc-900">г. Москва, ул. Автозаводская, 23/15</h3>
                  <div className="mt-4 flex flex-col gap-1">
                    <a href="tel:+78005553535" className="text-lg font-bold text-zinc-900 hover:text-brand">
                      +7 (800) 555-35-35
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Map Placeholder */}
          <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-zinc-100 lg:w-1/2">
            {/* In a real project, we'd use Yandex or Google Maps here */}
            <div className="absolute inset-0 flex items-center justify-center text-center p-10">
              <div className="flex flex-col items-center">
                <svg className="h-12 w-12 text-brand mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="font-bold text-zinc-500 italic">Интерактивная карта загружается...</p>
                <p className="text-xs text-zinc-400 mt-2 max-w-xs">
                  Здесь будет отображена карта с расположением всех дилерских центров ABC AUTO
                </p>
              </div>
            </div>
            {/* Background pattern to simulate map */}
            <div className="absolute inset-0 -z-10 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
        </div>
      </div>
    </section>
  );
};
