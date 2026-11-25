export type IngredientCategory =
  | "retinoid"
  | "exfoliant"
  | "antioxidant"
  | "hydrator"
  | "brightener"
  | "soothing"
  | "peptide"
  | "emollient"
  | "barrier-support";

export type TimeOfDay = "am" | "pm" | "both";
export type IrritationLevel = 1 | 2 | 3;
export type SkinTypeTag = "all" | "dry" | "normal" | "oily" | "combination" | "sensitive";

export type MockIngredient = {
  id: string;
  name: string;
  inci: string;
  category: IngredientCategory;
  description: string;
  usedFor: string[];
  timeOfDay: TimeOfDay;
  irritation: IrritationLevel;
  skinTypes: SkinTypeTag[];
  pairsWith: string[];
  avoidWith: string[];
  frequentlyUsedIn?: string[];
};

export const mockIngredients: MockIngredient[] = [
  {
    id: "retinol",
    name: "Retinol",
    inci: "Retinol",
    category: "retinoid",
    description:
      "A form of vitamin A that speeds up skin cell turnover. Helps smooth fine lines, even out texture and unclog pores. Can cause dryness and irritation at first, so it's best introduced slowly and used at night with daily sunscreen.",
    usedFor: ["fine lines", "uneven texture", "clogged pores"],
    timeOfDay: "pm",
    irritation: 3,
    skinTypes: ["normal", "oily", "combination"],
    pairsWith: ["niacinamide", "hyaluronic-acid", "peptides", "squalane"],
    avoidWith: ["glycolic-acid", "salicylic-acid", "lactic-acid", "vitamin-c"],
    frequentlyUsedIn: ["night serums", "night creams", "eye creams"],
  },
  {
    id: "niacinamide",
    name: "Niacinamide",
    inci: "Niacinamide",
    category: "barrier-support",
    description:
      "A form of vitamin B3 that supports the skin barrier, calms redness and helps regulate oil. Also helps fade dark spots. Gentle and well tolerated by most skin types.",
    usedFor: ["redness", "excess oil", "dark spots"],
    timeOfDay: "both",
    irritation: 1,
    skinTypes: ["all"],
    pairsWith: ["retinol", "hyaluronic-acid", "salicylic-acid", "alpha-arbutin"],
    avoidWith: [],
    frequentlyUsedIn: ["serums", "moisturizers", "toners"],
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    inci: "Ascorbic Acid",
    category: "antioxidant",
    description:
      "An antioxidant that protects skin from environmental damage and brightens dull skin. Helps fade dark spots and supports collagen. Works best in the morning under sunscreen. Pure ascorbic acid is unstable and can sting sensitive skin.",
    usedFor: ["dullness", "dark spots", "environmental damage"],
    timeOfDay: "am",
    irritation: 2,
    skinTypes: ["normal", "oily", "combination"],
    pairsWith: ["hyaluronic-acid", "alpha-arbutin", "caffeine"],
    avoidWith: ["retinol", "glycolic-acid"],
    frequentlyUsedIn: ["morning serums", "brightening creams"],
  },
  {
    id: "peptides",
    name: "Peptides",
    inci: "Palmitoyl Pentapeptide-4",
    category: "peptide",
    description:
      "Short chains of amino acids that signal the skin to support collagen production. Help improve firmness and the look of fine lines. Very gentle, so they suit sensitive skin and pair well with most actives.",
    usedFor: ["loss of firmness", "fine lines"],
    timeOfDay: "both",
    irritation: 1,
    skinTypes: ["all"],
    pairsWith: ["hyaluronic-acid", "niacinamide", "retinol"],
    avoidWith: ["glycolic-acid"],
    frequentlyUsedIn: ["anti-aging serums", "firming creams", "eye creams"],
  },
  {
    id: "glycolic-acid",
    name: "Glycolic Acid",
    inci: "Glycolic Acid",
    category: "exfoliant",
    description:
      "An AHA (alpha hydroxy acid) that exfoliates the surface of the skin by loosening dead cells. Leaves skin smoother and brighter. Can irritate sensitive skin and increases sun sensitivity, so daily sunscreen is a must.",
    usedFor: ["dullness", "uneven texture", "rough skin"],
    timeOfDay: "pm",
    irritation: 3,
    skinTypes: ["normal", "oily"],
    pairsWith: ["hyaluronic-acid", "squalane"],
    avoidWith: ["retinol", "vitamin-c", "salicylic-acid"],
    frequentlyUsedIn: ["exfoliating toners", "peels", "night serums"],
  },
  {
    id: "salicylic-acid",
    name: "Salicylic Acid",
    inci: "Salicylic Acid",
    category: "exfoliant",
    description:
      "A BHA (beta hydroxy acid) that is oil-soluble, so it can get inside pores and clear them out. Helps with blackheads, breakouts and oily skin. Can be drying, so it's best balanced with a good moisturizer.",
    usedFor: ["blackheads", "breakouts", "excess oil"],
    timeOfDay: "both",
    irritation: 2,
    skinTypes: ["oily", "combination"],
    pairsWith: ["niacinamide", "hyaluronic-acid"],
    avoidWith: ["retinol", "glycolic-acid"],
    frequentlyUsedIn: ["cleansers", "spot treatments", "exfoliating toners"],
  },
  {
    id: "lactic-acid",
    name: "Lactic Acid",
    inci: "Lactic Acid",
    category: "exfoliant",
    description:
      "A gentler AHA with larger molecules than glycolic acid, so it works more slowly at the surface. Exfoliates while also helping skin hold on to moisture. A good first acid for dry or sensitive skin.",
    usedFor: ["dullness", "dryness", "uneven texture"],
    timeOfDay: "pm",
    irritation: 2,
    skinTypes: ["dry", "normal"],
    pairsWith: ["hyaluronic-acid", "squalane"],
    avoidWith: ["retinol", "vitamin-c"],
    frequentlyUsedIn: ["exfoliating serums", "body lotions", "peels"],
  },
  {
    id: "azelaic-acid",
    name: "Azelaic Acid",
    inci: "Azelaic Acid",
    category: "soothing",
    description:
      "A multi-tasking acid that calms redness, helps with breakouts and fades dark marks. Gentle enough for sensitive and redness-prone skin. May tingle for the first few uses.",
    usedFor: ["redness", "breakouts", "dark marks"],
    timeOfDay: "both",
    irritation: 1,
    skinTypes: ["all"],
    pairsWith: ["niacinamide", "hyaluronic-acid"],
    avoidWith: [],
    frequentlyUsedIn: ["creams", "serums", "spot treatments"],
  },
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    inci: "Sodium Hyaluronate",
    category: "hydrator",
    description:
      "A humectant that draws water into the skin and holds it there. Makes skin look plumper and smoother. Suits every skin type and works best applied to slightly damp skin, followed by a moisturizer.",
    usedFor: ["dehydration", "dullness"],
    timeOfDay: "both",
    irritation: 1,
    skinTypes: ["all"],
    pairsWith: ["retinol", "vitamin-c", "niacinamide"],
    avoidWith: [],
    frequentlyUsedIn: ["hydrating serums", "moisturizers", "sheet masks"],
  },
  {
    id: "alpha-arbutin",
    name: "Alpha Arbutin",
    inci: "Alpha-Arbutin",
    category: "brightener",
    description:
      "A brightening ingredient that slows down the production of melanin. Helps fade dark spots and uneven tone over time. Gentle and well tolerated, so it's often used as a milder alternative to stronger brighteners.",
    usedFor: ["dark spots", "uneven tone"],
    timeOfDay: "both",
    irritation: 1,
    skinTypes: ["all"],
    pairsWith: ["niacinamide", "vitamin-c"],
    avoidWith: [],
    frequentlyUsedIn: ["brightening serums", "spot correctors"],
  },
  {
    id: "squalane",
    name: "Squalane",
    inci: "Squalane",
    category: "emollient",
    description:
      "A lightweight, stable oil similar to the oils skin makes on its own. Softens skin and prevents water loss without feeling greasy. Suits most skin types, including oily skin.",
    usedFor: ["dryness", "weakened barrier"],
    timeOfDay: "both",
    irritation: 1,
    skinTypes: ["all"],
    pairsWith: ["retinol", "glycolic-acid", "hyaluronic-acid"],
    avoidWith: [],
    frequentlyUsedIn: ["facial oils", "moisturizers", "cleansing balms"],
  },
  {
    id: "ectoin",
    name: "Ectoin",
    inci: "Ectoin",
    category: "soothing",
    description:
      "A protective molecule produced by microorganisms living in extreme environments. Helps shield skin from stress like pollution and dryness and calms irritation. Very gentle, so it suits sensitive and reactive skin.",
    usedFor: ["irritation", "sensitivity", "dryness"],
    timeOfDay: "both",
    irritation: 1,
    skinTypes: ["all"],
    pairsWith: ["retinol", "hyaluronic-acid", "niacinamide"],
    avoidWith: [],
    frequentlyUsedIn: ["soothing creams", "serums", "sunscreens"],
  },
  {
    id: "caffeine",
    name: "Caffeine",
    inci: "Caffeine",
    category: "antioxidant",
    description:
      "An antioxidant that temporarily tightens blood vessels, which helps reduce puffiness and the look of dark circles. Most often used around the eyes for a quick depuffing effect.",
    usedFor: ["puffiness", "dark circles"],
    timeOfDay: "am",
    irritation: 1,
    skinTypes: ["all"],
    pairsWith: ["peptides", "hyaluronic-acid", "vitamin-c"],
    avoidWith: [],
    frequentlyUsedIn: ["eye creams", "eye serums"],
  },
];