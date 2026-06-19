'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { BlogListItem } from '@/lib/types';

function formatDate(iso?: string): string {
  if (!iso) return 'Недавно';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const BlogList = () => {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.blog
      .getAll()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-4 h-52 rounded-2xl bg-zinc-100" />
            <div className="h-4 w-1/3 rounded bg-zinc-100" />
            <div className="mt-3 h-5 w-3/4 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-lg text-zinc-400">Статей пока нет. Загляните позже!</p>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* ===== Главная статья ===== */}
        <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative h-72 w-full overflow-hidden rounded-3xl lg:h-full lg:min-h-[340px]">
            <Image
              src={featured.coverUrl || '/placeholder-blog.jpg'}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
              {formatDate(featured.publishedAt)}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-zinc-900 group-hover:text-brand md:text-4xl">
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="mt-5 max-w-lg text-zinc-600">{featured.excerpt}</p>
            )}
            <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand">
              Читать статью <span aria-hidden>→</span>
            </span>
          </div>
        </Link>

        {/* ===== Остальные статьи ===== */}
        {rest.length > 0 && (
          <>
            <div className="mt-16 flex items-baseline justify-between border-b border-zinc-900 pb-4">
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-zinc-900">
                Все статьи
              </h3>
              <span className="font-display text-sm font-bold uppercase tracking-wider text-zinc-400">
                {posts.length} материалов
              </span>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col">
                  <div className="relative h-52 w-full overflow-hidden rounded-2xl">
                    <Image
                      src={post.coverUrl || '/placeholder-blog.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="mt-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    {formatDate(post.publishedAt)}
                  </span>
                  <h4 className="mt-2 font-bold leading-snug text-zinc-900 line-clamp-2 group-hover:text-brand">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
