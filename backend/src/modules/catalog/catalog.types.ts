export interface CarListItem {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  trim: string;
  year: number;
  condition: "NEW" | "USED";
  bodyType: string;
  price: number;
  monthlyFrom: number | null;
  hasPts: boolean;
  inStock: boolean;
  coverImage: string | null;
}

export interface CarImageDTO {
  url: string;
  isCover: boolean;
  sortOrder: number;
}

export interface CarDetail extends CarListItem {
  fuelType: string;
  transmission: string;
  mileage: number | null;
  isFeatured: boolean;
  description: string | null;
  images: CarImageDTO[];
}

export interface BrandWithModels {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  models: { id: string; name: string; slug: string }[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
