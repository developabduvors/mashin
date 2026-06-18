import type { Prisma } from "@prisma/client";
import { catalogRepository, type CarWithRelations } from "./catalog.repository";
import { AppError } from "../../utils/AppError";
import type { CarQuery } from "./catalog.schemas";
import type {
  CarListItem,
  CarDetail,
  BrandWithModels,
  Paginated,
} from "./catalog.types";

function buildWhere(q: CarQuery): Prisma.CarWhereInput {
  const where: Prisma.CarWhereInput = {};
  if (q.brand) where.brand = { slug: q.brand };
  if (q.model) where.model = { slug: q.model };
  if (q.condition) where.condition = q.condition;
  if (q.bodyType) where.bodyType = q.bodyType;
  if (q.fuel) where.fuelType = q.fuel;
  if (q.transmission) where.transmission = q.transmission;
  if (q.inStock !== undefined) where.inStock = q.inStock;
  if (q.featured !== undefined) where.isFeatured = q.featured;

  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    where.price = {};
    if (q.minPrice !== undefined) where.price.gte = q.minPrice;
    if (q.maxPrice !== undefined) where.price.lte = q.maxPrice;
  }
  if (q.minYear !== undefined || q.maxYear !== undefined) {
    where.year = {};
    if (q.minYear !== undefined) where.year.gte = q.minYear;
    if (q.maxYear !== undefined) where.year.lte = q.maxYear;
  }
  if (q.q) {
    where.OR = [
      { brand: { name: { contains: q.q, mode: "insensitive" } } },
      { model: { name: { contains: q.q, mode: "insensitive" } } },
      { trim: { contains: q.q, mode: "insensitive" } },
    ];
  }
  return where;
}

function buildOrderBy(sort: CarQuery["sort"]): Prisma.CarOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "year_desc":
      return { year: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

function coverImage(car: CarWithRelations): string | null {
  const cover = car.images.find((i) => i.isCover) ?? car.images[0];
  return cover?.url ?? null;
}

function toListItem(car: CarWithRelations): CarListItem {
  return {
    id: car.id,
    brand: car.brand.name,
    brandSlug: car.brand.slug,
    model: car.model.name,
    trim: car.trim,
    year: car.year,
    condition: car.condition,
    bodyType: car.bodyType,
    price: Number(car.price),
    monthlyFrom: car.monthlyFrom === null ? null : Number(car.monthlyFrom),
    hasPts: car.hasPts,
    inStock: car.inStock,
    coverImage: coverImage(car),
  };
}

function toDetail(car: CarWithRelations): CarDetail {
  return {
    ...toListItem(car),
    fuelType: car.fuelType,
    transmission: car.transmission,
    mileage: car.mileage,
    isFeatured: car.isFeatured,
    description: car.description,
    images: car.images.map((i) => ({
      url: i.url,
      isCover: i.isCover,
      sortOrder: i.sortOrder,
    })),
  };
}

export const catalogService = {
  async listCars(q: CarQuery): Promise<Paginated<CarListItem>> {
    const where = buildWhere(q);
    const [cars, total] = await Promise.all([
      catalogRepository.findCars({
        where,
        orderBy: buildOrderBy(q.sort),
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      catalogRepository.countCars(where),
    ]);
    return {
      items: cars.map(toListItem),
      total,
      page: q.page,
      limit: q.limit,
      totalPages: Math.ceil(total / q.limit),
    };
  },

  async getCar(id: string): Promise<CarDetail> {
    const car = await catalogRepository.findCarById(id);
    if (!car) throw new AppError("Mashina topilmadi", 404, "CAR_NOT_FOUND");
    return toDetail(car);
  },

  async listBrands(): Promise<BrandWithModels[]> {
    const brands = await catalogRepository.findBrandsWithModels();
    return brands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logoUrl: b.logoUrl,
      models: b.models.map((m) => ({ id: m.id, name: m.name, slug: m.slug })),
    }));
  },
};
