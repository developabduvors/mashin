# ABC Auto — Frontend vazifalari (noldan)

**Sana:** 2026-06-13
**Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript
**Joy:** `frontend/my-app/`
**Holat:** Bo'sh — hali faqat `create-next-app` shabloni. Default `app/page.tsx` turibdi, hech qanday sahifa/komponent/API client yo'q.

> ⚠️ **Muhim:** Bu Next.js versiyasi training data'dan farq qiladi. Kod yozishdan oldin `node_modules/next/dist/docs/` ichidagi tegishli qo'llanmani o'qing (`AGENTS.md` ogohlantiradi).
> API base: `http://localhost:<PORT>/api`. Public endpointlar autentifikatsiyasiz.
> Har vazifa alohida branch + PR. `npm run build` toza bo'lishi shart.

---

## 🧱 FAZA 0 — Poydevor (BIRGA, parallel ishlashdan OLDIN)

Bu tugamaguncha sahifa yozilmaydi. Ikkalangiz bo'lib bajaring:

### 0.1 Tozalash va sozlash `[kichik]`
- [ ] Default `app/page.tsx` va `app/globals.css` ni tozalash (Vercel/Next demo'sini olib tashlash)
- [ ] `.env.local` → `NEXT_PUBLIC_API_BASE=http://localhost:4000/api` (backend portiga qarab)
- [ ] Papka strukturasi: `app/`, `components/`, `lib/`, `features/`

### 0.2 Dizayn tokenlari (Figma'dan) `[o'rta]`
- [ ] Ranglar, shрифт, spacing → `app/globals.css` (Tailwind v4 `@theme`)
- [ ] Logo, favicon, asosiy rasmlar `public/` ga

### 0.3 API client `[o'rta]`
- [ ] `lib/api.ts` — `apiGet`/`apiPost` (base URL `.env` dan, JSON, xato → throw)
- [ ] `lib/types.ts` — backend DTO tiplari (CarListItem, CarDetail, CollectionDetail, CreditProgramItem, LeadCreated, ...)

### 0.4 Umumiy UI komponentlar `[o'rta]`
- [ ] `components/ui/` — Button, Input, Select, Modal, Spinner
- [ ] `components/LeadForm.tsx` — qayta ishlatiluvchi forma (telefon + ixtiyoriy ism) → `POST /api/leads`
- [ ] `components/CarCard.tsx` — mashina kartochkasi (katalog + podborka + bosh sahifa hammasi ishlatadi)
- [ ] `components/layout/` — Header (logo, shahar selektori, telefon), Footer
- [ ] `app/layout.tsx` — Header/Footer global

> Kim qaysi 0.x ni oladi — kelishib oling. Tavsiya: **Bois** 0.3+0.4 (api+CarCard+LeadForm), **Qudrat** 0.1+0.2 (sozlash+tokenlar). Keyin parallel.

---

## 👤 Bois — Katalog · Mashina · Kredit
> 📄 **To'liq spec + dizayn:** `frontend/my-app/design/TASK-BOIS-KATALOG-MASHINA-KREDIT.md` (har sahifa → endpoint + DTO). Previewlar: `design/bois/`.

### 1. Katalog sahifasi `app/cars/page.tsx` `[katta]`
- [ ] CarCard grid → `GET /api/cars?...`
- [ ] Filtr panel: brand, model, narx (min/max), kuzov, yoqilg'i, uzatma, yil, holat
- [ ] Brend dropdown → `GET /api/brands`
- [ ] Saralash + pagination (page/limit)
- [ ] Filtrlar URL query'da (refresh'da saqlanadi)

### 2. Mashina detali `app/cars/[id]/page.tsx` `[katta]`
- [ ] To'liq sahifa → `GET /api/cars/:id` (galereya, xususiyatlar, narx, monthlyFrom)
- [ ] Rasm galereyasi (cover + qolganlari)
- [ ] "Перебьём предложения" → `POST /api/leads` type `BEAT_OFFER`
- [ ] "Узнать о машине" → `POST /api/leads` type `CAR_INQUIRY` (carId)

### 3. Avtokredit kalkulyatori `[o'rta]`
- [ ] Kalkulyator UI (narx, boshlang'ich to'lov, muddat → oylik hisob)
- [ ] Submit → `POST /api/leads` type `CREDIT_APPLICATION` (creditAmount, termMonths 6-84, downPayment)

---

## 👤 Qudrat — Bosh sahifa · Kontent · Podborkalar

### 1. Bosh sahifa `app/page.tsx` (Главная) `[katta]`
> 📄 **To'liq spec + dizayn:** `frontend/my-app/design/TASK-QUDRAT-BOSH-SAHIFA.md` (12 blok, har biri → endpoint + DTO maydonlari). Dizayn: `design/home-glavnaya.svg` / `.png`.
- [ ] Hero slayder + "Узнай цену" → `POST /api/leads` type `CALLBACK`
- [ ] Brendlar grid + tezkor tanlov → `GET /api/brands`
- [ ] "В наличии с ПТС" CarCard grid → `GET /api/cars?hasPts=true&inStock=true`
- [ ] Наши подборки → `GET /api/collections`
- [ ] "Перебьём предложения" → `POST /api/leads` type `BEAT_OFFER`
- [ ] Спецпредложения → `GET /api/credit-programs`
- [ ] Автокредит kalkulyator → `POST /api/leads` type `CREDIT_APPLICATION`
- [ ] Банки-партнёры → `GET /api/partner-banks`
- [ ] Нам доверяют / Отзывы → `GET /api/ratings`, `GET /api/reviews`
- [ ] Блог → `GET /api/blog` · Об автосалоне + xarita → `GET /api/contacts`

### 2. Podborka `app/collections/[slug]/page.tsx` `[o'rta]`
- [ ] Collection + ichidagi mashinalar → `GET /api/collections/:slug` (CarCard qayta ishlatiladi)

### 3. Blog `app/blog/` `[o'rta]`
- [ ] Ro'yxat → `GET /api/blog` · maqola `app/blog/[slug]` → `GET /api/blog/:slug`

### 4. Kontaktlar + shahar selektori `[o'rta]`
- [ ] Shahar selektori (Москва default) → `GET /api/cities`
- [ ] Salon kontaktlari + xarita → `GET /api/contacts?city=<slug>`
- [ ] Tanlangan shahar Header'da global holatda

---

## 🔗 Tartib va bog'liqliklar

1. **Faza 0 birga** — to'liq tugamaguncha sahifa yo'q.
2. `CarCard` va `LeadForm` (0.4) — Bois yozadi, Qudrat import qiladi (takror yozmang).
3. Faza 0 dan keyin Bois va Qudrat **parallel** ishlaydi.

| Bloklaydi | Bog'liq |
|---|---|
| Faza 0 (api, tiplar, UI) | Hamma sahifa |
| `CarCard` | Bois #1,#2 · Qudrat #1,#2 |
| `LeadForm` | Bois #2,#3 · Qudrat #1 |

---

## ✅ Tayyor (backend — faqat iste'mol qilasiz)
Catalog (`/api/cars`, `/api/cars/:id`, `/api/brands`) · Leads (`POST /api/leads` — 4 tip) · Collections · Credit (`/api/credit-programs`) · Content (`/api/partner-banks`, `/api/reviews`, `/api/ratings`, `/api/blog`, `/api/cities`, `/api/contacts`) · Admin (CRUD + stats).

> DB hali ulanmagan — real data uchun `.env` + migratsiya + seed kerak (backend tomonida alohida vazifa).
