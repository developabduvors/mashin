'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BlogListItem } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export const AboutBlog = () => {
  const [posts, setPosts] = useState<BlogListItem[]>([]);

  useEffect(() => {
    api.blog.getAll().then((data) => setPosts(data.slice(0, 4))).catch(console.error);
  }, []);

  return (
    <section className="py-20 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* About Section */}
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 mb-8">
              О компании ABC AUTO
            </h2>
            <div className="relative h-64 w-full overflow-hidden rounded-3xl mb-8">
              <Image
                src="/home-glavnaya.png" // Replace with real company photo
                alt="О компании"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4 text-zinc-600">
              <p>
                ABC Auto — это не просто автосалон, это команда профессионалов, которая уже более 10 лет помогает людям находить их идеальные автомобили. Мы являемся официальным партнером ведущих мировых брендов.
              </p>
              <p>
                Наш приоритет — прозрачность сделок и высочайший уровень сервиса. Мы предлагаем полный спектр услуг: от продажи и выкупа до кредитования и сервисного обслуживания.
              </p>
            </div>
            <Button variant="outline" className="mt-8 font-bold uppercase tracking-wider text-xs">
              Подробнее о нас
            </Button>
          </div>

          {/* Blog Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
                Блог
              </h2>
              <Link href="/blog" className="text-xs font-bold uppercase tracking-wider text-[#C1121F] hover:underline">
                Все статьи
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {posts.map((post) => (
                <Link 
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl mb-4">
                    <Image
                      src={post.coverUrl || '/placeholder-blog.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-zinc-400">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Недавно'}
                  </span>
                  <h3 className="mt-2 font-bold text-zinc-900 line-clamp-2 group-hover:text-[#C1121F]">
                    {post.title}
                  </h3>
                </Link>
              ))}
              {posts.length === 0 && (
                <p className="col-span-2 text-center text-zinc-400 py-10">Статей пока нет</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
