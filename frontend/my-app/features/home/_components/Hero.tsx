'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/shared/LeadForm';

const SLIDES = [
  {
    id: 1,
    title: 'Грандиозная распродажа тестового парка!',
    subtitle: 'Узнай свою цену на автомобили с пробегом до 10 000 км',
    image: '/home-glavnaya.png',
    buttonText: 'Узнать цену',
  },
  {
    id: 2,
    title: 'Выгода до 300 000 ₽ на все новые авто',
    subtitle: 'Государственная программа кредитования от 1.9%',
    image: '/design/bois/9-ekspress-kredit.jpg',
    buttonText: 'Получить выгоду',
  }
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative h-[550px] w-full overflow-hidden bg-zinc-900 lg:h-[700px]">
      {/* Background Image/Slide */}
      {SLIDES.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center scale-105 animate-slow-zoom"
            priority={idx === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="container relative z-20 mx-auto flex h-full flex-col justify-center px-4 text-white">
        <div className="max-w-3xl">
          <div className="inline-block rounded-md bg-[#C1121F] px-4 py-1.5 text-[12px] font-black uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-left duration-700">
            Спецпредложение
          </div>
          <h1 className="text-4xl font-black uppercase leading-[1.1] tracking-tighter md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-left duration-700 delay-100">
            {SLIDES[currentSlide].title}
          </h1>
          <p className="mt-8 text-xl font-medium md:text-2xl text-zinc-200 animate-in fade-in slide-in-from-left duration-700 delay-200">
            {SLIDES[currentSlide].subtitle}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <Button 
              size="lg" 
              className="h-16 px-12 text-xl font-black uppercase italic tracking-wider shadow-2xl active:scale-95 transition-transform"
              onClick={() => setIsModalOpen(true)}
            >
              {SLIDES[currentSlide].buttonText}
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="h-16 px-12 text-xl font-black uppercase italic tracking-wider bg-white/10 text-white border-white/20 backdrop-blur-md hover:bg-white/20 transition-all"
            >
              Подробнее
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              idx === currentSlide ? 'bg-[#C1121F] w-12' : 'bg-white/30 w-6 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      <div className="absolute right-12 bottom-12 z-30 hidden lg:flex gap-4">
        <button
          onClick={prevSlide}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#C1121F] hover:border-[#C1121F]"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-[#C1121F] hover:border-[#C1121F]"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LeadForm 
          type="CALLBACK" 
          title="Получить предложение"
          subtitle="Оставьте заявку, и мы подготовим для вас индивидуальное предложение!"
          onSuccess={() => setTimeout(() => setIsModalOpen(false), 3000)}
        />
      </Modal>

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }
      `}</style>
    </section>
  );
};
