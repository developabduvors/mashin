# 👤 Bois — Katalog · Mashina detali · Avtokredit

**Dizayn previewlar:** `design/bois/` · to'liq manba: `ABC Auto +.zip`
**Frontend:** `frontend/my-app/`
**Backend:** tayyor — faqat iste'mol qilasiz. API base: `NEXT_PUBLIC_API_BASE` (`.env.local`).
**Shart:** Faza 0 tugagan bo'lishi kerak (`lib/api.ts`, `lib/types.ts`, `CarCard`, `LeadForm`).

> ⚠️ Next.js 16 — `node_modules/next/dist/docs/` ni o'qing. Ro'yxat/detal = Server Component fetch (SEO), filtr/kalkulyator/galereya = `"use client"`.

---

## 1. Katalog sahifasi `app/cars/page.tsx` `[katta]`
**Dizayn:** `design/bois/1-katalog-A.jpg`, `1-katalog-B.jpg`, filtr: `2-marka-filter.jpg`
- [ ] Brendlar to'ri (logolar) → `GET /api/brands`, bosilganda `/cars?brand=<slug>`
- [ ] CarCard grid (3 ustun) → `GET /api/cars?...`
- [ ] Filtr panel: brand, model, narx (min/max), kuzov, yoqilg'i, uzatma, yil, holat (NEW/USED)
- [ ] "ПОКАЗАТЬ 73" = natija soni (`total`) · "ПОКАЗАТЬ ЕЩЁ" = pagination (page/limit)
- [ ] Filtrlar URL query'da (refresh'da saqlanadi)
- 📦 `GET /api/cars` → `Paginated<CarListItem>` (`{ items, total, page, limit, totalPages }`)
- 📦 `GET /api/brands` → `BrandWithModels[]` (model select = brendning `models[]`)

> "Авто с пробегом" alohida sahifa emas → shu sahifa `condition=USED` filtri bilan.

---

## 2. Mashina detali `app/cars/[id]/page.tsx` `[katta]`
**Dizayn:** `design/bois/7-mashina-detali-A.jpg`, `7-mashina-detali-B.jpg`
- [ ] Rasm galereyasi (cover + thumbnaillar + strelka) → `images[]`
- [ ] Sarlavha, xususiyat chiplari, narx + "от N ₽/мес" (`monthlyFrom`), spec jadval
- [ ] Kredit kalkulyator bar (boshlang'ich to'lov %, muddat 6–84 oy → oylik hisob)
- [ ] "Забронировать онлайн" → `POST /api/leads` type `CAR_INQUIRY` (carId)
- [ ] "Подать заявку на кредит" → `POST /api/leads` type `CREDIT_APPLICATION`
- 📦 `GET /api/cars/:id` → `CarDetail` (`CarListItem` + `{ fuelType, transmission, mileage, description, images[] }`)

---

## 3. Avtokredit kalkulyatori `app/credit/[slug]/page.tsx` `[o'rta]`
**Dizayn:** `design/bois/9-ekspress-kredit.jpg`
- [ ] Sahifa kontenti (hero, dasturlar) → `GET /api/credit-programs`
- [ ] Kalkulyator: Марка/Модель/Комплектация → `GET /api/brands`; муддат 6–84; banklar → `GET /api/partner-banks`
- [ ] Submit → `POST /api/leads` type `CREDIT_APPLICATION` (creditAmount, termMonths 6–84, downPayment)
- 📦 `GET /api/credit-programs` → `CreditProgramItem[]` (`{ id, title, slug, kind, ratePercent, description, imageUrl }`)
- ⚠️ `brandId`/`modelId` = **UUID** (slug emas). Oylik to'lov frontend'da hisoblanadi.

> "Кредит/рассрочка", "Первый/Семейный автомобиль" — bitta shablon, faqat `slug` farq qiladi.

---

## ✅ Checklist
- [ ] 1. Katalog (`/cars`) → `/api/cars`, `/api/brands`
- [ ] 2. Mashina detali (`/cars/[id]`) → `/api/cars/:id`, `/api/leads`
- [ ] 3. Avtokredit kalkulyator → `/api/credit-programs`, `/api/partner-banks`, `/api/leads`

## ⚠️ Eslatmalar
- Lead tiplari: `CAR_INQUIRY` (carId), `CREDIT_APPLICATION`, `BEAT_OFFER`. Telefon majburiy. Rate-limit 10/min/IP.
- `CarCard`/`LeadForm` = Faza 0.4 (Bois yozadi, Qudrat import qiladi — TASKS.md ga qarang).
- DB hali ulanmagan → bo'sh massiv mumkin → empty state chiz.
- `npm run build` toza. Har vazifa alohida branch + PR.
