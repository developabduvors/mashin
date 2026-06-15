import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-zinc-900 pt-16 pb-8 text-zinc-400">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-3xl font-black italic tracking-tighter text-white">ABC AUTO</div>
            </Link>
            <p className="text-sm leading-relaxed">
              Официальный дилер ABC Auto в Москве. Широкий выбор автомобилей в наличии, выгодные условия кредитования и профессиональный сервис.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-[#C1121F] transition-colors">
                <span className="sr-only">VK</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.172 24h-14.344c-2.662 0-4.828-2.166-4.828-4.828v-14.344c0-2.662 2.166-4.828 4.828-4.828h14.344c2.662 0 4.828 2.166 4.828 4.828v14.344c0 2.662-2.166 4.828-4.828 4.828zm-1.854-15.823h-2.105c-.328 0-.485.228-.485.492 0 .584 2.115 5.093 2.115 5.093s.163.41-.122.41h-2.104c-.328 0-.585-.152-.757-.492l-1.325-3.085-1.123 3.085c-.172.34-.429.492-.757.492h-2.104c-.285 0-.122-.41-.122-.41s2.115-4.509 2.115-5.093c0-.264-.157-.492-.485-.492h-2.105c-.183 0-.158-.152-.158-.152l.001-.41c0-.183.15-.328.328-.328h4.524c.328 0 .585.152.757.492l1.123 3.085 1.123-3.085c.172-.34.429-.492.757-.492h4.524c.178 0 .328.145.328.328v.41c0 0 .025.152-.158.152z" /></svg>
              </a>
              {/* Add more social icons here */}
            </div>
          </div>
          
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Каталог</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li><Link href="/cars?condition=NEW" className="hover:text-white transition-colors">Новые авто</Link></li>
              <li><Link href="/cars?condition=USED" className="hover:text-white transition-colors">С пробегом</Link></li>
              <li><Link href="/cars?bodyType=SUV" className="hover:text-white transition-colors">Внедорожники</Link></li>
              <li><Link href="/cars?bodyType=SEDAN" className="hover:text-white transition-colors">Седаны</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">Подборки</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Услуги</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li><Link href="/credit" className="hover:text-white transition-colors">Автокредит</Link></li>
              <li><Link href="/trade-in" className="hover:text-white transition-colors">Trade-in</Link></li>
              <li><Link href="/insurance" className="hover:text-white transition-colors">Страхование</Link></li>
              <li><Link href="/service" className="hover:text-white transition-colors">Сервисный центр</Link></li>
              <li><Link href="/special-offers" className="hover:text-white transition-colors">Спецпредложения</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">Контакты</h4>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex flex-col">
                <span className="text-[10px] uppercase text-zinc-500">Адрес:</span>
                <span className="text-white">г. Москва, ул. Автозаводская, 23/15</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] uppercase text-zinc-500">Телефон:</span>
                <a href="tel:+78005553535" className="text-lg font-bold text-white hover:text-[#C1121F] transition-colors">+7 (800) 555-35-35</a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] uppercase text-zinc-500">Режим работы:</span>
                <span className="text-white">Ежедневно: 09:00 — 21:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest">
          <p>© 2026 ABC AUTO. Все права защищены.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
