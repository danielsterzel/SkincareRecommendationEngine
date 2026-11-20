import z from "zod";

import { SkinProblemMock, Skin} from "./analysis-types";

export const skinConcerns = z.object({
    concerns: z.array(z.custom<SkinProblemMock>())
})

export const userSkinInformationInput = z.object({
    concerns: skinConcerns,
    skinType: z.custom<Skin | null>(),
    additional_detail: z.string()
})

export const productSchema = z.object({
  brand: z.string(),
  name: z.string(),
  wsm_score: z.number().gt(0).max(1),
});


export const analysisEvent = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("status"),
    message: z.string(),
  }),
  z.object({
    type: z.literal("completed"),
    message: z.string(),
    data: z.array(productSchema),
  }),
  z.object({
    type: z.literal("negative_effects"),
    message: z.string()
  }),
  z.object({
    type: z.literal("context"),
    message: z.string()
  })
]);

export type UserSkinInformationInput = z.infer<typeof userSkinInformationInput>;
export type SkinConcerns = z.infer<typeof skinConcerns>;

export type AnalysisEvent = z.infer<typeof analysisEvent>;
export type Product = z.infer<typeof productSchema>;