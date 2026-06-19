'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser, isAuthed, logout } from '@/lib/auth';
import type { AuthUser } from '@/lib/types';

const NAV = [
  { href: '/admin', label: 'Boshqaruv paneli', exact: true },
  { href: '/admin/cars', label: 'Mashinalar' },
  { href: '/admin/purchases', label: 'Sotuvlar' },
  { href: '/admin/leads', label: 'Xabarlar' },
  { href: '/admin/credits', label: 'Kredit arizalari' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/admin/login';
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!isAuthed()) {
      router.replace('/admin/login');
      return;
    }
    setUser(getUser());
    setReady(true);
  }, [isLogin, pathname, router]);

  // Login sahifasi o'z to'liq-ekran dizayniga ega — chrome'siz.
  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-400">
        Yuklanmoqda...
      </div>
    );
  }

  function onLogout() {
    logout();
    router.replace('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="flex w-60 flex-shrink-0 flex-col border-r border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-6 py-5">
          <Link href="/admin" className="font-display text-xl font-bold uppercase tracking-tight text-zinc-900">
            ABC <span className="text-brand">Admin</span>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-brand text-white' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200 p-3">
          {user && (
            <p className="px-3 pb-2 text-xs text-zinc-400 truncate" title={user.email}>
              {user.email}
            </p>
          )}
          <button
            onClick={onLogout}
            className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Chiqish
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-10">{children}</main>
    </div>
  );
}
