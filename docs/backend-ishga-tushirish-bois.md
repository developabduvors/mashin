# Backend — Ishga tushirish qo'llanmasi (Bois uchun)

> ABC Auto backend = alohida API server (Node + Express + TypeScript + Prisma/PostgreSQL).
> Frontend (`../frontend`, Next.js) buni faqat HTTP (REST) orqali ishlatadi.
> Papka: `backend/`. To'liq arxitektura: `backend/CLAUDE.md`.

---

## 0. Talablar (bir marta)

| Narsa | Versiya | Tekshirish |
|---|---|---|
| Node.js | 20+ (loyihada 24) | `node -v` |
| npm | 10+ | `npm -v` |
| PostgreSQL DB | Supabase (cloud) | `.env` dagi `DATABASE_URL` |

---

## 1. Ishga tushirish (har safar)

```bash
cd backend

# 1) Paketlarni o'rnatish (faqat birinchi marta yoki package.json o'zgarsa)
npm install

# 2) .env faylini tayyorlash (faqat birinchi marta)
cp .env.example .env
#    -> .env ichini to'ldir (pastdagi 2-bo'limga qara)

# 3) Prisma client generatsiya + migratsiya (DB sxemasi o'zgarsa)
npx prisma generate
npx prisma migrate dev

# 4) Dev serverni ishga tushirish
npm run dev
```

Muvaffaqiyatli bo'lsa terminalga chiqadi:

```
ABC Auto API → http://localhost:4000
```

Tekshirish (server ishlayotganini): brauzerda yoki terminalda

```bash
curl http://localhost:4000/health
```

---

## 2. `.env` faylini to'ldirish

`.env.example` dan nusxa olib, qiymatlarni qo'y:

```env
# Supabase: Settings → Database → Connection string. [PAROL] -> DB parolingiz
DATABASE_URL="postgresql://postgres:[PAROL]@db.[PROJECT_REF].supabase.co:5432/postgres"

# JWT secretlarni shu buyruq bilan generatsiya qil (har biri uchun alohida):
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_ACCESS_SECRET="<random-hex-32-bytes>"
JWT_REFRESH_SECRET="<random-hex-32-bytes>"

ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL_DAYS="7"
CORS_ORIGIN="http://localhost:3000"   # frontend manzili
PORT="4000"
NODE_ENV="development"
```

> ⚠️ `.env` hech qachon git'ga push qilinmaydi (`.gitignore` da). Faqat `.env.example` push qilinadi.

---

## 3. Foydali komandalar

```bash
npm run dev              # dev server (tsx watch — o'zgarishda avto-restart)
npm run build            # TypeScript -> dist/ (tsc)
npm start                # build qilingan serverni ishga tushirish (node dist/server.js)
npm test                 # testlar (vitest)
npx prisma migrate dev   # yangi migratsiya yaratish/qo'llash
npx prisma studio        # DB ni brauzerda ko'rish (GUI)
npx prisma generate      # Prisma client qayta generatsiya
```

---

## 4. Muammolar va yechimlari (Troubleshooting)

### ❌ Server ko'tarilmaydi — `env` xatosi (zod)
```
ZodError: ... DATABASE_URL ... Required
```
**Sabab:** `.env` yo'q yoki to'ldirilmagan.
**Yechim:** `cp .env.example .env` qil va barcha qiymatlarni to'ldir. `CORS_ORIGIN` to'liq URL bo'lishi shart (`http://localhost:3000`), aks holda zod rad etadi.

---

### ❌ `PrismaClientInitializationError` / DB ulanmaydi
```
Can't reach database server at db.[...].supabase.co:5432
```
**Sabab:** `DATABASE_URL` noto'g'ri, parol xato, yoki internet/Supabase mavjud emas.
**Yechim:**
1. `DATABASE_URL` dagi `[PAROL]` va `[PROJECT_REF]` ni tekshir.
2. Supabase loyiha "paused" emasligini tekshir (bepul plan 1 hafta ishlamasa uxlaydi).
3. `npx prisma studio` bilan ulanishni alohida sina.

---

### ❌ `@prisma/client did not initialize yet` / tip xatolari
**Sabab:** Prisma client generatsiya qilinmagan yoki sxema o'zgargan.
**Yechim:**
```bash
npx prisma generate
```

---

### ❌ Migratsiya xatosi — sxema mos kelmaydi
```
Drift detected / migration failed
```
**Yechim (faqat dev DB da!):**
```bash
npx prisma migrate dev          # odatdagi yo'l
# agar dev bazani tozalashga ruxsat bo'lsa:
npx prisma migrate reset
```
> ⚠️ `migrate reset` butun DB ni o'chiradi. Production'da ASLO qilma.

---

### ❌ `Port 4000 already in use` (EADDRINUSE)
**Sabab:** Avvalgi server o'chmagan.
**Yechim (Windows PowerShell):**
```powershell
netstat -ano | findstr :4000      # PID ni top
taskkill /PID <PID> /F            # o'chir
```
Yoki `.env` da `PORT` ni boshqasiga o'zgartir.

---

### ❌ Frontend'dan CORS xatosi
```
blocked by CORS policy
```
**Sabab:** `.env` dagi `CORS_ORIGIN` frontend manziliga mos emas.
**Yechim:** `CORS_ORIGIN="http://localhost:3000"` (frontend qaysi portda bo'lsa, o'sha) qilib qo'y va serverni qayta ishga tushir.

---

### ❌ `npm install` xatolari
**Yechim:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 5. Arxitektura eslatmasi (kod yozishdan oldin)

So'rov bitta yo'nalishda oqadi:

```
Route → Middleware → Controller → Service → Repository → Prisma → PostgreSQL
```

Buzilmas qoidalar (`backend/CLAUDE.md` da to'liq):
- Controller hech qachon Prisma'ni to'g'ridan chaqirmaydi — faqat service orqali.
- Service `req`/`res` olmaydi — toza argument oladi, qiymat qaytaradi.
- `process.env` faqat `src/config/env.ts` da o'qiladi.
- `passwordHash` hech qachon javobga chiqmaydi.
- Xatolar `AppError` orqali throw qilinadi.

---

## 6. Mavjud modullar (`src/modules/`)

`auth`, `catalog`, `collections`, `credit`, `leads`, `content`, `admin`.
Har biri 6 faylli shablonni takrorlaydi: `routes / controller / service / repository / schemas / types`.

API prefiksi: `/api` (auth uchun `/api/auth`). Sog'liq tekshiruvi: `GET /health`.
