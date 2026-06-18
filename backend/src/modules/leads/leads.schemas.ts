import { z } from "zod";

// Telefon: faqat raqamlar saqlanadi (normalizatsiya). +998 90 123 → 99890123
const phone = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .pipe(z.string().min(9, "Telefon raqami noto'g'ri").max(15));

const name = z.string().trim().min(1).max(120).optional();

// Har forma turi o'z minimal maydonlarini talab qiladi (discriminated union).
const beatOffer = z.object({
  type: z.literal("BEAT_OFFER"),
  phone,
  name,
  source: z.string().max(120).optional(),
  note: z.string().max(1000).optional(),
});

const callback = z.object({
  type: z.literal("CALLBACK"),
  phone,
  name,
  source: z.string().max(120).optional(),
  note: z.string().max(1000).optional(),
});

const creditApplication = z.object({
  type: z.literal("CREDIT_APPLICATION"),
  phone,
  name,
  brandId: z.string().uuid().optional(),
  modelId: z.string().uuid().optional(),
  trim: z.string().max(120).optional(),
  creditAmount: z.number().nonnegative().optional(),
  termMonths: z.number().int().min(6).max(84).optional(),
  downPayment: z.number().nonnegative().optional(),
  source: z.string().max(120).optional(),
  note: z.string().max(1000).optional(),
});

const carInquiry = z.object({
  type: z.literal("CAR_INQUIRY"),
  phone,
  name,
  carId: z.string().uuid(),
  source: z.string().max(120).optional(),
  note: z.string().max(1000).optional(),
});

export const createLeadSchema = z.object({
  body: z.discriminatedUnion("type", [beatOffer, callback, creditApplication, carInquiry]),
});

// ── Admin ──
export const adminLeadQuerySchema = z.object({
  query: z.object({
    status: z.enum(["NEW", "IN_PROGRESS", "CONTACTED", "CONVERTED", "REJECTED"]).optional(),
    type: z.enum(["CREDIT_APPLICATION", "BEAT_OFFER", "CALLBACK", "CAR_INQUIRY"]).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: z.enum(["NEW", "IN_PROGRESS", "CONTACTED", "CONVERTED", "REJECTED"]),
    note: z.string().max(1000).optional(),
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>["body"];
export type AdminLeadQuery = z.infer<typeof adminLeadQuerySchema>["query"];
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>["body"];
