'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { RatingItem } from '@/lib/types';

export const Ratings = () => {
  const [ratings, setRatings] = useState<RatingItem[]>([]);

  useEffect(() => {
    api.ratings.getAll().then(setRatings).catch(console.error);
  }, []);

  if (ratings.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-12">
          Нам доверяют
        </h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ratings.map((rating) => (
            <a 
              key={rating.id}
              href={rating.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-100 font-black text-[#C1121F]">
                {rating.rating}
              </div>
              <div>
                <h3 className="font-bold text-zinc-900">{rating.platform}</h3>
                <div className="mt-1 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(rating.rating) ? 'text-yellow-400' : 'text-zinc-200'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {rating.recommendPercent && (
                  <p className="mt-2 text-xs font-medium text-zinc-400">
                    Рекомендуют {rating.recommendPercent}% пользователей
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
