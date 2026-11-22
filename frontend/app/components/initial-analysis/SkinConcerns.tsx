"use client";
import { type SkinProblemMock } from "@/lib/initial-analysis/analysis-types";
import { AnimatedCheck } from "./AnimatedCheck";
import { motion } from "motion/react";
import { useSkinProfile } from "./SkinProfileContext";
export function SkinConcerns({
  concerns,
  updateConcerns,
}: {
  concerns: SkinProblemMock[];
  updateConcerns: (concern: SkinProblemMock) => void;
}) {
  const { skinProfile, toggleFeature, toggleArrayFeature } = useSkinProfile();

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="tracking-tight text-xl font-semibold cursor-default">
          What are you noticing?
        </h2>
        <p className="text-secondary text-xs cursor-default">
          Select all that apply
        </p>
      </div>

      <div className="w-full flex items-center gap-3">
        <div className="w-full grid grid-rows-2 gap-2">
          <div className="grid grid-cols-3 gap-2">
            <SkinProblemBadge
              selected={concerns.includes("redness")}
              problem="Redness"
              skinTargets={["Skin", "Tone"]}
              includeProblem={() => {
                toggleArrayFeature("tone", "redness");
                updateConcerns("redness");
              }}
            />
            <SkinProblemBadge
              selected={concerns.includes("dryness")}
              problem="Dryness"
              skinTargets={["Hydration"]}
              includeProblem={() => {
                toggleFeature("hydration", "dry");
                updateConcerns("dryness");
              }}
            />
            <SkinProblemBadge
              selected={concerns.includes("acne")}
              problem="Acne"
              skinTargets={["Skin", "Texture"]}
              includeProblem={() => {
                toggleArrayFeature("texture", "pimply")
                updateConcerns("acne");
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SkinProblemBadge
              selected={concerns.includes("dark-spots")}
              problem="Dark Spots"
              skinTargets={["Skin", "Tone"]}
              includeProblem={() => {
                toggleArrayFeature("tone", "discolored");
                updateConcerns("dark-spots");
              }}
            />
            <SkinProblemBadge
              selected={concerns.includes("clogged-pores")}
              problem="Clogged Pores"
              skinTargets={["Skin", "Texture"]}
              includeProblem={() => {
                toggleArrayFeature("texture", "bumpy")
                updateConcerns("clogged-pores")}
            }
            />
            <SkinProblemBadge
              type="secondary"
              selected={concerns.includes("other")}
              problem="Something else"
              skinTargets={["Not listed here"]}
              includeProblem={() => {
                toggleFeature("other", "Other")
                updateConcerns("other")

              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkinProblemBadge({
  problem,
  type,
  skinTargets,
  includeProblem,
  selected,
}: {
  problem: string;
  type?: "secondary";
  skinTargets: string[];
  includeProblem: () => void;
  selected: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={includeProblem}
      aria-pressed={selected}
      className={`py-3 w-full min-w-0 shadow-sm 
        
      ${type === "secondary" ? "border-[0.5px] border-dashed border-neutral-400" : "border-[0.5px] border-neutral-400"}   
      transition-colors duration-300 cursor-pointer rounded-2xl
      flex flex-col items-center justify-center bg-white
      text-primary hover:bg-zinc-200
      ${selected && `border-primary`}
    `}
    >
      <div className="w-full px-3 flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h3 className="text-xs font-medium">{problem}</h3>
          <div className="flex items-center gap-[2px] tracking-widest text-secondary text-[10px]">
            {skinTargets.map((skinTargetPart, idx) => {
              if (idx === skinTargets.length - 1) {
                return <p key={idx}>{skinTargetPart}</p>;
              }
              return (
                <div key={idx} className="flex items-center gap-0.5">
                  <p>{skinTargetPart}</p>
                  <div className="w-[2px] h-[2px] rounded-full bg-neutral-500" />
                </div>
              );
            })}
          </div>
        </div>
        <AnimatedCheck checked={selected} />
      </div>
    </motion.button>
  );
}
