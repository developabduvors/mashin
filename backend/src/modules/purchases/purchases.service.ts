import { purchasesRepository } from "./purchases.repository";
import { toListItem } from "../catalog/catalog.service";
import type { PurchasedCar } from "./purchases.types";

export const purchasesService = {
  async list(userId: string): Promise<PurchasedCar[]> {
    const purchases = await purchasesRepository.findCarsByUser(userId);
    return purchases.map((p) => toListItem(p.car));
  },
};
