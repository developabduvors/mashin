'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getBuyerToken } from '@/lib/buyer-auth';
import { setAdminSession } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/favorites';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      // ADMIN bo'lsa: admin sessiyasini ham o'rnatamiz va admin panelга yo'naltiramiz.
      if (user.role === 'ADMIN') {
        const token = getBuyerToken();
        if (token) setAdminSession(user, token);
        router.push('/admin');
      } else {
        router.push(next);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-50">
          Вход
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Войдите, чтобы сохранять автомобили в Избранное.
        </p>

        <div className="mt-8 flex flex-col gap-4">
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
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="mt-2 w-full">
            {loading ? 'Входим…' : 'Войти'}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Нет аккаунта?{' '}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="font-semibold text-brand hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>

        <div className="mt-4 border-t border-zinc-100 pt-4 text-center dark:border-zinc-800">
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-zinc-400">Загрузка…</div>}>
      <LoginForm />
    </Suspense>
  );
}
