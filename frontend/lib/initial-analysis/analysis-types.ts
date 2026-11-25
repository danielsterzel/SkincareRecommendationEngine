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
export type SensitiveAnswer = "very_high" | "high" | "mild" | "low" | "unknown";
export interface SkinProfile {
  tone: ToneAnswer;
  hydration: HydrationAnswer;
  texture: TextureAnswer;
  skinType: SkinTypeAnswer;
  sensitive: SensitiveAnswer;
  other: string;
}
export type SkinFeature = keyof SkinProfile;

type SensitivityLabel = {
  sensitivity: SensitiveAnswer;
  label: string;
};

// TODO: CHANGE LATER TO ACTUAL VALUES!!!!!!! YOU CANNOT MAP THIS 
// NEED SCIENTIFIC EVIDENCE
export const SensitivityLabelsArray: SensitivityLabel[] = [
  { sensitivity: "very_high", label: "My skin easily becomes red" },
  { sensitivity: "high", label: "Some products cause stinging or burning sensation" },
  { sensitivity: "mild", label: "I experience reactions to specific ingredients" },
  { sensitivity: "low", label: "My skin rarely reacts to products" },
  { sensitivity: "unknown", label: "I'm not sure" },
];
