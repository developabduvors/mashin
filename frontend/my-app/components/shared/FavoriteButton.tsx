'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  carId: string;
  className?: string;
}

// CarCard rasmidagi yurakcha. Mehmon (login yo'q) bossa → /login ga.
export const FavoriteButton = ({ carId, className }: FavoriteButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const [busy, setBusy] = useState(false);

  const active = isFavorite(carId);

  async function onClick(e: React.MouseEvent) {
    // CarCard ichidagi Link ustida — navigatsiyani to'xtatamiz.
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      await toggleFavorite(carId);
    } catch {
      /* AuthContext rollback qiladi; jim qolamiz */
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? 'Убрать из избранного' : 'В избранное'}
      aria-pressed={active}
      className={cn(
        'absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full',
        'bg-white/90 shadow-md backdrop-blur transition-all hover:scale-110 active:scale-95',
        busy && 'opacity-60',
        className,
      )}
    >
      <svg
        className={cn('h-5 w-5 transition-colors', active ? 'text-brand' : 'text-zinc-400')}
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};
