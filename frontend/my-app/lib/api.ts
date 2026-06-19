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
  BlogDetail,
  ContactsResult,
  CityItem,
  CarDetail,
  CreateReviewPayload,
  UpdateMePayload,
  ChangePasswordPayload,
  AuthUser,
  AdminUserItem,
  AdminPurchase,
  LeadPayload,
  LeadItem,
  LeadType,
  LeadStatus,
  AdminStats,
  AdminCar,
  AdminCarImage,
  CarFormPayload
} from './types';
import { getToken, logout } from './auth';
import { getBuyerToken, logoutBuyer } from './buyer-auth';

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
    // Backend xatolarni nested formatda qaytaradi: { error: { message, code } }.
    // Avval shu shaklni o'qiymiz, keyin top-level message, oxirida status fallback.
    const body = await res.json().catch(() => null);
    const message =
      body?.error?.message ?? body?.message ?? `API request failed (${res.status})`;
    throw new Error(message);
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
    // Otziv yozish — buyer token talab qiladi (buyerFetcher).
    create: (payload: CreateReviewPayload) =>
      buyerFetcher<{ review: ReviewItem }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(payload),
      }).then((r) => r.review),
  },
  blog: {
    getAll: () => fetcher<{ posts: BlogListItem[] }>('/blog').then((r) => r.posts),
    // Backend detalni { post: {...} } sifatida o'raydi — bo'sh array'ga emas.
    getBySlug: (slug: string) =>
      fetcher<{ post: BlogDetail }>(`/blog/${slug}`).then((r) => r.post),
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
  // Profil — buyer token talab qiladi (buyerFetcher).
  auth: {
    updateMe: (payload: UpdateMePayload) =>
      buyerFetcher<{ user: AuthUser }>('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }).then((r) => r.user),
    changePassword: (payload: ChangePasswordPayload) =>
      buyerFetcher<void>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  // Sotib olingan mashinalar — buyer token talab qiladi.
  purchases: {
    list: () =>
      buyerFetcher<{ cars: CarListItem[] }>('/me/purchases').then((r) => r.cars),
  },
  // Избранное — buyer token talab qiladi (buyerFetcher).
  favorites: {
    list: () =>
      buyerFetcher<{ cars: CarListItem[] }>('/favorites').then((r) => r.cars),
    add: (carId: string) =>
      buyerFetcher<{ ok: true }>(`/favorites/${carId}`, { method: 'POST' }),
    remove: (carId: string) =>
      buyerFetcher<void>(`/favorites/${carId}`, { method: 'DELETE' }),
  },
  // getter — adminApi quyida e'lon qilingani uchun TDZ'dan qochish.
  get admin() {
    return adminApi;
  },
};

// ── Buyer (mijoz) authed fetcher ──
// Admin authFetcher'dan alohida: buyer tokenini qo'yadi, 401'da buyer sessiyasini
// tozalab /login ga yuboradi (admin'ga emas).
async function buyerFetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getBuyerToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    logoutBuyer();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Sessiya tugadi — qayta kiring');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `So'rov amalga oshmadi (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Admin (token talab qiladi) ──

// Bearer token qo'shadigan alohida fetcher. 401 → token tozalanadi va login'ga.
async function authFetcher<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    logout();
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    throw new Error('Sessiya tugadi — qayta kiring');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `So'rov amalga oshmadi (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

interface LeadsQuery {
  type?: LeadType;
  status?: LeadStatus;
  page?: number;
  limit?: number;
}

const adminApi = {
  stats: () => authFetcher<AdminStats>('/admin/stats'),

  leads: {
    list: (params: LeadsQuery = {}) => {
      const q = new URLSearchParams();
      if (params.type) q.set('type', params.type);
      if (params.status) q.set('status', params.status);
      q.set('page', String(params.page ?? 1));
      q.set('limit', String(params.limit ?? 20));
      return authFetcher<Paginated<LeadItem>>(`/admin/leads?${q.toString()}`);
    },
    updateStatus: (id: string, status: LeadStatus, note?: string) =>
      authFetcher<{ lead: LeadItem }>(`/admin/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, ...(note !== undefined ? { note } : {}) }),
      }).then((r) => r.lead),
  },

  // Mashina CRUD — backend generic crud.factory orqali ({ item } / { items } qaytaradi).
  cars: {
    list: (page = 1, limit = 20) =>
      authFetcher<Paginated<AdminCar>>(`/admin/cars?page=${page}&limit=${limit}`),
    get: (id: string) =>
      authFetcher<{ item: AdminCar }>(`/admin/cars/${id}`).then((r) => r.item),
    create: (data: CarFormPayload) =>
      authFetcher<{ item: AdminCar }>('/admin/cars', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((r) => r.item),
    update: (id: string, data: Partial<CarFormPayload>) =>
      authFetcher<{ item: AdminCar }>(`/admin/cars/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }).then((r) => r.item),
    remove: (id: string) =>
      authFetcher<void>(`/admin/cars/${id}`, { method: 'DELETE' }),
  },

  // Buyer ro'yxati (sotib olingan mashina formasi uchun dropdown).
  users: {
    list: () =>
      authFetcher<{ users: AdminUserItem[] }>('/admin/users').then((r) => r.users),
  },

  // Sotib olingan mashinalar — admin biriktiradi/o'chiradi.
  purchases: {
    list: (page = 1, limit = 50) =>
      authFetcher<Paginated<AdminPurchase>>(`/admin/purchases?page=${page}&limit=${limit}`),
    create: (data: { userId: string; carId: string; purchasedAt?: string }) =>
      authFetcher<{ item: AdminPurchase }>('/admin/purchases', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((r) => r.item),
    remove: (id: string) =>
      authFetcher<void>(`/admin/purchases/${id}`, { method: 'DELETE' }),
  },

  carImages: {
    create: (data: { carId: string; url: string; isCover?: boolean; sortOrder?: number }) =>
      authFetcher<{ item: AdminCarImage }>('/admin/car-images', {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((r) => r.item),
    remove: (id: string) =>
      authFetcher<void>(`/admin/car-images/${id}`, { method: 'DELETE' }),
  },
};

// Rasmlarni sinxronlaymiz: mavjudlarini o'chirib, formadagi ro'yxatni qaytadan
// yaratamiz (delete-all-then-recreate). Admin vositasi uchun sodda va ishonchli.
export async function saveCarImages(
  carId: string,
  images: { url: string; isCover: boolean }[],
  existing: AdminCarImage[] = [],
): Promise<void> {
  await Promise.all(existing.map((img) => adminApi.carImages.remove(img.id)));
  // Tartibni saqlash uchun ketma-ket (Promise.all tartibni kafolatlamaydi xolos).
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (!img.url.trim()) continue;
    await adminApi.carImages.create({
      carId,
      url: img.url.trim(),
      isCover: img.isCover,
      sortOrder: i,
    });
  }
}
