"use client";
import { type SkinProblemMock } from "@/lib/initial-analysis/analysis-types";
import { Check } from "lucide-react";
import { motion } from "motion/react";
export function SkinConcerns({
  concerns,
  updateConcerns,
}: {
  concerns: SkinProblemMock[];
  updateConcerns: (concern: SkinProblemMock) => void;
}) {
  return (
    <div className="max-w-[600px] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="tracking-tight text-2xl font-semibold cursor-default">
          What are you noticing?
        </h2>
        <p className="text-secondary text-sm cursor-default">Select all that apply</p>
      </div>

      <div className="w-full flex items-center gap-3">
        <div className="grid grid-rows-2 gap-2">
          <div className="flex items-center gap-1">
            <SkinProblemBadge
              selected={concerns.includes("redness")}
              problem="Redness"
              skinTargets={["Skin", "Tone"]}
              includeProblem={() => updateConcerns("redness")}
            />
            <SkinProblemBadge
              selected={concerns.includes("dryness")}
              problem="Dryness"
              skinTargets={["Hydration"]}
              includeProblem={() => updateConcerns("dryness")}
            />
            <SkinProblemBadge
              selected={concerns.includes("acne")}
              problem="Acne"
              skinTargets={["Skin", "Texture"]}
              includeProblem={() => updateConcerns("acne")}
            />
          </div>
          <div className="flex items-center gap-1">
            <SkinProblemBadge
              selected={concerns.includes("dark-spots")}
              problem="Dark Spots"
              skinTargets={["Skin", "Tone"]}
              includeProblem={() => updateConcerns("dark-spots")}
            />
            <SkinProblemBadge
              selected={concerns.includes("clogged-pores")}
              problem="Clogged Pores"
              skinTargets={["Skin", "Texture"]}
              includeProblem={() => updateConcerns("clogged-pores")}
            />
            <SkinProblemBadge
              type="secondary"
              selected={concerns.includes("other")}
              problem="None of these"
              skinTargets={["Nothing in particular"]}
              includeProblem={() => updateConcerns("other")}
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
      className={`py-3 w-48 shadow-sm 
        
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
        <div
          className={`flex items-center justify-center w-3 h-3 shrink-0 rounded-full border transition-colors duration-300 ${selected ? "bg-primary border-primary" : "bg-white border-neutral-400"}`}
        >
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-2 h-2 text-white"
          >
            <motion.path
              d="M5 12l4 4L19 6"
              initial={false}
              animate={{
                pathLength: selected ? 1 : 0,
                opacity: selected ? 1 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            />
          </motion.svg>
        </div>
      </div>
    </motion.button>
  );
}
