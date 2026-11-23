"use client";
import { Card } from "@/app/base-components/Card";
import type {
  SkinFeature,
  SkinProfile,
} from "@/lib/initial-analysis/analysis-types";
import { useSkinProfile } from "./SkinProfileContext";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedCheck, DrawnCheck } from "./AnimatedCheck";
import {
  ANALYSIS_STEPS,
  getStepIndex,
  type AnalysisStep,
} from "@/lib/initial-analysis/analysis-steps";

const FEATURE_LABELS_MAP: Record<SkinFeature, string> = {
  tone: "Tone",
  hydration: "Hydration",
  texture: "Texture",
  skinType: "Skin Type",
  sensitive: "Sensitive",
  other: "Other",
};
const FEATURES = Object.keys(FEATURE_LABELS_MAP) as SkinFeature[];

const PROGRESS_LABELS = [
  "Start building your skin profile", // 0
  "Your profile is taking shape", // 1
  "Almost done, one more to go", // 2
  "Your skin profile is complete", // 3
];

// Only the steps before "summary" collect answers; the rest just show results
const TOTAL_PROFILE_STEPS = ANALYSIS_STEPS.indexOf("summary");

export function SkinProfileCard({
  currentStep,
}: {
  currentStep: AnalysisStep;
}) {
  return (
    <Card className="h-full flex flex-col gap-5 bg-linear-[165deg] from-indigo-50 to-stone-50 p-7 border-[0.5px] border-indigo-300 ">
      <div className="w-full flex justify-between items-center">
        <span className="text-sm font-semibold text-neutral-600 ">
          Skin profile
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-indigo-600" />
          <span className="text-indigo-600 text-xs font-medium">
            Updates live
          </span>
        </div>
      </div>
      <div>
        <ProfileStatus />
      </div>
      <div>
        <ProfileCompletionProgress currentStep={currentStep} />
      </div>
    </Card>
  );
}
function ProfileCompletionProgress({
  currentStep,
}: {
  currentStep: AnalysisStep;
}) {
  const completedFields = Math.min(
    getStepIndex(currentStep),
    TOTAL_PROFILE_STEPS,
  );
  const label = PROGRESS_LABELS[completedFields];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm">
        <h4 className="font-semibold">Profile coverage</h4>
        <span className="text-neutral-600">
          {completedFields} of {TOTAL_PROFILE_STEPS} areas filled
        </span>
      </div>
      <div className="flex w-full gap-1.5">
        {Array.from({ length: TOTAL_PROFILE_STEPS }, (_, index) => {
          const progressBarFill = index < completedFields;
          return (
            <span
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-300 bg-neutral-200",
                progressBarFill && "bg-indigo-500",
              )}
            />
          );
        })}
      </div>
      <span className="text-xs text-neutral-600 font-medium">{label}</span>
    </div>
  );
}
function ProfileStatus() {
  const { skinProfile } = useSkinProfile();

  function parseAnswer<K extends SkinFeature>(
    answer: SkinProfile[K] | undefined,
  ): string {
    // == because !answer might catch falsy values
    if (answer == null) return "All clear";
    if (Array.isArray(answer)) {
      if (answer.length === 0) return "All clear";
      return answer.map((a) => a.replaceAll("-", " ")).join(", ");
    }
    if (typeof answer === "boolean") return answer ? "Yes" : "No";
    return String(answer).replaceAll("-", " ");
  }

  return (
    <div className="flex flex-col gap-3">
      {FEATURES.map((feature) => {
        const parsedAnswer = parseAnswer(skinProfile[feature]);
        return (
          <div key={feature} className="grid grid-cols-2 items-start">
            <span className="text-neutral-600">
              {FEATURE_LABELS_MAP[feature]}
            </span>
            {feature === "other" ? (
              <AnimatedCheck
                checked={isFilled(skinProfile.other)}
                className="w-4 h-4 mt-0.5"
                iconClassName="w-2.5 h-2.5"
              />
            ) : (
              <AnimatePresence mode="wait">
                <motion.span
                  key={parsedAnswer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="capitalize flex items-center font-medium gap-1.5"
                >
                  {parsedAnswer}
                  {parsedAnswer === "All clear" && (
                    <DrawnCheck className="text-indigo-600" />
                  )}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}

function isFilled(value: unknown): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}
