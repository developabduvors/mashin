import { favoritesRepository } from "./favorites.repository";
import { toListItem } from "../catalog/catalog.service";
import { AppError } from "../../utils/AppError";
import type { FavoriteCar } from "./favorites.types";

export const favoritesService = {
  async list(userId: string): Promise<FavoriteCar[]> {
    const favorites = await favoritesRepository.findCarsByUser(userId);
    return favorites.map((f) => toListItem(f.car));
  },

  async add(userId: string, carId: string): Promise<void> {
    const car = await favoritesRepository.carExists(carId);
    if (!car) throw new AppError("Mashina topilmadi", 404, "CAR_NOT_FOUND");
    await favoritesRepository.add(userId, carId);
  },

  async remove(userId: string, carId: string): Promise<void> {
    await favoritesRepository.remove(userId, carId);
  },
};
