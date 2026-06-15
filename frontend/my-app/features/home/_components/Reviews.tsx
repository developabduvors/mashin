'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ReviewItem } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export const Reviews = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    api.reviews.getAll().then(setReviews).catch(console.error);
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-12">
          Отзывы наших клиентов
        </h2>
        
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="flex h-[350px] min-w-[300px] flex-shrink-0 flex-col rounded-2xl bg-zinc-50 p-8 md:min-w-[400px]"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-zinc-200" />
                <div>
                  <h3 className="font-bold text-zinc-900">{review.author}</h3>
                  <p className="text-xs text-zinc-400">{review.source || 'Покупатель'}</p>
                </div>
              </div>
              
              <div className="mt-6 flex-1 text-sm leading-relaxed text-zinc-600 line-clamp-6">
                "{review.text}"
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-4 w-4 ${i < (review.rating || 5) ? 'text-yellow-400' : 'text-zinc-200'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-bold text-zinc-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
