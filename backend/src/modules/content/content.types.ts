export interface PartnerBankItem {
  id: string;
  name: string;
  logoUrl: string;
  isInsurer: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  text: string;
  source: string | null;
  rating: number | null;
  createdAt: string;
}

export interface RatingItem {
  id: string;
  platform: string;
  rating: number;
  recommendPercent: number | null;
  url: string | null;
}

// Blog ro'yxati — yengil (body'siz).
export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverUrl: string | null;
  publishedAt: string | null;
}

export interface BlogDetail extends BlogListItem {
  body: string | null;
}

export interface CityItem {
  id: string;
  name: string;
  slug: string;
  isDefault: boolean;
}

export interface DealershipItem {
  id: string;
  address: string;
  phones: string[];
  schedule: string | null;
  lat: number | null;
  lng: number | null;
}

export interface ContactsResult {
  city: CityItem;
  dealerships: DealershipItem[];
}
