import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import type {
  BodyType,
  Condition,
  FuelType,
  Transmission,
} from "@prisma/client";

// ─── Seed ma'lumot tuzilmasi ────────────────────────────────
// Idempotent: brend slug bo'yicha, model (brandId+slug) bo'yicha upsert qilinadi;
// mashina (modelId+trim+year) bo'yicha topiladi yoki yaratiladi. Qayta ishga
// tushirilsa dublikat YARATILMAYDI.

type CarSeed = {
  trim: string;
  year: number;
  condition: Condition;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  price: number; // ₽
  mileage?: number; // faqat USED uchun
  isFeatured?: boolean;
  description?: string;
};

type ModelSeed = { name: string; slug: string; cars: CarSeed[] };
type BrandSeed = { name: string; slug: string; logoDomain: string; models: ModelSeed[] };

const f = (description: string): string => description; // qisqartma — o'qiluvchanlik uchun

const BRANDS: BrandSeed[] = [
  {
    name: "Toyota",
    slug: "toyota",
    logoDomain: "toyota.com",
    models: [
      {
        name: "Camry",
        slug: "camry",
        cars: [
          { trim: "2.5 Prestige", year: 2024, condition: "NEW", bodyType: "SEDAN", fuelType: "PETROL", transmission: "AT", price: 3_690_000, isFeatured: true, description: f("Бизнес-седан Toyota Camry в максимальной комплектации Prestige.") },
          { trim: "2.0 Comfort", year: 2022, condition: "USED", bodyType: "SEDAN", fuelType: "PETROL", transmission: "CVT", price: 2_780_000, mileage: 48_000, description: f("Один владелец, обслуживание у дилера, на гарантии.") },
        ],
      },
      {
        name: "RAV4",
        slug: "rav4",
        cars: [
          { trim: "2.5 Hybrid Adventure", year: 2024, condition: "NEW", bodyType: "CROSSOVER", fuelType: "HYBRID", transmission: "CVT", price: 4_250_000, isFeatured: true, description: f("Гибридный кроссовер с полным приводом и богатой комплектацией.") },
        ],
      },
      {
        name: "Land Cruiser 300",
        slug: "land-cruiser-300",
        cars: [
          { trim: "3.5 V6 Premium", year: 2023, condition: "NEW", bodyType: "SUV", fuelType: "PETROL", transmission: "AT", price: 11_900_000, isFeatured: true, description: f("Флагманский внедорожник Land Cruiser 300, полный фарш.") },
        ],
      },
    ],
  },
  {
    name: "Kia",
    slug: "kia",
    logoDomain: "kia.com",
    models: [
      {
        name: "K5",
        slug: "k5",
        cars: [
          { trim: "2.5 GT-Line", year: 2024, condition: "NEW", bodyType: "SEDAN", fuelType: "PETROL", transmission: "AT", price: 3_350_000, isFeatured: true, description: f("Спортивный седан Kia K5 GT-Line с панорамной крышей.") },
          { trim: "2.0 Luxe", year: 2023, condition: "USED", bodyType: "SEDAN", fuelType: "PETROL", transmission: "AT", price: 2_640_000, mileage: 31_000, description: f("Идеальное состояние, полный пакет опций.") },
        ],
      },
      {
        name: "Sportage",
        slug: "sportage",
        cars: [
          { trim: "2.0 Prestige", year: 2024, condition: "NEW", bodyType: "CROSSOVER", fuelType: "DIESEL", transmission: "AT", price: 3_980_000, description: f("Новое поколение Sportage с дизельным мотором и AWD.") },
        ],
      },
      {
        name: "Seltos",
        slug: "seltos",
        cars: [
          { trim: "1.6 Style", year: 2023, condition: "NEW", bodyType: "CROSSOVER", fuelType: "PETROL", transmission: "CVT", price: 2_690_000, description: f("Компактный городской кроссовер Kia Seltos.") },
        ],
      },
    ],
  },
  {
    name: "Hyundai",
    slug: "hyundai",
    logoDomain: "hyundai.com",
    models: [
      {
        name: "Sonata",
        slug: "sonata",
        cars: [
          { trim: "2.5 Business", year: 2024, condition: "NEW", bodyType: "SEDAN", fuelType: "PETROL", transmission: "AT", price: 3_290_000, isFeatured: true, description: f("Hyundai Sonata в бизнес-комплектации, светодиодная оптика.") },
        ],
      },
      {
        name: "Tucson",
        slug: "tucson",
        cars: [
          { trim: "2.0 Travel", year: 2023, condition: "NEW", bodyType: "CROSSOVER", fuelType: "PETROL", transmission: "AT", price: 3_640_000, description: f("Семейный кроссовер с просторным салоном и полным приводом.") },
          { trim: "2.0 CRDi", year: 2021, condition: "USED", bodyType: "CROSSOVER", fuelType: "DIESEL", transmission: "AT", price: 2_950_000, mileage: 62_000, description: f("Дизельный Tucson, экономичный и надёжный.") },
        ],
      },
      {
        name: "Creta",
        slug: "creta",
        cars: [
          { trim: "1.6 Prestige", year: 2024, condition: "NEW", bodyType: "CROSSOVER", fuelType: "PETROL", transmission: "AT", price: 2_490_000, description: f("Бестселлер Hyundai Creta нового поколения.") },
        ],
      },
    ],
  },
  {
    name: "Volkswagen",
    slug: "volkswagen",
    logoDomain: "vw.com",
    models: [
      {
        name: "Polo",
        slug: "polo",
        cars: [
          { trim: "1.6 Status", year: 2022, condition: "USED", bodyType: "SEDAN", fuelType: "PETROL", transmission: "AT", price: 1_790_000, mileage: 39_000, description: f("Практичный седан VW Polo, экономичный мотор.") },
        ],
      },
      {
        name: "Tiguan",
        slug: "tiguan",
        cars: [
          { trim: "2.0 TSI R-Line", year: 2023, condition: "NEW", bodyType: "CROSSOVER", fuelType: "PETROL", transmission: "ROBOT", price: 4_490_000, isFeatured: true, description: f("VW Tiguan R-Line 4Motion, спортивный пакет.") },
        ],
      },
    ],
  },
  {
    name: "BMW",
    slug: "bmw",
    logoDomain: "bmw.com",
    models: [
      {
        name: "3 Series",
        slug: "3-series",
        cars: [
          { trim: "320i M Sport", year: 2024, condition: "NEW", bodyType: "SEDAN", fuelType: "PETROL", transmission: "AT", price: 5_690_000, isFeatured: true, description: f("BMW 320i в пакете M Sport, задний привод.") },
        ],
      },
      {
        name: "X5",
        slug: "x5",
        cars: [
          { trim: "xDrive40i", year: 2023, condition: "NEW", bodyType: "SUV", fuelType: "PETROL", transmission: "AT", price: 9_850_000, isFeatured: true, description: f("BMW X5 xDrive40i, полный привод, premium-пакет.") },
          { trim: "xDrive30d", year: 2021, condition: "USED", bodyType: "SUV", fuelType: "DIESEL", transmission: "AT", price: 7_200_000, mileage: 71_000, description: f("Дизельный X5, безупречная история обслуживания.") },
        ],
      },
    ],
  },
  {
    name: "Mercedes-Benz",
    slug: "mercedes-benz",
    logoDomain: "mercedes-benz.com",
    models: [
      {
        name: "E-Class",
        slug: "e-class",
        cars: [
          { trim: "E 200 AMG Line", year: 2024, condition: "NEW", bodyType: "SEDAN", fuelType: "PETROL", transmission: "AT", price: 7_490_000, isFeatured: true, description: f("Mercedes-Benz E 200 в пакете AMG Line.") },
        ],
      },
      {
        name: "GLC",
        slug: "glc",
        cars: [
          { trim: "GLC 300 4MATIC", year: 2023, condition: "NEW", bodyType: "CROSSOVER", fuelType: "PETROL", transmission: "AT", price: 8_200_000, description: f("Кроссовер GLC 300 4MATIC, премиальная отделка.") },
        ],
      },
    ],
  },
  {
    name: "Lada",
    slug: "lada",
    logoDomain: "lada.ru",
    models: [
      {
        name: "Vesta",
        slug: "vesta",
        cars: [
          { trim: "1.6 Comfort", year: 2024, condition: "NEW", bodyType: "SEDAN", fuelType: "PETROL", transmission: "MT", price: 1_490_000, description: f("Lada Vesta в комплектации Comfort, надёжная и доступная.") },
        ],
      },
      {
        name: "Niva Travel",
        slug: "niva-travel",
        cars: [
          { trim: "1.7 Luxe", year: 2024, condition: "NEW", bodyType: "SUV", fuelType: "PETROL", transmission: "MT", price: 1_390_000, description: f("Полноприводный внедорожник Lada Niva Travel.") },
        ],
      },
    ],
  },
  {
    name: "Chery",
    slug: "chery",
    logoDomain: "cheryinternational.com",
    models: [
      {
        name: "Tiggo 7 Pro",
        slug: "tiggo-7-pro",
        cars: [
          { trim: "1.5T Prestige", year: 2024, condition: "NEW", bodyType: "CROSSOVER", fuelType: "PETROL", transmission: "CVT", price: 2_590_000, isFeatured: true, description: f("Chery Tiggo 7 Pro, два экрана и богатое оснащение.") },
        ],
      },
      {
        name: "Tiggo 8 Pro Max",
        slug: "tiggo-8-pro-max",
        cars: [
          { trim: "2.0T Ultimate", year: 2024, condition: "NEW", bodyType: "SUV", fuelType: "PETROL", transmission: "ROBOT", price: 3_490_000, description: f("Семиместный SUV Chery Tiggo 8 Pro Max.") },
        ],
      },
    ],
  },
  {
    name: "Geely",
    slug: "geely",
    logoDomain: "geely.com",
    models: [
      {
        name: "Coolray",
        slug: "coolray",
        cars: [
          { trim: "1.5T Flagship", year: 2024, condition: "NEW", bodyType: "CROSSOVER", fuelType: "PETROL", transmission: "ROBOT", price: 2_390_000, description: f("Geely Coolray — динамичный городской кроссовер.") },
        ],
      },
      {
        name: "Monjaro",
        slug: "monjaro",
        cars: [
          { trim: "2.0T Exclusive", year: 2024, condition: "NEW", bodyType: "SUV", fuelType: "PETROL", transmission: "AT", price: 4_290_000, isFeatured: true, description: f("Флагман Geely Monjaro, полный привод и премиум-салон.") },
        ],
      },
    ],
  },
  {
    name: "Haval",
    slug: "haval",
    logoDomain: "haval.ru",
    models: [
      {
        name: "Jolion",
        slug: "jolion",
        cars: [
          { trim: "1.5T Premium", year: 2024, condition: "NEW", bodyType: "CROSSOVER", fuelType: "PETROL", transmission: "ROBOT", price: 2_290_000, description: f("Haval Jolion — популярный кроссовер с богатой базой.") },
        ],
      },
      {
        name: "Dargo",
        slug: "dargo",
        cars: [
          { trim: "2.0T Tech Plus", year: 2024, condition: "NEW", bodyType: "SUV", fuelType: "PETROL", transmission: "ROBOT", price: 3_190_000, description: f("Брутальный внедорожник Haval Dargo с полным приводом.") },
        ],
      },
    ],
  },
];

// Model-aniq rasmlar — Wikipedia (Wikimedia Commons) infobox suratlari.
// Kalit = `${brand.slug}-${model.slug}`. Har URL tegishli model maqolasidan
// olingan, shuning uchun brend/modelga ANIQ mos keladi. (Avval loremflickr
// `car` tegi ishlatilardi — u brend bilan bog'lanmagan tasodifiy surat
// qaytarardi, shuning sababli BMW sahifasida boshqa mashina chiqardi.)
// `upload.wikimedia.org` next.config.ts allowlist'ida.
const MODEL_IMAGES: Record<string, string[]> = {
  "toyota-camry": ["https://upload.wikimedia.org/wikipedia/commons/a/ac/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg"],
  "toyota-rav4": ["https://upload.wikimedia.org/wikipedia/commons/2/2d/2024_Toyota_RAV4_Prime_XSE_Premium_in_Silver_Sky_with_Midnight_Black_roof%2C_front_left.jpg"],
  "toyota-land-cruiser-300": ["https://upload.wikimedia.org/wikipedia/commons/6/6d/2021_Toyota_Land_Cruiser_300_3.4_ZX_%28Colombia%29_front_view_04.png"],
  "kia-k5": ["https://upload.wikimedia.org/wikipedia/commons/f/ff/2022_Kia_K5_GT-Line_in_Pacific_Blue%2C_Front_Left%2C_09-05-2022.jpg"],
  "kia-sportage": ["https://upload.wikimedia.org/wikipedia/commons/5/5d/2025_Kia_Sportage_S_front_only.jpg"],
  "kia-seltos": ["https://upload.wikimedia.org/wikipedia/commons/b/b5/2021_Kia_Seltos_1.6_EX_%28SP2i%3B_Chile%29_front_view.jpg"],
  "hyundai-sonata": ["https://upload.wikimedia.org/wikipedia/commons/1/1d/2024_Hyundai_Sonata_SEL%2C_front_right.jpg"],
  "hyundai-tucson": ["https://upload.wikimedia.org/wikipedia/commons/c/c6/2022_Hyundai_Tucson_Preferred%2C_Front_Right%2C_05-24-2021.jpg"],
  "hyundai-creta": ["https://upload.wikimedia.org/wikipedia/commons/2/25/2022_Hyundai_Creta_1.6_Plus_%28Chile%29_front_view.jpg"],
  "volkswagen-polo": ["https://upload.wikimedia.org/wikipedia/commons/7/79/VW_Polo_beats_%28VI%29_%E2%80%93_f_03032019.jpg"],
  "volkswagen-tiguan": ["https://upload.wikimedia.org/wikipedia/commons/e/ef/Volkswagen_Tiguan_III_IMG_8823_%28cropped%29.jpg"],
  "bmw-3-series": ["https://upload.wikimedia.org/wikipedia/commons/9/91/BMW_G20_%282022%29_IMG_7316_%282%29.jpg"],
  "bmw-x5": ["https://upload.wikimedia.org/wikipedia/commons/f/f1/2019_BMW_X5_M50d_Automatic_3.0.jpg"],
  "mercedes-benz-e-class": ["https://upload.wikimedia.org/wikipedia/commons/f/fd/Mercedes-Benz_W214_1X7A1841.jpg"],
  "mercedes-benz-glc": ["https://upload.wikimedia.org/wikipedia/commons/2/2c/Mercedes-Benz_X254_1X7A6343.jpg"],
  "lada-vesta": ["https://upload.wikimedia.org/wikipedia/commons/8/8d/2024_Lada_Vesta_sedan_white_front.jpg"],
  "lada-niva-travel": ["https://upload.wikimedia.org/wikipedia/commons/0/07/2023_Lada_Niva_Travel_black_front.jpg"],
  "chery-tiggo-7-pro": ["https://upload.wikimedia.org/wikipedia/commons/7/76/Chery_Tiggo_7_II_014_%28cropped%29.jpg"],
  "chery-tiggo-8-pro-max": ["https://upload.wikimedia.org/wikipedia/commons/3/37/Chery_Tiggo_8_Plus_018_%28cropped%29.jpg"],
  "geely-coolray": ["https://upload.wikimedia.org/wikipedia/commons/c/c1/2018_Geely_Binyue.jpg"],
  "geely-monjaro": ["https://upload.wikimedia.org/wikipedia/commons/d/da/Geely_Monjaro_%28cropped%29.jpg"],
  "haval-jolion": ["https://upload.wikimedia.org/wikipedia/commons/a/ac/2020_Great_Wall_Haval_Jolion_%28front%29.jpg"],
  "haval-dargo": ["https://upload.wikimedia.org/wikipedia/commons/1/13/2020_Great_Wall_Haval_Big_Dog_front.jpg"],
};

// Map'da topilmasa (yangi model qo'shilsa) — neytral zaxira surat.
const FALLBACK_IMAGE = MODEL_IMAGES["toyota-camry"]![0];

async function main() {
  let brandCount = 0;
  let modelCount = 0;
  let carCount = 0;
  let createdCars = 0;

  for (const b of BRANDS) {
    // logoUrl = null: Clearbit Logo API o'chirilgan (DNS resolve bo'lmaydi).
    // Frontend `BrandLogo` logo bo'lmasa brend nomini wordmark qilib ko'rsatadi.
    // Admin'da real logo yuklansa, shu maydon to'ldiriladi.
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, logoUrl: null },
      create: { name: b.name, slug: b.slug, logoUrl: null },
    });
    brandCount++;

    for (const m of b.models) {
      const model = await prisma.carModel.upsert({
        where: { brandId_slug: { brandId: brand.id, slug: m.slug } },
        update: { name: m.name },
        create: { name: m.name, slug: m.slug, brandId: brand.id },
      });
      modelCount++;

      const modelImages = MODEL_IMAGES[`${b.slug}-${m.slug}`] ?? [FALLBACK_IMAGE];

      for (const c of m.cars) {
        carCount++;

        // find-or-create: Car'da tabiiy unique kalit yo'q, shuning uchun
        // (modelId + trim + year) bo'yicha mavjudligini tekshiramiz.
        let car = await prisma.car.findFirst({
          where: { modelId: model.id, trim: c.trim, year: c.year },
          select: { id: true },
        });
        if (!car) {
          car = await prisma.car.create({
            data: {
              brandId: brand.id,
              modelId: model.id,
              trim: c.trim,
              year: c.year,
              condition: c.condition,
              bodyType: c.bodyType,
              fuelType: c.fuelType,
              transmission: c.transmission,
              price: c.price,
              monthlyFrom: Math.round(c.price / 60),
              mileage: c.condition === "USED" ? (c.mileage ?? 0) : null,
              isFeatured: c.isFeatured ?? false,
              description: c.description ?? null,
            },
            select: { id: true },
          });
          createdCars++;
        }

        // Rasmlarni sinxronlash — eski rasmlarni (jumladan loremflickr/picsum)
        // o'chirib, model-aniq Wikimedia rasm(lar)ini qayta yaratamiz. Shu sabab
        // MODEL_IMAGES o'zgarsa, qayta ishga tushirish MAVJUD mashinalarni ham
        // yangilaydi (idempotent).
        await prisma.carImage.deleteMany({ where: { carId: car.id } });
        await prisma.carImage.createMany({
          data: modelImages.map((url, i) => ({
            carId: car!.id,
            url,
            isCover: i === 0,
            sortOrder: i,
          })),
        });
      }
    }
  }

  console.log(
    `✓ Seed tayyor: ${brandCount} brend, ${modelCount} model, ${carCount} mashina ko'rib chiqildi (${createdCars} yangi yaratildi).`,
  );
}

main()
  .catch((e) => {
    console.error("✗ Data seed xatosi:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
