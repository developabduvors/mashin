export type Role = 'BUYER' | 'SELLER' | 'ADMIN';

export type Condition = 'NEW' | 'USED';

export type BodyType = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'CROSSOVER' | 'MINIVAN' | 'COUPE';

export type FuelType = 'PETROL' | 'DIESEL' | 'HYBRID' | 'ELECTRIC' | 'GAS';

export type Transmission = 'MT' | 'AT' | 'CVT' | 'ROBOT';

export type LeadType = 'CREDIT_APPLICATION' | 'BEAT_OFFER' | 'CALLBACK' | 'CAR_INQUIRY';

export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';

export type CreditKind = 'CREDIT' | 'INSTALLMENT' | 'TRADE_IN' | 'TAXI' | 'SPECIAL';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface CarModel {
  id: string;
  name: string;
  slug: string;
  brandId: string;
}

export interface BrandWithModels extends Brand {
  models: CarModel[];
}

export interface CarImage {
  // NOTE: backend DTO (catalog.service.ts) returns only these 3 fields — no `id`.
  url: string;
  isCover: boolean;
  sortOrder: number;
}

export interface CarListItem {
  id: string;
  brand: string;       // backend DTO returns car.brand.name (flat string)
  brandSlug: string;
  model: string;       // backend DTO returns car.model.name
  trim: string;
  year: number;
  condition: Condition;
  bodyType: BodyType;
  price: number;
  monthlyFrom?: number;
  hasPts: boolean;
  inStock: boolean;
  coverImage?: string;
}

export interface CarDetail extends CarListItem {
  fuelType: FuelType;
  transmission: Transmission;
  mileage?: number;
  description?: string;
  images: CarImage[];
}

export interface CollectionListItem {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  carCount: number;
}

export interface CreditProgramItem {
  id: string;
  title: string;
  slug: string;
  kind: CreditKind;
  ratePercent?: number;
  description?: string;
  imageUrl?: string;
}

export interface PartnerBankItem {
  id: string;
  name: string;
  logoUrl: string;
  isInsurer: boolean;
}

export interface RatingItem {
  id: string;
  platform: string;
  rating: number;
  recommendPercent?: number;
  url?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  text: string;
  source?: string;
  rating?: number;
  createdAt: string;
}

// Otziv yozish — author logindan olinadi, shuning uchun payloadda yo'q.
export interface CreateReviewPayload {
  text: string;
  rating: number;
}

// Profil tahrirlash — email o'zgartirilmaydi (login identifikatori).
export interface UpdateMePayload {
  fullName?: string;
  phone?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Admin: buyer ro'yxati (sotib olingan mashina formasi uchun).
export interface AdminUserItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
}

// Admin: sotib olingan mashina yozuvi (user + car bilan).
export interface AdminPurchase {
  id: string;
  purchasedAt: string;
  user: { id: string; fullName: string; email: string };
  car: AdminCar;
}

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverUrl?: string;
  publishedAt?: string;
}

// Maqola to'liq ko'rinishi — ro'yxatdan farqli, `body` matni bilan keladi.
export interface BlogDetail extends BlogListItem {
  body?: string;
}

export interface CityItem {
  id: string;
  name: string;
  slug: string;
  isDefault: boolean;
}

export interface Dealership {
  id: string;
  address: string;
  phones: string[];
  schedule?: string;
  lat?: number;
  lng?: number;
}

export interface ContactsResult {
  city: CityItem;        // backend returns the full city object, not just a name
  dealerships: Dealership[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Admin ──

// Backend /api/admin/leads elementi (to'liq lead).
export interface LeadItem {
  id: string;
  type: LeadType;
  status: LeadStatus;
  name: string | null;
  phone: string;
  carId: string | null;
  brandId: string | null;
  modelId: string | null;
  trim: string | null;
  creditAmount: number | null;
  termMonths: number | null;
  downPayment: number | null;
  source: string | null;
  note: string | null;
  createdAt: string;
}

// Admin car-image qatori — public CarImage DTO'dan farqli, `id` bilan keladi
// (CRUD factory'ga o'chirish/yangilash uchun kerak).
export interface AdminCarImage {
  id: string;
  carId: string;
  url: string;
  isCover: boolean;
  sortOrder: number;
}

// /admin/cars elementi — xom Prisma qatori (include: brand/model/images).
// Diqqat: price/monthlyFrom Prisma Decimal -> JSON'da string sifatida keladi.
export interface AdminCar {
  id: string;
  brandId: string;
  modelId: string;
  trim: string;
  year: number;
  condition: Condition;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  price: string;
  monthlyFrom: string | null;
  mileage: number | null;
  hasPts: boolean;
  inStock: boolean;
  isFeatured: boolean;
  description: string | null;
  createdAt: string;
  brand: Brand;
  model: CarModel;
  images: AdminCarImage[];
}

// Mashina yaratish/yangilash payload'i (backend carCreate zod sxemasiga mos).
// Yangilashda hammasi optional (.partial()), shuning uchun Partial bilan ishlatamiz.
export interface CarFormPayload {
  brandId: string;
  modelId: string;
  trim: string;
  year: number;
  condition?: Condition;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  price: number;
  monthlyFrom?: number;
  mileage?: number;
  hasPts?: boolean;
  inStock?: boolean;
  isFeatured?: boolean;
  description?: string;
}

export interface AdminStats {
  cars: number;
  brands: number;
  leadsNew: number;
  leadsByStatus: { status: LeadStatus; count: number }[];
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: Role;
  createdAt: string;
}

export interface LoginResult {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string };
}

export interface LeadPayload {
  type: LeadType;
  name?: string;
  phone: string;
  carId?: string;
  brandId?: string;
  modelId?: string;
  trim?: string;
  creditAmount?: number;
  termMonths?: number;
  downPayment?: number;
  source?: string;
  note?: string;
}
