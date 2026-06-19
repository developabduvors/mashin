# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Loyiha haqida

ABC Auto — moshina marketplace/leasing platformasi. **Monorepo**, ikki mustaqil qism:

- `backend/` — alohida REST API server (Node + Express + TypeScript + Prisma/PostgreSQL).
- `frontend/my-app/` — Next.js 16 (App Router) · React 19 · Tailwind v4. Backend'ni faqat HTTP (`/api`) orqali ishlatadi.

Ular bir-biriga to'g'ridan-to'g'ri import qilmaydi — yagona aloqa kanali HTTP. Har qism o'z `package.json`, `node_modules` va `CLAUDE.md`/`AGENTS.md` fayliga ega.

To'liq dizayn spetsifikatsiyalari: `docs/superpowers/specs/`.

## Dokumentatsiya qoidasi

Har qanday `.md` fayl yoki dokumentatsiya yaratishda, uni loyiha papkasiga emas,
`C:\Users\admin\Documents\Obsidian Vault\` papkasiga yoz.

## Komandalar

### Backend (`cd backend`)
```bash
npm run dev              # tsx watch — dev server (http://localhost:4000)
npm run build            # tsc -> dist/
npm start                # node dist/server.js (build kerak)
npm test                 # vitest (barcha testlar)
npx vitest run <pattern> # bitta test fayli/nomini ishga tushirish
npx prisma migrate dev   # migratsiya yaratish/qo'llash
npx prisma generate      # Prisma client generatsiya
npx prisma studio        # DB ni GUI'da ko'rish
```
Birinchi marta: `cp .env.example .env` + to'ldirish (qarang `docs/backend-ishga-tushirish-bois.md`).

### Frontend (`cd frontend/my-app`)
```bash
npm run dev      # next dev (http://localhost:3000)
npm run build    # next build — toza bo'lishi shart
npm run lint     # eslint
```
`.env.local` → `NEXT_PUBLIC_API_BASE=http://localhost:4000/api`.

## ⚠️ Versiya ogohlantirishlari

Ikkala stack ham training data'dan farq qiladigan yangi versiyalarda:

- **Next.js 16** — App Router/API'lari o'zgargan. Kod yozishdan oldin `frontend/my-app/node_modules/next/dist/docs/` ichidagi tegishli qo'llanmani o'qing (`frontend/my-app/AGENTS.md`).
- **Prisma 7 / Express 5 / Zod 4** — shubha bo'lsa joriy versiya hujjatini (context7 yoki rasmiy docs) tekshiring.

## Backend arxitekturasi (QAT'IY)

So'rov bitta yo'nalishda oqadi, har qatlam bitta vazifa:

```
Route → Middleware → Controller → Service → Repository → Prisma → PostgreSQL
```

Buzilmas qoidalar (to'liq: `backend/CLAUDE.md`):
1. **Controller hech qachon Prisma'ni to'g'ridan chaqirmaydi** — faqat service orqali.
2. **Service `req`/`res` olmaydi** — toza argument oladi, qiymat qaytaradi yoki `AppError` throw qiladi.
3. **`process.env` faqat `src/config/env.ts` da** zod bilan o'qiladi; boshqa joyda `import { env }`.
4. **Har endpoint kirishi `validate(schema)` middleware** orqali zod bilan tekshiriladi.
5. **`passwordHash` hech qachon javobga chiqmaydi** — DTO qaytariladi.
6. **Xatolar `AppError` orqali**; `errorHandler` markazda `{ error: { message, code } }` formatlaydi.

### Domen moduli shabloni
Har domen `src/modules/<domen>/` ichida aynan 6 faylni takrorlaydi:
`<domen>.routes.ts · .controller.ts · .service.ts · .repository.ts · .schemas.ts · .types.ts`.

Mavjud modullar: `auth`, `catalog`, `collections`, `credit`, `leads`, `content`, `admin`.
`admin` modulida `crud.factory.ts` orqali generatsiya qilingan CRUD + `admin.stats.ts`.

API prefiksi `/api` (auth uchun `/api/auth`, rate-limit bilan). Sog'liq: `GET /health`.
Prisma sxemasi (`backend/prisma/schema.prisma`) — markaziy domen modeli: `User`, `Car`/`Brand`/`CarModel`/`CarImage`, `Collection`, `CreditProgram`, `Lead`, `Review`, `BlogPost`, `Dealership`/`City`.

## Frontend arxitekturasi

App Router. Backend'ni `lib/api.ts` (`apiGet`/`apiPost`) orqali iste'mol qiladi; DTO tiplari `lib/types.ts`.
Qayta ishlatiluvchi UI: `components/` (`CarCard`, `LeadForm`, `components/ui/`, `components/layout/`).
Sahifa vazifalari va endpoint↔DTO xaritasi: `TASKS.md` va `frontend/my-app/design/`.

## Git workflow

Solo repo — tarix to'g'ridan-to'g'ri `main` ga commit qilinadi. Commit xabarlari Conventional Commits + skop (`feat(frontend):`, `docs:`) ko'rinishida, asosan o'zbekcha yoziladi.
