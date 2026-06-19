import type { LeadStatus, LeadType } from '@/lib/types';

// Holatlar — o'zbekcha yorliq + rang (badge uchun).
export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'Yangi',
  IN_PROGRESS: 'Jarayonda',
  CONTACTED: "Bog'lanildi",
  CONVERTED: 'Yakunlandi',
  REJECTED: 'Rad etildi',
};

export const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  CONTACTED: 'bg-violet-100 text-violet-700',
  CONVERTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export const STATUS_ORDER: LeadStatus[] = [
  'NEW',
  'IN_PROGRESS',
  'CONTACTED',
  'CONVERTED',
  'REJECTED',
];

// Lead turlari — o'zbekcha.
export const TYPE_LABELS: Record<LeadType, string> = {
  CREDIT_APPLICATION: 'Kredit arizasi',
  BEAT_OFFER: 'Narxni tushirish',
  CALLBACK: "Qo'ng'iroq so'rovi",
  CAR_INQUIRY: "Mashina bo'yicha",
};

export const TYPE_STYLES: Record<LeadType, string> = {
  CREDIT_APPLICATION: 'bg-brand/10 text-brand',
  BEAT_OFFER: 'bg-zinc-200 text-zinc-700',
  CALLBACK: 'bg-zinc-200 text-zinc-700',
  CAR_INQUIRY: 'bg-zinc-200 text-zinc-700',
};

export const TYPE_ORDER: LeadType[] = [
  'CREDIT_APPLICATION',
  'CAR_INQUIRY',
  'CALLBACK',
  'BEAT_OFFER',
];
