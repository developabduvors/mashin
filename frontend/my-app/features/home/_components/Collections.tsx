'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CollectionListItem } from '@/lib/types';

export const Collections = () => {
  const [collections, setCollections] = useState<CollectionListItem[]>([]);

  useEffect(() => {
    api.collections.getAll().then(setCollections).catch(console.error);
  }, []);

  if (collections.length === 0) return null;

  return (
    <section className="py-20 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-12 dark:text-zinc-50">
          Наши подборки
        </h2>
        
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
          {collections.map((collection) => (
            <Link 
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group relative h-[300px] min-w-[300px] flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:min-w-[400px]"
            >
              <Image
                src={collection.imageUrl || '/placeholder-collection.jpg'}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-black uppercase tracking-tighter">
                  {collection.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-zinc-300">
                  {collection.carCount} автомобилей
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
