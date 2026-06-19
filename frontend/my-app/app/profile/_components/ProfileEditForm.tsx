'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const darkField = 'dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100';

export const ProfileEditForm = () => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const updated = await api.auth.updateMe({
        fullName: fullName.trim(),
        phone: phone.trim() || null,
      });
      updateUser(updated);
      setMsg({ type: 'ok', text: 'Профиль обновлён' });
    } catch (err) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Ошибка' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="font-display text-lg font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-50">
        Личные данные
      </h2>
      <div className="mt-5 flex flex-col gap-4">
        <Input
          label="Имя"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={darkField}
          required
        />
        <Input
          label="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          className={darkField}
        />
        {/* Email o'zgartirilmaydi — login identifikatori */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</label>
          <input
            value={user?.email ?? ''}
            disabled
            className="h-10 w-full rounded-md border border-zinc-200 bg-zinc-100 px-3 text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/50"
          />
        </div>

        {msg && (
          <p
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              msg.type === 'ok'
                ? 'bg-green-500/10 text-green-600'
                : 'bg-red-500/10 text-red-600'
            }`}
          >
            {msg.text}
          </p>
        )}

        <Button type="submit" variant="primary" disabled={saving} className="mt-1 w-full font-bold uppercase">
          {saving ? 'Сохраняем…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
};
