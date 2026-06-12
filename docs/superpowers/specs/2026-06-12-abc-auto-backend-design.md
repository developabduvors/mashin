# ABC Auto — Backend Arxitektura Dizayni

**Sana:** 2026-06-12
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Supabase (Postgres)
**Manba:** Figma — ABC Auto

---

## 1. Maqsad va scope

ABC Auto backendi 4 ta domenni qamrab oladi. Hammasi birato'la qurilmaydi — har biri o'z spec → plan → implementation siklidan o'tadi.

Build tartibi (har biri oldingisiga tayanadi):

1. **Auth + foydalanuvchi** — poydevor (← bu spec shu bosqichni qamrab oladi)
2. **Cars** — listings, qidiruv/filtr, batafsil sahifa
3. **Admin/CMS** — car CRUD, moderatsiya
4. **Orders** — leasing/to'lov arizalari

Bu hujjat **1-bosqichni** + barcha bosqichlarga taalluqli **arxitektura konvensiyalarini** belgilaydi.

---

## 2. Data-access strategiyasi

Tanlangan yondashuv: **DAL + Server Actions** (Next.js 16 hujjati `data-security.md` yangi loyihalar uchun aynan shuni tavsiya qiladi).

- **O'qish (read):** `features/*/data/` ichidagi `server-only` funksiyalar. Har biri authorization tekshiradi va minimal **DTO** qaytaradi.
- **Yozish (mutation):** Server Actions (`features/*/actions/`). Form'lardan to'g'ridan chaqiriladi.
- **Route Handlers (`app/api/*`):** faqat *public HTTP* kerak bo'lganda — to'lov webhook'lari, fayl yuklash.
- `app/` qatlami hech qachon to'g'ridan DB'ga murojaat qilmaydi — faqat `data`/`actions`'ni chaqiradi. Bu kod takrorlanishini oldini oladi.

Xavfsizlik ikki qatlam: Supabase **RLS** (DB tomonda) + DAL authorization (Next tomonda).

---

## 3. Papkalar strukturasi

```
moshina/
├── supabase/
│   └── migrations/                 # SQL schema — versiyalanadi
│       ├── 0001_profiles.sql
│       ├── 0002_cars.sql
│       └── 0003_orders.sql
│
├── src/
│   ├── app/                        # FAQAT routing + UI (yupqa)
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   └── cars/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/            # himoyalangan
│   │   │   ├── layout.tsx          # rol tekshiruvi
│   │   │   └── cars/…
│   │   └── api/
│   │       └── webhooks/payment/route.ts
│   │
│   ├── features/                   # DOMEN bo'yicha, izolyatsiya
│   │   ├── auth/
│   │   │   ├── data/               # getCurrentUser() — DAL
│   │   │   ├── actions/            # login, register, logout
│   │   │   ├── schemas/            # zod
│   │   │   └── types/
│   │   ├── cars/
│   │   │   ├── data/
│   │   │   ├── actions/
│   │   │   ├── schemas/
│   │   │   ├── types/
│   │   │   └── components/
│   │   ├── orders/
│   │   └── admin/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts           # server client (cookies)
│   │   │   ├── client.ts           # browser client
│   │   │   └── middleware.ts       # session yangilash
│   │   ├── env.ts                  # zod-validated env (yagona process.env joyi)
│   │   └── utils.ts
│   │
│   └── middleware.ts               # session refresh + route himoyasi
│
└── .env.local
```

### Konvensiya qoidalari (barcha bosqichlarga taalluqli)

- `app/` → faqat `features/*/data` yoki `features/*/actions` chaqiradi, hech qachon to'g'ridan DB emas.
- Har domen mantiqi bitta `features/<domen>` ichida — bir marta yoziladi.
- DAL fayllar `import 'server-only'` bilan boshlanadi.
- `process.env` faqat `lib/env.ts` ichida o'qiladi.
- Validation har doim `schemas/` ichidagi zod orqali (action va DAL kirishlarida).

---

## 4. 1-bosqich: Auth + Supabase poydevor (bu spec'ning amaliy qismi)

### 4.1 Maqsad
Foydalanuvchi ro'yxatdan o'tishi, login qilishi, session saqlanishi va himoyalangan sahifalar rol bo'yicha cheklanishi.

### 4.2 Ma'lumotlar modeli
- Supabase `auth.users` — built-in (email/parol).
- `public.profiles` jadvali — `auth.users`'ga 1:1, qo'shimcha maydonlar:
  - `id uuid` (FK → auth.users.id, PK)
  - `full_name text`
  - `role text` — enum: `buyer` | `seller` | `admin` (default `buyer`)
  - `phone text`
  - `created_at timestamptz default now()`
- RLS: foydalanuvchi faqat o'z `profiles` qatorini o'qiydi/yangilaydi; `admin` hammasini ko'radi.

### 4.3 Komponentlar
| Unit | Joy | Vazifa | Bog'liqligi |
|---|---|---|---|
| `env` | `lib/env.ts` | env o'zgaruvchilarini zod bilan tekshirish | zod |
| supabase server client | `lib/supabase/server.ts` | cookie-asoslangan server client | `@supabase/ssr`, env |
| supabase browser client | `lib/supabase/client.ts` | browser client | `@supabase/ssr`, env |
| session middleware | `lib/supabase/middleware.ts` + `src/middleware.ts` | session yangilash, himoyalangan route | server client |
| `getCurrentUser` | `features/auth/data/` | joriy user + profil (DTO), `cache()` | server client |
| auth schemas | `features/auth/schemas/` | `loginSchema`, `registerSchema` | zod |
| auth actions | `features/auth/actions/` | `register`, `login`, `logout` (Server Actions) | server client, schemas |

### 4.4 Data flow (register)
```
login/register sahifa (form)
  → Server Action (features/auth/actions/register)
    → registerSchema.parse(formData)        # validation
    → supabase.auth.signUp()                # auth.users yaratadi
    → profiles ga qator qo'shadi (trigger yoki action)
    → redirect (login yoki dashboard)
```

### 4.5 Route himoyasi
- `src/middleware.ts` — har requestda session yangilaydi; `(dashboard)` ostidagi route'larga login bo'lmagan userni `/login`'ga yo'naltiradi.
- `(dashboard)/layout.tsx` — `getCurrentUser()` orqali rolni tekshiradi; `admin` bo'lmasa `403`/redirect.

### 4.6 Error handling
- Server Action'lar `{ error: string }` qaytaradi (form'da ko'rsatish uchun); maxfiy ma'lumot xato matniga chiqarilmaydi.
- DAL authorization muvaffaqiyatsizligida `null` DTO yoki `notFound()`.

### 4.7 Test strategiyasi
- Schemas (zod) — unit test (valid/invalid kirishlar).
- DAL `getCurrentUser` — authorization mantig'i mock'langan client bilan.
- Action'lar — happy path + validation xato.

---

## 5. Bog'liqliklar (qo'shiladigan paketlar)
- `@supabase/supabase-js`, `@supabase/ssr`
- `zod`
- `server-only`

## 6. Bu spec'dan tashqarida (keyingi bosqichlar)
- Cars listings, qidiruv, filtr (2-bosqich)
- Admin CRUD (3-bosqich)
- Orders/leasing/to'lov + webhook (4-bosqich)
