'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/favorites';
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    // Backend parolni min 8 talab qiladi — bu yerda ham ogohlantiramiz.
    if (password.length < 8) {
      setError('Пароль должен быть не менее 8 символов.');
      return;
    }
    setLoading(true);
    try {
      await register({ fullName, email, phone, password });
      router.push(next);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-zinc-50 px-4 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl"
      >
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-zinc-900">
          Регистрация
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Создайте аккаунт, чтобы сохранять Избранное.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <Input
            label="Имя"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Иван Иванов"
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
          />
          <Input
            label="Телефон"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 900 000-00-00"
            required
          />
          <Input
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Минимум 8 символов"
            required
          />

          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="mt-2 w-full">
            {loading ? 'Создаём…' : 'Зарегистрироваться'}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Уже есть аккаунт?{' '}
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="font-semibold text-brand hover:underline"
          >
            Войти
          </Link>
        </p>

        <div className="mt-4 border-t border-zinc-100 pt-4 text-center">
          <Link
            href="/admin/login"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-brand"
          >
            Вход для администратора →
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-zinc-400">Загрузка…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
