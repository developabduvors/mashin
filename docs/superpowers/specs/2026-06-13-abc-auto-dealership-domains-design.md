# ABC Auto — Avtosalon domenlari (Catalog · Leads · CMS) Dizayni

**Sana:** 2026-06-13
**Stack:** Express · Prisma · PostgreSQL (Supabase) · TypeScript · zod · JWT
**Manba:** Figma — ABC Auto / ALTERA bosh sahifa (1-Главная)
**Tayanadi:** `2026-06-12-abc-auto-backend-design.md` (Auth poydevori — qurilgan)

---

## 1. Maqsad va kontekst

Figma bosh sahifasi ABC Auto'ning **avtosalon (diler) sayti** ekanini ko'rsatdi — peer-to-peer marketplace EMAS. Asosiy xususiyatlar:

- **Admin-managed ombor:** yangi va "с пробегом" (used) mashinalar. Sotuvchi (SELLER) yo'q.
- **Lead generation (asosiy konversiya):** 3 xil forma — avtokredit arizasi (kalkulyator bilan), "Перебьём предложения" (telefon), "Получить выгоду/предложение" (ism+telefon).
- **CMS kontent:** Наши подборки (collections), Спецпредложения/Кредит и рассрочка (credit programs), Банки-партнёры, Отзывы + tashqi reytinglar, Блог, ko'p-shahar (Москва selector), kontaktlar.

Bu hujjat shu domenlarni **6 modulga** bo'ladi. Har modul mavjud qatlamli arxitekturaga (`Route → Controller → Service → Repository → Prisma`) va `modules/<domen>/` shabloniga amal qiladi.

**Build tartibi (tavsiya):** Catalog → Collections → CreditPrograms → Leads → CMS → Admin. Catalog birinchi, chunki Collections/Leads unga tayanadi. Har modul alohida implementatsiya rejasidan o'tadi.

---

## 2. Auth o'zgarishi

Mavjud `Role { BUYER SELLER ADMIN }` — bu dizaynda `SELLER` ishlatilmaydi. Qaror: `SELLER`ni schema'da **qoldiramiz** (migratsiya talab qilmaydi, kelajakda kerak bo'lishi mumkin), lekin yangi mantiqda faqat `ADMIN` (CMS) va `BUYER` (ixtiyoriy mijoz akkaunti) ishlatiladi. Public sahifalar va lead yuborish **autentifikatsiyasiz**.

---

## 3. Modul 1 — Catalog (Brand · CarModel · Car)

### 3.1 Model

```prisma
enum Condition    { NEW  USED }
enum BodyType     { SEDAN  SUV  HATCHBACK  CROSSOVER  MINIVAN  COUPE }
enum FuelType     { PETROL  DIESEL  HYBRID  ELECTRIC  GAS }
enum Transmission { MT  AT  CVT  ROBOT }

model Brand {
  id      String     @id @default(uuid())
  name    String     @unique
  slug    String     @unique
  logoUrl String?
  models  CarModel[]
  cars    Car[]
}

model CarModel {
  id      String @id @default(uuid())
  name    String
  slug    String
  brandId String
  brand   Brand  @relation(fields: [brandId], references: [id], onDelete: Cascade)
  cars    Car[]
  @@unique([brandId, slug])
}

model Car {
  id           String       @id @default(uuid())
  brandId      String
  modelId      String
  trim         String                                  // "1.6 MPI MT Active"
  year         Int
  condition    Condition    @default(NEW)
  bodyType     BodyType
  fuelType     FuelType
  transmission Transmission
  price        Decimal      @db.Decimal(12, 2)
  monthlyFrom  Decimal?     @db.Decimal(12, 2)
  mileage      Int?
  hasPts       Boolean      @default(true)
  inStock      Boolean      @default(true)
  isFeatured   Boolean      @default(false)
  description  String?
  brand        Brand        @relation(fields: [brandId], references: [id])
  model        CarModel     @relation(fields: [modelId], references: [id])
  images       CarImage[]
  collections  CollectionCar[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  @@index([brandId]) @@index([price]) @@index([condition]) @@index([bodyType])
}

model CarImage {
  id        String  @id @default(uuid())
  carId     String
  car       Car     @relation(fields: [carId], references: [id], onDelete: Cascade)
  url       String
  isCover   Boolean @default(false)
  sortOrder Int     @default(0)
}
```

### 3.2 Endpointlar (`modules/catalog/`)

| Metod | Yo'l | Auth | Vazifa |
|---|---|---|---|
| GET | `/api/cars` | public | filtr/qidiruv + pagination |
| GET | `/api/cars/:id` | public | batafsil (images, brand, model, collections) |
| GET | `/api/brands` | public | brand + modellar (filtr dropdown) |

**Filtr query (zod `carQuerySchema`):** `brand?, model?, condition?, bodyType?, fuel?, transmission?, minPrice?, maxPrice?, minYear?, maxYear?, inStock?, featured?, q?, sort? (price_asc|price_desc|year_desc|newest), page=1, limit=12`.

**DTO:** `CarListItem` (kartochka: id, brand, model, trim, year, price, monthlyFrom, coverImage, condition, hasPts) va `CarDetail` (barcha maydon + images[]).

### 3.3 Filtr mantiqi
- Repository `where` ni shartli quradi (faqat berilgan filtrlar qo'shiladi).
- `price`, `condition`, `bodyType`, `brandId` indekslangan — filtr tez.
- `q` → brand/model/trim bo'yicha `contains` (case-insensitive).

---

## 4. Modul 2 — Collections ("Наши подборки")

```prisma
model Collection {
  id        String          @id @default(uuid())
  title     String
  slug      String          @unique
  imageUrl  String?
  sortOrder Int             @default(0)
  cars      CollectionCar[]
}
model CollectionCar {
  collectionId String
  carId        String
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  car          Car        @relation(fields: [carId], references: [id], onDelete: Cascade)
  @@id([collectionId, carId])
}
```

| Metod | Yo'l | Auth | Vazifa |
|---|---|---|---|
| GET | `/api/collections` | public | ro'yxat (sortOrder bo'yicha) |
| GET | `/api/collections/:slug` | public | podborka + ichidagi mashinalar (CarListItem[]) |

---

## 5. Modul 3 — Credit Programs ("Спецпредложения / Кредит и рассрочка")

```prisma
enum CreditKind { CREDIT  INSTALLMENT  TRADE_IN  TAXI  SPECIAL }

model CreditProgram {
  id          String     @id @default(uuid())
  title       String
  slug        String     @unique
  kind        CreditKind @default(CREDIT)
  ratePercent Decimal?   @db.Decimal(5, 2)
  description String?
  imageUrl    String?
  isActive    Boolean    @default(true)
  sortOrder   Int        @default(0)
}
```

| Metod | Yo'l | Auth | Vazifa |
|---|---|---|---|
| GET | `/api/credit-programs` | public | faol dasturlar (sortOrder) |
| GET | `/api/credit-programs/:slug` | public | bitta dastur |

---

## 6. Modul 4 — Leads (⭐ asosiy konversiya)

3 ta forma bitta `Lead` modeliga `type` bilan birlashtiriladi.

```prisma
enum LeadType   { CREDIT_APPLICATION  BEAT_OFFER  CALLBACK  CAR_INQUIRY }
enum LeadStatus { NEW  IN_PROGRESS  CONTACTED  CONVERTED  REJECTED }

model Lead {
  id           String     @id @default(uuid())
  type         LeadType
  status       LeadStatus @default(NEW)
  name         String?
  phone        String
  carId        String?
  brandId      String?
  modelId      String?
  trim         String?
  creditAmount Decimal?   @db.Decimal(12, 2)
  termMonths   Int?
  downPayment  Decimal?   @db.Decimal(12, 2)
  source       String?
  note         String?
  createdAt    DateTime   @default(now())
  @@index([status]) @@index([type]) @@index([createdAt])
}
```

### 6.1 Endpointlar (`modules/leads/`)

| Metod | Yo'l | Auth | Vazifa |
|---|---|---|---|
| POST | `/api/leads` | public + rate-limit | har formadan ariza (type-ga qarab validatsiya) |
| GET | `/api/admin/leads` | admin | ro'yxat (filtr: status, type, page) |
| PATCH | `/api/admin/leads/:id` | admin | status yangilash |

### 6.2 Validatsiya (zod discriminated union `type` bo'yicha)
- `BEAT_OFFER` / `CALLBACK`: `phone` (+ ixtiyoriy `name`).
- `CREDIT_APPLICATION`: `phone`, `name?`, `brandId?`, `modelId?`, `trim?`, `creditAmount?`, `termMonths?` (6..84), `downPayment?`.
- `CAR_INQUIRY`: `phone`, `carId`.
- Telefon formati normalizatsiya qilinadi (faqat raqamlar saqlanadi).

### 6.3 Xavfsizlik
- Public POST → `express-rate-limit` (spam himoyasi, masalan 10/min/IP).
- Hech qanday maxfiy javob yo'q — `{ id, status }` qaytadi.

---

## 7. Modul 5 — CMS kontent

```prisma
model PartnerBank {
  id String @id @default(uuid())  name String  logoUrl String
  isInsurer Boolean @default(false)  sortOrder Int @default(0)
}
model Review {
  id String @id @default(uuid())  author String  text String
  source String?  rating Int?  isPublished Boolean @default(true)  createdAt DateTime @default(now())
}
model ExternalRating {
  id String @id @default(uuid())  platform String   // Yandex, Google, Otzovik
  rating Decimal @db.Decimal(2,1)  recommendPercent Int?  url String?
}
model BlogPost {
  id String @id @default(uuid())  title String  slug String @unique
  excerpt String?  body String?  coverUrl String?  publishedAt DateTime?  createdAt DateTime @default(now())
}
model City {
  id String @id @default(uuid())  name String  slug String @unique  isDefault Boolean @default(false)
}
model Dealership {
  id String @id @default(uuid())  cityId String  address String  phones String[]
  schedule String?  lat Float?  lng Float?
  city City @relation(fields: [cityId], references: [id])
}
```
> `City`ga `dealerships Dealership[]` qarama-qarshi relation qo'shiladi.

| Metod | Yo'l | Auth | Vazifa |
|---|---|---|---|
| GET | `/api/partner-banks` | public | banklar/sug'urta |
| GET | `/api/reviews` | public | chop etilgan otzıvlar |
| GET | `/api/ratings` | public | tashqi reytinglar |
| GET | `/api/blog` · `/api/blog/:slug` | public | blog |
| GET | `/api/cities` | public | shaharlar (selector) |
| GET | `/api/contacts?city=` | public | salon kontaktlari |

---

## 8. Modul 6 — Admin (CMS panel)

Barcha kontent modellari uchun CRUD, `authenticate` + `authorize('ADMIN')`:
`/api/admin/cars`, `/api/admin/brands`, `/api/admin/collections`, `/api/admin/credit-programs`, `/api/admin/partner-banks`, `/api/admin/reviews`, `/api/admin/blog`, `/api/admin/leads`, `/api/admin/cities`, `/api/admin/dealerships`.
+ `GET /api/admin/stats` — dashboard (cars soni, yangi leadlar, status taqsimoti).

Rasm yuklash (CarImage, logolar): **Supabase Storage** (yoki keyinchalik) — bu spec'da URL saqlanadi, yuklash mexanizmi alohida bosqich.

---

## 9. Papka strukturasi (qo'shiladi)

```
backend/src/modules/
├── auth/            (mavjud)
├── catalog/         brand·model·car  (routes·controller·service·repository·schemas·types)
├── collections/
├── credit/
├── leads/
├── content/         partner-banks·reviews·ratings·blog·cities·dealerships
└── admin/           CRUD + stats (ichki: har resurs uchun controller)
```
Prisma: bitta `schema.prisma`ga modellar qo'shiladi; har modul uchun alohida migratsiya (`0002_catalog`, `0003_collections`, ...).

---

## 10. Test strategiyasi
- **Service** (mock repository): filtr `where` qurish, lead type-validatsiya, slug unikallik.
- **Schemas** (zod): carQuery, lead discriminated union.
- **Integration** (real DB): `/api/cars` filtr kombinatsiyalari, `POST /api/leads` har type, admin CRUD + RBAC.
> Eslatma: hozir test fayllar o'chirilgan (foydalanuvchi qarori); reja TDD bilan yoziladi, test yozish/yo'qligi implementatsiya bosqichida hal qilinadi.

---

## 11. Bu spec'dan tashqarida
- Rasm yuklash (Supabase Storage) mexanizmi
- Mijoz akkaunti (favorites/saqlangan) — agar kerak bo'lsa
- To'lov/CRM integratsiyasi, email/SMS xabarnoma (lead kelganda)
- Авто с пробегом uchun qo'shimcha maydonlar (agar batafsil ekran boshqa maydon ko'rsatsa)
