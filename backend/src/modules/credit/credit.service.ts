import type { CreditProgram } from "@prisma/client";
import { creditRepository } from "./credit.repository";
import { AppError } from "../../utils/AppError";
import type { CreditProgramItem } from "./credit.types";

function toItem(p: CreditProgram): CreditProgramItem {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    kind: p.kind,
    ratePercent: p.ratePercent === null ? null : Number(p.ratePercent),
    description: p.description,
    imageUrl: p.imageUrl,
    sortOrder: p.sortOrder,
  };
}

export const creditService = {
  async list(): Promise<CreditProgramItem[]> {
    const programs = await creditRepository.findActive();
    return programs.map(toItem);
  },

  async getBySlug(slug: string): Promise<CreditProgramItem> {
    const program = await creditRepository.findActiveBySlug(slug);
    if (!program) throw new AppError("Dastur topilmadi", 404, "CREDIT_PROGRAM_NOT_FOUND");
    return toItem(program);
  },
};
