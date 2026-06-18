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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

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
    // Backend wraps the list as { brands: [...] } — unwrap to a bare array.
    getAll: () =>
      fetcher<{ brands: BrandWithModels[] }>('/brands').then((r) => r.brands),
  },
  cars: {
    getAll: (params?: Record<string, string | number | boolean>) => {
      const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return fetcher<Paginated<CarListItem>>(`/cars${query}`);
    },
    // Backend wraps the detail as { car: {...} } — unwrap to a bare CarDetail.
    getById: (id: string) =>
      fetcher<{ car: CarDetail }>(`/cars/${id}`).then((r) => r.car),
  },
  // NOTE: backend wraps every list in a named key ({ collections: [...] },
  // { programs: [...] }, etc.) — unwrap each to a bare array for the components.
  collections: {
    getAll: () =>
      fetcher<{ collections: CollectionListItem[] }>('/collections').then((r) => r.collections),
  },
  creditPrograms: {
    getAll: () =>
      fetcher<{ programs: CreditProgramItem[] }>('/credit-programs').then((r) => r.programs),
  },
  partnerBanks: {
    getAll: () =>
      fetcher<{ banks: PartnerBankItem[] }>('/partner-banks').then((r) => r.banks),
  },
  ratings: {
    getAll: () => fetcher<{ ratings: RatingItem[] }>('/ratings').then((r) => r.ratings),
  },
  reviews: {
    getAll: () => fetcher<{ reviews: ReviewItem[] }>('/reviews').then((r) => r.reviews),
  },
  blog: {
    getAll: () => fetcher<{ posts: BlogListItem[] }>('/blog').then((r) => r.posts),
  },
  cities: {
    getAll: () => fetcher<{ cities: CityItem[] }>('/cities').then((r) => r.cities),
  },
  contacts: {
    // citySlug bo'lmasa backend default shahar kontaktlarini qaytaradi.
    get: (citySlug?: string) =>
      fetcher<ContactsResult>(citySlug ? `/contacts?city=${citySlug}` : '/contacts'),
  },
  leads: {
    create: (payload: LeadPayload) => fetcher('/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  },
};
