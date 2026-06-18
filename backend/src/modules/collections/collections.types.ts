import type { CarListItem } from "../catalog/catalog.types";

export interface CollectionListItem {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  carCount: number;
}

export interface CollectionDetail {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  cars: CarListItem[];
}
