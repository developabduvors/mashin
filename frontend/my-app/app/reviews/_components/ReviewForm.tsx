'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewItem } from '@/lib/types';

// Interaktiv yulduz tanlagich (1–5).
const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          aria-label={`${n} yulduz`}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`h-7 w-7 ${n <= (hover || value) ? 'text-yellow-400' : 'text-zinc-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export const ReviewForm = ({
  onCreated,
}: {
  onCreated: (review: ReviewItem) => void;
}) => {
  const { user, ready } = useAuth();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sessiya tiklanmaguncha hech nima ko'rsatmaymiz (titrashni oldini oladi).
  if (!ready) return null;

  // Login qilmagan — kirishga taklif.
  if (!user) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-zinc-900">
          Поделитесь впечатлением
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          Чтобы оставить отзыв, войдите в аккаунт.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark"
        >
          Войти
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 10) {
      setError('Отзыв должен содержать минимум 10 символов');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const review = await api.reviews.create({ text: text.trim(), rating });
      onCreated(review); // ro'yxat boshiga qo'shiladi
      setText('');
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить отзыв');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"
    >
      <h3 className="font-display text-xl font-bold uppercase tracking-tight text-zinc-900">
        Оставить отзыв
      </h3>
      <p className="mt-1 text-sm text-zinc-400">от имени {user.fullName}</p>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold text-zinc-700">Оценка</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold text-zinc-700">
          Ваш отзыв
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Расскажите о вашем опыте покупки…"
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none"
        />
        <div className="mt-1 text-right text-xs text-zinc-400">{text.length}/1000</div>
      </div>

      {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
      >
        {submitting ? 'Отправка…' : 'Опубликовать отзыв'}
      </button>
    </form>
  );
};
