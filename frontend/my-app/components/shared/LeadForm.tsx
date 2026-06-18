'use client';

import React, { useState } from 'react';
import { LeadType, LeadPayload } from '@/lib/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LeadFormProps {
  type: LeadType;
  carId?: string;
  brandId?: string;
  modelId?: string;
  // Credit ariza uchun ixtiyoriy — kalkulyator qiymatlarini birga yuboradi.
  creditAmount?: number;
  termMonths?: number;
  downPayment?: number;
  note?: string;
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

export const LeadForm = ({
  type,
  carId,
  brandId,
  modelId,
  creditAmount,
  termMonths,
  downPayment,
  note,
  title,
  subtitle,
  onSuccess
}: LeadFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: LeadPayload = {
        type,
        name: formData.name,
        phone: formData.phone,
        carId,
        brandId,
        modelId,
        creditAmount,
        termMonths,
        downPayment,
        note,
        source: 'Website',
      };

      await api.leads.create(payload);
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold">Спасибо!</h3>
        <p className="mt-2 text-zinc-600">Ваша заявка принята. Менеджер свяжется с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
      {(title || subtitle) && (
        <div className="mb-4 text-center">
          {title && <h3 className="text-2xl font-black uppercase text-zinc-900">{title}</h3>}
          {subtitle && <p className="mt-2 text-sm text-zinc-600">{subtitle}</p>}
        </div>
      )}
      
      <Input
        placeholder="Ваше имя"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        placeholder="+7 (___) ___-__-__"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />
      
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      
      <Button 
        type="submit" 
        variant="primary" 
        className="mt-4 w-full uppercase"
        disabled={loading}
      >
        {loading ? 'Отправка...' : 'Получить предложение'}
      </Button>
      
      <p className="mt-4 text-center text-[10px] text-zinc-400">
        Нажимая кнопку «Получить предложение», я даю согласие на обработку моих персональных данных.
      </p>
    </form>
  );
};
