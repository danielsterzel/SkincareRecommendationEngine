export type Skin = "dry" | "normal" | "combination" | "oily" | "not-sure";
export type SkinProblemMock =
  | "redness"
  | "dryness"
  | "acne"
  | "dark-spots"
  | "clogged-pores"
  | "other";

type SkinTone =  | "even"
  | "slighty-uneven"
  | "unven"
  | "redness"
  | "discolored";
export type ToneAnswer = SkinTone[]
 
export type HydrationAnswer =
  | "dry-flaky"
  | "dry"
  | "hydrated"
  | "well-hydrated"
  | "glassy";

type SkinTexture = "smooth" | "slightly-rough" | "rough" | "bumpy" | "pitted" | "pimply";
export type TextureAnswer = SkinTexture[];

export type SkinTypeAnswer = Skin;
export type SensitiveAnswer = boolean;
export interface SkinProfile {
  tone: ToneAnswer;
  hydration: HydrationAnswer;
  texture: TextureAnswer;
  skinType: SkinTypeAnswer;
  sensitive: SensitiveAnswer;
  other: string;
}
export type SkinFeature = keyof SkinProfile;
