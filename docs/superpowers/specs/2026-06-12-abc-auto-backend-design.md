# ABC Auto — Backend Arxitektura Dizayni

**Sana:** 2026-06-12
**Stack:** Express · Prisma · PostgreSQL · TypeScript · JWT (access + refresh)
**Joylashuv:** `backend/` (frontend'dan to'liq ajratilgan)
**Manba:** Figma — ABC Auto

---

## 1. Maqsad va scope

ABC Auto — moshina marketplace/leasing platformasi. Backend **alohida API server** sifatida quriladi; frontend (`frontend/my-app`, Next.js) uni faqat HTTP (REST) orqali ko'radi. Bu mobil app yoki boshqa klientlar qo'shilsa ham bitta API'dan foydalanish imkonini beradi.

Backend 4 ta domenni qamrab oladi. Hammasi birato'la qurilmaydi — har biri o'z spec → plan → implementation siklidan o'tadi.

Build tartibi (har biri oldingisiga tayanadi):

1. **Auth + foydalanuvchi** — poydevor (← bu spec shu bosqichni qamrab oladi)
2. **Cars** — listings, qidiruv/filtr, batafsil sahifa
3. **Admin** — car CRUD, moderatsiya, foydalanuvchilar
4. **Orders** — leasing/to'lov arizalari

Bu hujjat **1-bosqichni** (skelet + Auth) + barcha bosqichlarga taalluqli **arxitektura konvensiyalarini** belgilaydi.

---

## 2. Arxitektura — qatlamli (layered)

Har HTTP so'rov bitta yo'nalishda oqadi, har qatlam bitta vazifani bajaradi:

```
Request
  → Route        (URL + HTTP metod → controller'ga ulaydi)
  → Middleware   (auth tekshirish, validatsiya, rate-limit)
  → Controller   (req/res ni boshqaradi, service'ni chaqiradi — DB bilmaydi)
  → Service      (biznes mantiq — qoidalar shu yerda)
  → Repository   (Prisma orqali DB — yagona DB tegadigan joy)
  → PostgreSQL
```

### Qatlam qoidalari (barcha bosqichlarga taalluqli)

- **Controller** hech qachon Prisma'ni to'g'ridan chaqirmaydi — faqat service.
- **Service** `req`/`res` ni ko'rmaydi — toza argument oladi, qiymat/throw qaytaradi. Biznes qoidalar shu yerda.
- **Repository** — yagona Prisma tegadigan joy. DB almashtirilsa, faqat shu qatlam o'zgaradi.
- `process.env` faqat `config/env.ts` ichida o'qiladi (zod bilan validatsiya).
- Validation har doim `*.schemas.ts` ichidagi zod orqali, `validate()` middleware'da.
- Har domen aynan bir xil 6 faylli shablonni takrorlaydi (bashoratlilik).

---

## 3. Papkalar strukturasi (`backend/`)

```
backend/
├── prisma/
│   ├── schema.prisma          # DB modeli (User, RefreshToken, + keyin Car, Order)
│   └── migrations/
├── src/
│   ├── config/
│   │   └── env.ts             # zod-validated env (process.env yagona joyi)
│   ├── lib/
│   │   ├── prisma.ts          # PrismaClient singleton
│   │   ├── jwt.ts             # token sign/verify
│   │   └── password.ts        # bcrypt hash/compare
│   ├── middleware/
│   │   ├── authenticate.ts    # JWT tekshirish → req.user
│   │   ├── authorize.ts       # RBAC (role bo'yicha)
│   │   ├── validate.ts        # zod schema → req tekshirish
│   │   └── errorHandler.ts    # markazlashgan xato javobi
│   ├── modules/               # DOMEN bo'yicha izolyatsiya
│   │   └── auth/
│   │       ├── auth.routes.ts
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       ├── auth.repository.ts
│   │       ├── auth.schemas.ts   # zod: register/login/refresh
│   │       └── auth.types.ts
│   ├── utils/
│   │   └── AppError.ts        # typed xato klassi
│   ├── app.ts                 # express app (middleware ulanadi)
│   └── server.ts             # listen() — kirish nuqtasi
├── .env / .env.example
├── tsconfig.json
└── package.json
```

Har yangi domen (`cars/`, `orders/`, `admin/`) aynan shu shablonni takrorlaydi.

---

## 4. 1-bosqich: Auth + poydevor (bu spec'ning amaliy qismi)

### 4.1 Maqsad
Foydalanuvchi ro'yxatdan o'tishi, login qilishi, session (token) saqlanishi/yangilanishi, logout va himoyalangan endpoint'lar rol bo'yicha cheklanishi.

### 4.2 Ma'lumotlar modeli

```prisma
enum Role { BUYER  SELLER  ADMIN }

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  fullName      String
  phone         String?
  role          Role     @default(BUYER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  refreshTokens RefreshToken[]
  // keyingi bosqichlar: cars Car[], orders Order[]
}

model RefreshToken {
  id        String    @id @default(uuid())
  token     String    @unique          // hash qilib saqlanadi (raw token klientda)
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  revokedAt DateTime?
  createdAt DateTime  @default(now())
}
```

**Refresh token'ni DB'da saqlash sababi:** access token stateless va bekor qilib bo'lmaydi; refresh token DB'da yozilgani uchun logout/o'g'irlanish holatida uni revoke qilish mumkin.

### 4.3 Komponentlar

| Unit | Joy | Vazifa | Bog'liqligi |
|---|---|---|---|
| `env` | `config/env.ts` | env'ni zod bilan tekshirish | zod |
| prisma client | `lib/prisma.ts` | PrismaClient singleton | `@prisma/client` |
| jwt | `lib/jwt.ts` | access/refresh sign + verify | `jsonwebtoken`, env |
| password | `lib/password.ts` | bcrypt hash/compare | `bcrypt` |
| `authenticate` | `middleware/authenticate.ts` | access token → `req.user` | jwt |
| `authorize` | `middleware/authorize.ts` | RBAC (rol tekshirish) | — |
| `validate` | `middleware/validate.ts` | zod schema → req | zod |
| `errorHandler` | `middleware/errorHandler.ts` | markazlashgan xato javobi | AppError |
| auth schemas | `auth.schemas.ts` | register/login/refresh zod | zod |
| auth repository | `auth.repository.ts` | User + RefreshToken DB amallari | prisma |
| auth service | `auth.service.ts` | register/login/refresh/logout mantiq | repository, jwt, password |
| auth controller | `auth.controller.ts` | req/res boshqaruv | service |

### 4.4 Endpoint'lar va flow

```
REGISTER  POST /api/auth/register
  validate(registerSchema) → service.register()
    → email band emasligini tekshir → bcrypt.hash(parol)
    → User yaratish (role=BUYER) → access + refresh token qaytar

LOGIN     POST /api/auth/login
  validate(loginSchema) → bcrypt.compare → tokenlar qaytar
    (refresh token hash'i RefreshToken jadvaliga yoziladi)

REFRESH   POST /api/auth/refresh
  refresh token'ni DB'dan top → revoked/expired emasligini tekshir
    → eski token'ni revoke qil → yangi juftlik ber (rotation)

LOGOUT    POST /api/auth/logout   (authenticate)
  refresh token'ni revokedAt = now() qil

ME        GET  /api/auth/me       (authenticate)
  req.user.id bo'yicha profil DTO (passwordHash hech qachon qaytmaydi)
```

Himoyalangan route'lar zanjiri: `authenticate` → (kerak bo'lsa) `authorize('ADMIN')` → controller.

### 4.5 Xavfsizlik
- `helmet` — xavfsiz HTTP headers.
- `cors` — faqat frontend origin (env'dan).
- `express-rate-limit` — login/register brute-force himoyasi.
- `bcrypt` ≥12 rounds.
- Access token ~15 daqiqa, refresh ~7 kun + **rotation** (har refresh'da yangi).
- JWT secret faqat `config/env.ts`'da; `passwordHash` hech qachon javobga chiqmaydi.

### 4.6 Xato handling
- Barcha kutilgan xatolar `AppError(message, statusCode, code)` orqali throw qilinadi.
- `errorHandler` ularni `{ error: { message, code } }` formatida qaytaradi.
- Stack trace / SQL / maxfiy ma'lumot hech qachon klientga chiqmaydi (prod'da).

### 4.7 Test strategiyasi
- **Service** — biznes mantiq, mock repository: email band, noto'g'ri parol, token rotation/revoke.
- **Schemas** — zod valid/invalid kirishlar.
- **Integration** — `supertest` bilan to'liq flow (register→login→refresh→logout) test DB'da.

---

## 5. Bog'liqliklar (qo'shiladigan paketlar)
- Runtime: `express`, `@prisma/client`, `zod`, `jsonwebtoken`, `bcrypt`, `helmet`, `cors`, `express-rate-limit`, `dotenv`
- Dev: `prisma`, `typescript`, `tsx` (yoki `ts-node-dev`), `@types/*`, `vitest` (yoki `jest`), `supertest`

---

## 6. Bu spec'dan tashqarida (keyingi bosqichlar)
- Cars listings, qidiruv, filtr, batafsil (2-bosqich)
- Admin CRUD + moderatsiya (3-bosqich)
- Orders / leasing / to'lov + webhook (4-bosqich)
