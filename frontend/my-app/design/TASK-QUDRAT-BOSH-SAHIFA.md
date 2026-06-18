# 👤 Qudrat — Bosh sahifa (Главная) `app/page.tsx` `[katta]`

**Dizayn:** `design/home-glavnaya.svg` (manba, 1920×9756) · ko'rish uchun `design/home-glavnaya.png`
**Frontend:** `frontend/my-app/app/page.tsx`
**Backend:** tayyor — faqat iste'mol qilasiz. API base: `NEXT_PUBLIC_API_BASE` (`.env.local`).
**Shart:** Faza 0 tugagan bo'lishi kerak (`lib/api.ts`, `lib/types.ts`, `CarCard`, `LeadForm`, Header/Footer). Takror yozmang — Bois yozgan komponentlarni import qiling.

> ⚠️ Next.js 16 — kod yozishdan oldin `node_modules/next/dist/docs/` ni o'qing. Default: Server Component'da fetch, faqat forma/slayder/state kerak joyda `"use client"`.

---

## Sahifa tuzilmasi (yuqoridan pastga) — har blok → endpoint

Dizaynda **12 blok** bor. Har birini alohida komponent qil (`app/(home)/_components/` yoki `features/home/`).

### 1. Hero / banner `[CALLBACK lead]`
- Katta banner: "Грандиозная распродажа тестового парка!" + "Узнай свою цену!" + mashina rasmi
- Slayder (chap/o'ng strelka + pastdagi nuqtalar) — bir nechta slayd
- CTA tugma → `LeadForm` modal, `POST /api/leads` `type: "CALLBACK"`
- 📦 Statik kontent (rasm/matn dizayndan). Slaydlar uchun backend endpoint **yo'q** → hozircha hardcode massiv yoki keyin admin'dan banner qo'shiladi.

### 2. Brendlar bo'yicha tezkor tanlov + "Быстрый подбор авто"
- Chapda: brend logolari to'ri (KIA, Hyundai, Skoda, VW, Chevrolet, ...) → `GET /api/brands`
  - Bosilganda `/cars?brand=<slug>` ga o'tadi
- O'ngda: "Быстрый подбор авто" mini-filtr (Цена slayderi, тип кузова, марка) → tanlovlar `/cars?...` query'ga yo'naltiradi
  - Marka select → `GET /api/brands`
- 📦 `GET /api/brands` → `BrandWithModels[]` (`{ id, name, slug, logoUrl, models[] }`)

### 3. "Автомобили в наличии с ПТС" — mashina grid `[CarCard]`
- 3 ustunli CarCard grid (rasm, "Skoda Octavia 1.6 MPI MT Active", narx, oylik to'lov badge, ❤️)
- 📦 `GET /api/cars?hasPts=true&inStock=true&limit=6` → `Paginated<CarListItem>`
  - `CarListItem`: `{ id, brand, model, trim, year, condition, bodyType, price, monthlyFrom, hasPts, inStock, coverImage }`
- `components/CarCard.tsx` ni import qil (Bois yozadi — qayta yozma)

### 4. "Наши подборки" — podborkalar `[GET /api/collections]`
- Gorizontal kartochkalar (rasm + sarlavha), bosilganda `/collections/<slug>`
- 📦 `GET /api/collections` → `CollectionListItem[]` (`{ id, title, slug, imageUrl, carCount }`)

### 5. "Перебьём предложения конкурентов" CTA banner `[BEAT_OFFER lead]`
- Qizil banner + tugma → `LeadForm`, `POST /api/leads` `type: "BEAT_OFFER"`
- 📦 Statik banner + lead forma

### 6. "Спецпредложения" — kredit dasturlari `[GET /api/credit-programs]`
- 3 kartochka ("Первый автомобиль", "Семейный автомобиль", "Экспресс-кредит" + "1.9% по льготной ставке") + "Узнать больше"
- Strelkali karusel
- 📦 `GET /api/credit-programs` → `CreditProgramItem[]` (`{ id, title, slug, kind, ratePercent, description, imageUrl, sortOrder }`)
  - `ratePercent` → "1.9%" · "Узнать больше" → `/credit-programs/<slug>` yoki modal

### 7. "Заявка на автокредит" — kalkulyator + lead `[CREDIT_APPLICATION lead]`
- Chapda kalkulyator: Марка/Модель/Комплектация select + Сумма кредита + Срок (6 мес. slayder) + Первоначальный взнос + Остаток
  - Марка/Модель select → `GET /api/brands` (model = tanlangan brendning `models[]`)
- O'ngda: "Получить выгоду 300 000 ₽" + Ваше имя + Ваш телефон + "ПОЛУЧИТЬ ПРЕДЛОЖЕНИЕ"
- 📦 `POST /api/leads` `type: "CREDIT_APPLICATION"`:
  - `{ phone (majburiy), name?, brandId?, modelId?, trim?, creditAmount?, termMonths? (6–84), downPayment?, source?, note? }`
  - ⚠️ `brandId`/`modelId` = UUID (select'da slug emas, **id** yubor). `termMonths` int 6–84.
- 🧮 Oylik to'lov hisobi frontend'da (annuitet) — backend hisoblamaydi, faqat ariza saqlaydi.

### 8. "Банки-партнёры" `[GET /api/partner-banks]`
- Logolar qatori (АльфаСтрахование, ВСК, Совкомбанк, Росгосстрах, ...)
- 📦 `GET /api/partner-banks` → `PartnerBankItem[]` (`{ id, name, logoUrl, isInsurer }`)

### 9. "Нам доверяют" — reytinglar `[GET /api/ratings]`
- "Сайт отзовик" kartochkalar (Рекомендуют 90%, ⭐ 4.5) + Яндекс Карты / Google Maps reyting bloklari
- 📦 `GET /api/ratings` → `RatingItem[]` (`{ id, platform, rating, recommendPercent, url }`)
  - `platform` → "Яндекс Карты"/"Google Maps", `rating` → 4.5/4.1, `recommendPercent` → 90

### 10. "Отзывы" — sharhlar (video) `[GET /api/reviews]`
- 3 kartochka: video preview (play tugma) + ism (Сергей Васильев) + matn + "Подробнее"
- Strelkali karusel
- 📦 `GET /api/reviews` → `ReviewItem[]` (`{ id, author, text, source, rating, createdAt }`)
  - Video URL alohida maydon yo'q → matnli sharh; video bo'lsa `source`'ni tekshir yoki keyin qo'shiladi

### 11. "О компании" + "Блог" `[GET /api/blog]`
- "О компании": matn + jamoa rasmi (statik)
- "Блог" + "Все статьи": 4 maqola kartochka (rasm, sana, sarlavha) → `/blog/<slug>`
- 📦 `GET /api/blog` → `BlogListItem[]` (`{ id, title, slug, excerpt, coverUrl, publishedAt }`)
- Tablar: Автозайм / Трейд-ин / Покупка (matn statik yoki keyin)

### 12. "Об автосалоне ABC" + xarita + Footer kontaktlar `[GET /api/contacts]`
- Matn + xarita (manzil pini, "Как до нас добраться")
- Footer: kontaktlar, telefonlar, ish vaqti, shahar
- 📦 `GET /api/contacts?city=<slug>` → `ContactsResult` (`{ city, dealerships[] }`)
  - `dealerships[]`: `{ id, address, phones[], schedule, lat, lng }` → xarita uchun `lat/lng`
- Shahar selektori (Header) → `GET /api/cities` → `CityItem[]` (`{ id, name, slug, isDefault }`), default Москва

---

## ✅ Checklist
- [ ] 1. Hero slayder + CALLBACK lead
- [ ] 2. Brendlar grid + tezkor tanlov → `/api/brands`
- [ ] 3. "В наличии с ПТС" CarCard grid → `/api/cars?hasPts=true&inStock=true`
- [ ] 4. Наши подборки → `/api/collections`
- [ ] 5. "Перебьём предложения" BEAT_OFFER lead
- [ ] 6. Спецпредложения → `/api/credit-programs`
- [ ] 7. Автокредит kalkulyator + CREDIT_APPLICATION lead (brandId/modelId = UUID!)
- [ ] 8. Банки-партнёры → `/api/partner-banks`
- [ ] 9. Нам доверяют → `/api/ratings`
- [ ] 10. Отзывы → `/api/reviews`
- [ ] 11. О компании + Блог → `/api/blog`
- [ ] 12. Об автосалоне + xarita + Footer → `/api/contacts`, shahar → `/api/cities`

## ⚠️ Eslatmalar
- Lead formalardan **4 tip** ishlatasiz: `CALLBACK`, `BEAT_OFFER`, `CREDIT_APPLICATION` (+ detal sahifada `CAR_INQUIRY` — Bois).
- Telefon majburiy, qolgani ixtiyoriy. Rate-limit: 10 ariza/daqiqa/IP.
- DB hali ulanmagan → endpointlar bo'sh massiv qaytarishi mumkin. **Bo'sh holat (empty state)** ni ham chiz.
- Server Component'da fetch qil (SEO), forma/slayder/kalkulyator = `"use client"`.
- `npm run build` toza bo'lishi shart. Alohida branch + PR.
