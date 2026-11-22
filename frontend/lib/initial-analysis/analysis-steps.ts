export const ANALYSIS_STEPS = [
  "skin-concerns",
  "skin-type",
  "additional-details",
] as const;

export type AnalysisStep = (typeof ANALYSIS_STEPS)[number];

type AnalysisDirections = {
  previous: AnalysisStep | null;
  next: AnalysisStep | null;
};

export const AnalysisNavigation = Object.fromEntries(
  ANALYSIS_STEPS.map((step, i) => [
    step,
    {
      previous: ANALYSIS_STEPS[i - 1] ?? null,
      next: ANALYSIS_STEPS[i + 1] ?? null,
    },
  ]),
) as Record<AnalysisStep, AnalysisDirections>;

export const getStepIndex = (step: AnalysisStep) =>
  ANALYSIS_STEPS.indexOf(step);
