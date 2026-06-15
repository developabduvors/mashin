import { 
  BrandWithModels, 
  CarListItem, 
  Paginated, 
  CollectionListItem, 
  CreditProgramItem, 
  PartnerBankItem, 
  RatingItem, 
  ReviewItem, 
  BlogListItem, 
  ContactsResult, 
  CityItem,
  CarDetail,
  LeadPayload
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api';

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'API request failed');
  }

  return res.json();
}

export const api = {
  brands: {
    getAll: () => fetcher<BrandWithModels[]>('/brands'),
  },
  cars: {
    getAll: (params?: Record<string, string | number | boolean>) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return fetcher<Paginated<CarListItem>>(`/cars${query}`);
    },
    getById: (id: string) => fetcher<CarDetail>(`/cars/${id}`),
  },
  collections: {
    getAll: () => fetcher<CollectionListItem[]>('/collections'),
  },
  creditPrograms: {
    getAll: () => fetcher<CreditProgramItem[]>('/credit-programs'),
  },
  partnerBanks: {
    getAll: () => fetcher<PartnerBankItem[]>('/partner-banks'),
  },
  ratings: {
    getAll: () => fetcher<RatingItem[]>('/ratings'),
  },
  reviews: {
    getAll: () => fetcher<ReviewItem[]>('/reviews'),
  },
  blog: {
    getAll: () => fetcher<BlogListItem[]>('/blog'),
  },
  cities: {
    getAll: () => fetcher<CityItem[]>('/cities'),
  },
  contacts: {
    getByCity: (citySlug: string) => fetcher<ContactsResult>(`/contacts?city=${citySlug}`),
  },
  leads: {
    create: (payload: LeadPayload) => fetcher('/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },
};
