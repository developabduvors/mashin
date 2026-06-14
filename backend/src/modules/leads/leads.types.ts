// Public POST javobi — hech qanday maxfiy ma'lumot chiqmaydi.
export interface LeadCreated {
  id: string;
  status: string;
}

// Admin ro'yxat elementi (to'liq lead).
export interface LeadItem {
  id: string;
  type: string;
  status: string;
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
