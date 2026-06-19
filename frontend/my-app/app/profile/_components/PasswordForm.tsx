'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const darkField = 'dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100';

export const PasswordForm = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) {
      setMsg({ type: 'err', text: 'Новый пароль — минимум 8 символов' });
      return;
    }
    if (next !== confirm) {
      setMsg({ type: 'err', text: 'Пароли не совпадают' });
      return;
    }
    setSaving(true);
    try {
      await api.auth.changePassword({ currentPassword: current, newPassword: next });
      setMsg({ type: 'ok', text: 'Пароль изменён' });
      setCurrent('');
      setNext('');
      setConfirm('');
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
        Сменить пароль
      </h2>
      <div className="mt-5 flex flex-col gap-4">
        <Input
          label="Текущий пароль"
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={darkField}
          required
        />
        <Input
          label="Новый пароль"
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="минимум 8 символов"
          className={darkField}
          required
        />
        <Input
          label="Повторите новый пароль"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={darkField}
          required
        />

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
          {saving ? 'Сохраняем…' : 'Изменить пароль'}
        </Button>
      </div>
    </form>
  );
};
