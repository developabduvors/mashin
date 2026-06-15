import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind class birlashtiruvchi: clsx (shartli class) + tailwind-merge
 * (to'qnashuvni hal qiladi — OXIRGI/uzatilgan class yutadi).
 * Masalan cn('bg-white text-zinc-900', 'bg-zinc-800 text-white') → 'bg-zinc-800 text-white'.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Locale-independent number formatting (space-separated thousands).
 * Server (Node) va client (browser) bir xil natija beradi — hydration mismatch yo'q.
 * toLocaleString() ishlatmaymiz: u runtime locale'iga bog'liq.
 */
export function formatNumber(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

