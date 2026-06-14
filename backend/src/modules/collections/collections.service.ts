import {
  collectionsRepository,
  type CollectionCarWithRelations,
} from "./collections.repository";
import { AppError } from "../../utils/AppError";
import type { CarListItem } from "../catalog/catalog.types";
import type { CollectionListItem, CollectionDetail } from "./collections.types";

// Catalog'dagi kartochka shakliga bir xil — CarListItem chiqaradi.
function toCarListItem(car: CollectionCarWithRelations): CarListItem {
  const cover = car.images.find((i) => i.isCover) ?? car.images[0];
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
    coverImage: cover?.url ?? null,
  };
}

export const collectionsService = {
  async list(): Promise<CollectionListItem[]> {
    const collections = await collectionsRepository.findAll();
    return collections.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      imageUrl: c.imageUrl,
      carCount: c._count.cars,
    }));
  },

  async getBySlug(slug: string): Promise<CollectionDetail> {
    const c = await collectionsRepository.findBySlug(slug);
    if (!c) throw new AppError("Podborka topilmadi", 404, "COLLECTION_NOT_FOUND");
    return {
      id: c.id,
      title: c.title,
      slug: c.slug,
      imageUrl: c.imageUrl,
      cars: c.cars.map((cc) => toCarListItem(cc.car)),
    };
  },
};
