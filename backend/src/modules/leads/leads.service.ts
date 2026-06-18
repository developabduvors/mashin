import type { Prisma, Lead } from "@prisma/client";
import { leadsRepository } from "./leads.repository";
import { AppError } from "../../utils/AppError";
import type {
  CreateLeadInput,
  AdminLeadQuery,
  UpdateLeadInput,
} from "./leads.schemas";
import type { LeadCreated, LeadItem } from "./leads.types";
import type { Paginated } from "../catalog/catalog.types";

function toItem(l: Lead): LeadItem {
  return {
    id: l.id,
    type: l.type,
    status: l.status,
    name: l.name,
    phone: l.phone,
    carId: l.carId,
    brandId: l.brandId,
    modelId: l.modelId,
    trim: l.trim,
    creditAmount: l.creditAmount === null ? null : Number(l.creditAmount),
    termMonths: l.termMonths,
    downPayment: l.downPayment === null ? null : Number(l.downPayment),
    source: l.source,
    note: l.note,
    createdAt: l.createdAt.toISOString(),
  };
}

export const leadsService = {
  // Public — validatsiyadan o'tgan toza input keladi. Faqat berilgan
  // maydonlar yoziladi; qolganlari undefined (Prisma'da NULL).
  async create(input: CreateLeadInput): Promise<LeadCreated> {
    const data: Prisma.LeadCreateInput = {
      type: input.type,
      phone: input.phone,
      name: input.name,
      source: input.source,
      note: input.note,
    };
    if (input.type === "CREDIT_APPLICATION") {
      data.brandId = input.brandId;
      data.modelId = input.modelId;
      data.trim = input.trim;
      data.creditAmount = input.creditAmount;
      data.termMonths = input.termMonths;
      data.downPayment = input.downPayment;
    } else if (input.type === "CAR_INQUIRY") {
      data.carId = input.carId;
    }
    return leadsRepository.create(data);
  },

  async list(q: AdminLeadQuery): Promise<Paginated<LeadItem>> {
    const where: Prisma.LeadWhereInput = {};
    if (q.status) where.status = q.status;
    if (q.type) where.type = q.type;

    const [leads, total] = await Promise.all([
      leadsRepository.findMany({
        where,
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      leadsRepository.count(where),
    ]);
    return {
      items: leads.map(toItem),
      total,
      page: q.page,
      limit: q.limit,
      totalPages: Math.ceil(total / q.limit),
    };
  },

  async updateStatus(id: string, input: UpdateLeadInput): Promise<LeadItem> {
    const existing = await leadsRepository.findById(id);
    if (!existing) throw new AppError("Lead topilmadi", 404, "LEAD_NOT_FOUND");
    const updated = await leadsRepository.update(id, {
      status: input.status,
      note: input.note ?? existing.note,
    });
    return toItem(updated);
  },
};
