# ABC Auto — Backend

Moshina marketplace/leasing platformasi backendi. **Alohida API server** — frontend (`../frontend/my-app`, Next.js) buni faqat HTTP (REST) orqali ishlatadi.

To'liq arxitektura: `../docs/superpowers/specs/2026-06-12-abc-auto-backend-design.md`

## Stack
- **Runtime:** Node.js + Express + TypeScript
- **DB:** PostgreSQL + Prisma ORM
- **Auth:** JWT (access ~15min + refresh ~7d, rotation), `bcrypt` parol hash
- **Validatsiya:** zod
- **Test:** vitest + supertest

## Qatlamli arxitektura (QAT'IY)

So'rov bitta yo'nalishda oqadi — har qatlam bitta vazifa:

```
Route → Middleware → Controller → Service → Repository → Prisma → PostgreSQL
```

| Qatlam | Vazifa | Tegishmaydi |
|---|---|---|
| Controller | `req`/`res` boshqaruv, service chaqirish | Prisma'ga tegmaydi |
| Service | Biznes mantiq (qoidalar shu yerda) | `req`/`res` ni ko'rmaydi |
| Repository | Yagona Prisma tegadigan joy | Biznes qoida yo'q |

## Buzilmas qoidalar

1. **Controller hech qachon Prisma'ni to'g'ridan chaqirmaydi** — faqat service orqali.
2. **Service `req`/`res` olmaydi** — toza argument oladi, qiymat qaytaradi yoki `AppError` throw qiladi.
3. **`process.env` faqat `src/config/env.ts` ichida** o'qiladi (zod bilan validatsiya). Boshqa joyda `import { env } from '../config/env'`.
4. **Har endpoint kirishi `validate(schema)` middleware** orqali zod bilan tekshiriladi — controller'ga faqat toza data yetadi.
5. **`passwordHash` hech qachon javobga chiqmaydi** — repository/service DTO qaytaradi.
6. **Xatolar `AppError` orqali** throw qilinadi; `errorHandler` markazda `{ error: { message, code } }` formatlaydi. Stack/SQL klientga chiqmaydi.

## Yangi domen qo'shish

Har domen `src/modules/<domen>/` ichida aynan shu 6 faylli shablonni takrorlaydi:

```
<domen>.routes.ts       # express Router, middleware zanjiri
<domen>.controller.ts   # req/res
<domen>.service.ts      # biznes mantiq
<domen>.repository.ts   # Prisma
<domen>.schemas.ts      # zod
<domen>.types.ts        # DTO / domen tiplari
```

Build tartibi: **Auth (joriy) → Cars → Admin → Orders**. Har biri alohida spec → plan → implementation siklidan o'tadi.

## Komandalar

```bash
npm run dev              # tsx watch — dev server
npm run build            # tsc
npx prisma migrate dev   # migratsiya yaratish/qo'llash
npx prisma studio        # DB ko'rish
npm test                 # vitest
```

## Eslatma
- Yangi paket yoki Prisma/Express API ishlatishdan oldin shubha bo'lsa, joriy versiya hujjatini tekshiring (context7 yoki rasmiy docs) — training data eskirgan bo'lishi mumkin.
