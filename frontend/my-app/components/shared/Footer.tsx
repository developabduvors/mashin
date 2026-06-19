'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CATALOG_LINKS = [
  { href: '/cars?condition=NEW', label: 'Новые авто' },
  { href: '/cars?condition=USED', label: 'С пробегом' },
  { href: '/cars?bodyType=SUV', label: 'Внедорожники' },
  { href: '/cars?bodyType=SEDAN', label: 'Седаны' },
  { href: '/collections', label: 'Подборки' },
];

const SERVICE_LINKS = [
  { href: '/credit', label: 'Автокредит' },
  { href: '/trade-in', label: 'Trade-in' },
  { href: '/insurance', label: 'Страхование' },
  { href: '/service', label: 'Сервисный центр' },
  { href: '/special-offers', label: 'Спецпредложения' },
];

const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-6 inline-block font-display text-sm font-bold uppercase tracking-widest text-white">
    {children}
    <span className="mt-2 block h-0.5 w-8 bg-brand" />
  </h4>
);

export const Footer = () => {
  const pathname = usePathname();
  // Admin panelda public footer ko'rinmaydi.
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-zinc-400">
      <div className="absolute inset-0 bg-grid opacity-40" />
      {/* tepa qizil aksent chizig'i */}
      <div className="absolute inset-x-0 top-0 h-1 bg-brand" />

      {/* ===== CTA STRIP ===== */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row">
          <div>
            <h3 className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-white md:text-4xl">
              Не нашли нужное авто?
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Оставьте заявку — подберём автомобиль под ваш бюджет за 15 минут.
            </p>
          </div>
          <a
            href="tel:+78005553535"
            className="whitespace-nowrap rounded-lg bg-brand px-8 py-4 font-display text-sm font-bold uppercase italic tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(193,18,31,0.8)] transition-all hover:bg-brand-dark active:scale-95"
          >
            Подобрать авто
          </a>
        </div>
      </div>

      {/* ===== MAIN ===== */}
      <div className="relative container mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-flex">
              <span className="font-display text-3xl font-bold italic uppercase leading-none tracking-tight text-brand">
                ABC<span className="text-white">AUTO</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Официальный дилер ABC Auto в Москве. Широкий выбор автомобилей в наличии,
              выгодные условия кредитования и профессиональный сервис.
            </p>
            <div className="flex gap-3">
              {[
                {
                  label: 'VK',
                  path: 'M12.785 16.241s.288-.032.436-.194c.136-.148.131-.427.131-.427s-.018-1.304.588-1.496c.596-.19 1.362 1.26 2.173 1.818.614.422 1.08.33 1.08.33l2.17-.03s1.135-.07.597-.964c-.044-.073-.313-.661-1.612-1.87-1.36-1.265-1.18-1.06.46-3.246.998-1.33 1.397-2.143 1.272-2.49-.119-.332-.853-.244-.853-.244l-2.443.015s-.181-.025-.315.055c-.131.079-.215.262-.215.262s-.387 1.03-.902 1.907c-1.088 1.85-1.523 1.948-1.701 1.834-.414-.267-.31-1.075-.31-1.649 0-1.793.272-2.54-.529-2.733-.266-.064-.461-.107-1.141-.114-.873-.009-1.611.003-2.029.207-.278.136-.493.439-.362.457.161.021.526.098.72.361.25.34.241 1.103.241 1.103s.144 2.108-.336 2.37c-.33.18-.781-.187-1.751-1.866-.497-.86-.872-1.81-.872-1.81s-.072-.177-.201-.272c-.156-.115-.374-.151-.374-.151l-2.32.015s-.348.01-.476.161c-.114.135-.009.413-.009.413s1.817 4.252 3.875 6.394c1.887 1.964 4.03 1.835 4.03 1.835z',
                },
                {
                  label: 'Telegram',
                  path: 'M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
                },
                {
                  label: 'WhatsApp',
                  path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413',
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-white ring-1 ring-white/10 transition-all hover:bg-brand hover:ring-brand"
                >
                  <span className="sr-only">{s.label}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <FooterHeading>Каталог</FooterHeading>
            <ul className="flex flex-col gap-3.5 text-sm">
              {CATALOG_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Услуги</FooterHeading>
            <ul className="flex flex-col gap-3.5 text-sm">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Контакты</FooterHeading>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Адрес</span>
                <span className="text-white">г. Москва, ул. Автозаводская, 23/15</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Телефон</span>
                <a
                  href="tel:+78005553535"
                  className="font-display text-xl font-bold text-white transition-colors hover:text-brand"
                >
                  +7 (800) 555-35-35
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Режим работы</span>
                <span className="text-white">Ежедневно: 09:00 — 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-[10px] uppercase tracking-widest md:flex-row">
          <p>© 2026 ABC AUTO. Все права защищены.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="transition-colors hover:text-brand">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="transition-colors hover:text-brand">
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
