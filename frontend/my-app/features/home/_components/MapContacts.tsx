'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ContactsResult } from '@/lib/types';

// Yandex map-widget — API kalitisiz interaktiv xarita.
// Koordinata bo'lsa aniq nuqta, bo'lmasa manzil matni bo'yicha qidiruv.
const DEFAULT_QUERY = 'Москва, МКАД 19 км';

const buildMapSrc = (dealer?: { address: string; lat?: number; lng?: number }) => {
  if (dealer?.lat != null && dealer?.lng != null) {
    return `https://yandex.ru/map-widget/v1/?ll=${dealer.lng},${dealer.lat}&z=16&pt=${dealer.lng},${dealer.lat},pm2rdm`;
  }
  const text = encodeURIComponent(dealer?.address || DEFAULT_QUERY);
  return `https://yandex.ru/map-widget/v1/?text=${text}&z=16`;
};

export const MapContacts = () => {
  const [contacts, setContacts] = useState<ContactsResult | null>(null);

  useEffect(() => {
    api.contacts.get('moskva').then(setContacts).catch(console.error);
  }, []);

  const mapSrc = buildMapSrc(contacts?.dealerships[0]);

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

          {/* Right: Interactive Yandex map (keyless widget) */}
          <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-zinc-100 lg:w-1/2">
            <iframe
              src={mapSrc}
              title="Карта ABC AUTO"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};
