'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { BlogDetail } from '@/lib/types';

function formatDate(iso?: string): string {
  if (!iso) return 'Недавно';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.blog
      .getBySlug(slug as string)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-24 text-center text-zinc-400">Загрузка статьи...</div>;
  }

  if (notFound || !post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-lg text-zinc-400">Статья не найдена.</p>
        <Link href="/blog" className="mt-6 inline-block text-sm font-bold uppercase tracking-wide text-brand hover:underline">
          ← Все статьи
        </Link>
      </div>
    );
  }

  // Body matni xavfsiz: HTML emas, ikkita yangi qator bilan ajratilgan paragraflar.
  const paragraphs = (post.body ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="bg-white">
      {/* ===== HERO ===== */}
      <header className="border-b border-zinc-200">
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
          <Link href="/blog" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-brand">
            ← Блог
          </Link>
          <span className="mt-6 block text-xs font-bold uppercase tracking-[0.3em] text-brand">
            {formatDate(post.publishedAt)}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-zinc-900 md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-6 text-lg text-zinc-600">{post.excerpt}</p>}
        </div>
      </header>

      {/* ===== COVER ===== */}
      {post.coverUrl && (
        <div className="container mx-auto max-w-4xl px-4 pt-10">
          <div className="relative h-64 w-full overflow-hidden rounded-3xl md:h-[440px]">
            <Image src={post.coverUrl} alt={post.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* ===== BODY ===== */}
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        {paragraphs.length > 0 ? (
          <div className="space-y-6 text-[17px] leading-relaxed text-zinc-700">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">Содержимое статьи скоро появится.</p>
        )}

        <div className="mt-14 border-t border-zinc-200 pt-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand hover:underline">
            ← Все статьи
          </Link>
        </div>
      </div>
    </article>
  );
}
