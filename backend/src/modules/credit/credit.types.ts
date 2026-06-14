export interface CreditProgramItem {
  id: string;
  title: string;
  slug: string;
  kind: string;
  ratePercent: number | null;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
}
