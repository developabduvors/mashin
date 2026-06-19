# Избранное (Favorites) — Design

**Sana:** 2026-06-19
**Holat:** Tasdiqlangan (brainstorming)

## Maqsad

Xaridor yoqtirgan mashinalarini saqlab qo'yishi (Избранное / wishlist). Hozir
Header'da "Избранное" tugmasi bor, lekin ishlamaydi (`Header.tsx:110`). Saqlash
**server tomonda**, foydalanuvchi akkauntiga bog'langan holda bo'ladi —
oqim: **register → login → Избранное**.

## Qabul qilingan qarorlar

1. **Saqlash:** server tomonda (Prisma `Favorite` jadvali), buyer auth orqasida.
2. **Mehmon yurakcha bossa:** `/login` ga yo'naltiriladi (u yerda register linki).
3. **Register'da telefon:** majburiy.

## Mavjud holat (kontekst)

- Backend'da **to'liq auth bor**: `/api/auth/register|login|refresh|logout|me`,
  JWT (access + refresh rotation), `BUYER` roli (`backend/src/modules/auth/`).
- Frontend `lib/auth.ts` **faqat admin** uchun ishlatadi va non-ADMIN'ni bloklaydi
  (token kaliti `abc_admin_token`). Buyer auth frontend'da yo'q.
- `Favorite` modeli **yo'q**; `User`/`Car` da favorites relation yo'q.
- `CarCard` (`components/shared/CarCard.tsx`) — server komponent, yurakcha yo'q.

## Arxitektura — uch qism

### Part A — Backend `favorites` moduli

**Prisma** (`backend/prisma/schema.prisma`):

```prisma
model Favorite {
  id        String   @id @default(uuid())
  userId    String
  carId     String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  car       Car      @relation(fields: [carId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, carId])
  @@index([userId])
}
```

`User` va `Car` modellariga `favorites Favorite[]` relation qo'shiladi. Bitta
migratsiya (`npx prisma migrate dev`).

**Modul** `backend/src/modules/favorites/` — standart 6 fayl
(`routes · controller · service · repository · schemas · types`). Barcha route
`authenticate` middleware orqasida (foydalanuvchi `req.user.sub` dan olinadi):

| Endpoint | Vazifa |
|---|---|
| `GET /api/favorites` | Foydalanuvchi saqlagan mashinalar — `CarListItem` DTO ro'yxati (catalog'ning car DTO mapper'ini qayta ishlatadi) |
| `POST /api/favorites/:carId` | Qo'shish (idempotent — dublikatni e'tiborsiz qoldiradi) |
| `DELETE /api/favorites/:carId` | O'chirish |

- Service `carId` mavjudligini tekshiradi; topilmasa `AppError(404, "CAR_NOT_FOUND")`.
- `:carId` zod bilan `validate(schema)` orqali tekshiriladi (params).
- Router `app` da `/api/favorites` prefiksida ro'yxatdan o'tkaziladi.

### Part B — Frontend buyer auth (admin'dan alohida)

- **`lib/buyer-auth.ts`** — buyer token store: kalitlar `abc_buyer_token` /
  `abc_buyer_user`. Funksiyalar: `register()`, `login()`, `logout()`,
  `getBuyerToken()`, `getBuyerUser()`. Admin'ning `lib/auth.ts` **tegilmaydi**
  (ikkala token alohida yashaydi — admin va buyer to'qnashmaydi).
- **`contexts/AuthContext.tsx`** — `useAuth()`:
  - `user: AuthUser | null`
  - `favorites: Set<string>` (mashina ID'lari)
  - `isFavorite(carId)`, `toggleFavorite(carId)` (optimistik)
  - `login()`, `register()`, `logout()`
  - Mount bo'lganda token bor bo'lsa `api.favorites.list()` ni yuklaydi.
  - Root `app/layout.tsx` da Provider sifatida o'raladi.
- **Pages** (buyer-facing; admin `/admin/login` da qoladi):
  - `app/login/page.tsx` — email + parol; "Ro'yxatdan o'tish" linki.
  - `app/register/page.tsx` — fullName, email, **phone (majburiy)**, password (min 8).
- **`lib/api.ts`**:
  - Buyer-authed fetcher (`buyerFetcher`) — `getBuyerToken()` dan Bearer qo'shadi.
  - `api.favorites = { list(), add(carId), remove(carId) }`.
  - `api.auth = { register(payload), login(payload) }` (buyer; backend allaqachon bor).

### Part C — Frontend favorites UI

- **`components/shared/FavoriteButton.tsx`** (`'use client'`) — yurakcha toggle,
  `CarCard` rasmining yuqori-o'ng burchagida. `useAuth()` dan holatni oladi.
  Mehmon (token yo'q) bossa → `router.push('/login')`. `CarCard` asosan
  presentatsion qoladi, faqat bu kichik client komponentni ichiga oladi.
- **`Header.tsx`** — mavjud "Избранное" tugmasi `/favorites` ga link bo'ladi,
  `useAuth().favorites.size` dan jonli count badge. Yon tarafda ixcham
  login/akkaunt kirish nuqtasi.
- **`app/favorites/page.tsx`** — foydalanuvchi saqlagan mashinalar grid'i
  (`CarCard` qayta ishlatiladi). Auth bo'lmasa → `/login` ga redirect.

## Ma'lumot oqimi

```
FavoriteButton bosildi
  → useAuth().toggleFavorite(carId)
    → Set optimistik yangilanadi (yurakcha + header badge darhol)
    → api.favorites.add/remove(carId)  [buyerFetcher, Bearer token]
    → xato bo'lsa Set qaytariladi (rollback)
```

## Xatolar

- Backend: `AppError` orqali (`CAR_NOT_FOUND`, `authenticate` → 401).
- Frontend: 401 da buyer token tozalanadi va `/login` ga; toggle xatosida
  optimistik o'zgarish rollback qilinadi.

## Testlar

Backend (vitest + supertest), `favorites` moduli:
- `POST /api/favorites/:carId` — qo'shadi; dublikat idempotent.
- `DELETE /api/favorites/:carId` — o'chiradi.
- `GET /api/favorites` — faqat o'z mashinalarini qaytaradi.
- Auth yo'q → 401. Mavjud bo'lmagan `carId` → 404.

## Qamrov tashqarisi (YAGNI)

- Anonim localStorage favorites + login'da merge (kerak emas — auth-gated).
- Email tasdiqlash, parolni tiklash.
- Favorites bo'yicha filtr/sort, sahifalash.
