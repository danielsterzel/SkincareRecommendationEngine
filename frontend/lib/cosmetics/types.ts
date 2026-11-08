export type SkinAilmentCategory =
  | "tone"
  | "texture"
  | "hydration"
  | "sun-damage"
  | "dirtiness";

export type SkinAilment = {
  category: SkinAilmentCategory;
  problem: string;
  description?: string;
};

export type CosmeticCategory =
  | "serum"
  | "cleanser"
  | "moisturizer"
  | "retinol"
  | "peptide"
  | "spf";
export type CosmeticSubCategory = "water-based" | "cream" | "lotion";

export type Cosmetic = {
  brand: string;
  product: string;
  sizeMl: number;
  category: CosmeticCategory;
  subCategory?: CosmeticSubCategory;
  helpsWith: SkinAilment[];
  choosenFor?: string;
};

export type RoutineCosmetic = Cosmetic & {
  applied: boolean;
};
