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
  id: string;
  url: string;
  isCover: boolean;
  sortOrder: number;
}

export interface CarListItem {
  id: string;
  brand: { name: string; slug: string };
  model: { name: string; slug: string };
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

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverUrl?: string;
  publishedAt?: string;
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
  city: string;
  dealerships: Dealership[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
