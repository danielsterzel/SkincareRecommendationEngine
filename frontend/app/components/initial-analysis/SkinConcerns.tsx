"use client";
import { type SkinProblemMock } from "@/lib/initial-analysis/analysis-types";
import { AnimatedCheck } from "./AnimatedCheck";
import { motion } from "motion/react";
import { useState } from "react";
import { ScanSearch } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSkinProfile } from "./SkinProfileContext";
export function SkinConcerns({
  concerns,
  updateConcerns,
}: {
  concerns: SkinProblemMock[];
  updateConcerns: (concern: SkinProblemMock) => void;
}) {
  const { skinProfile, toggleFeature, toggleArrayFeature } = useSkinProfile();
  const [hoveredConcern, setHoveredConcern] = useState<SkinProblemMock | null>(
    null,
  );
  const shownConcern = hoveredConcern ?? concerns.at(-1) ?? null;
  const hoverProps = (concern: SkinProblemMock) => ({
    onHoverStart: () => setHoveredConcern(concern),
    onHoverEnd: () => setHoveredConcern(null),
    onFocus: () => setHoveredConcern(concern),
    onBlur: () => setHoveredConcern(null),
  });

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
              {...hoverProps("redness")}
              selected={concerns.includes("redness")}
              problem="Redness"
              skinTargets={["Skin", "Tone"]}
              includeProblem={() => {
                toggleArrayFeature("tone", "redness");
                updateConcerns("redness");
              }}
            />
            <SkinProblemBadge
              {...hoverProps("dryness")}
              selected={concerns.includes("dryness")}
              problem="Dryness"
              skinTargets={["Hydration"]}
              includeProblem={() => {
                toggleFeature("hydration", "dry");
                updateConcerns("dryness");
              }}
            />
            <SkinProblemBadge
              {...hoverProps("acne")}
              selected={concerns.includes("acne")}
              problem="Acne"
              skinTargets={["Skin", "Texture"]}
              includeProblem={() => {
                toggleArrayFeature("texture", "pimply");
                updateConcerns("acne");
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SkinProblemBadge
              {...hoverProps("dark-spots")}
              selected={concerns.includes("dark-spots")}
              problem="Dark Spots"
              skinTargets={["Skin", "Tone"]}
              includeProblem={() => {
                toggleArrayFeature("tone", "discolored");
                updateConcerns("dark-spots");
              }}
            />
            <SkinProblemBadge
              {...hoverProps("clogged-pores")}
              selected={concerns.includes("clogged-pores")}
              problem="Clogged Pores"
              skinTargets={["Skin", "Texture"]}
              includeProblem={() => {
                toggleArrayFeature("texture", "bumpy");
                updateConcerns("clogged-pores");
              }}
            />
            <SkinProblemBadge
              type="secondary"
              {...hoverProps("other")}
              selected={concerns.includes("other")}
              problem="Something else"
              skinTargets={["Not listed here"]}
              includeProblem={() => {
                toggleFeature("other", "Other");
                updateConcerns("other");
              }}
            />
          </div>
        </div>
      </div>

      <ConcernExplainer shownConcern={shownConcern} />
    </div>
  );
}

function SkinProblemBadge({
  problem,
  type,
  skinTargets,
  includeProblem,
  selected,
  ...hoverHandlers
}: {
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  problem: string;
  type?: "secondary";
  skinTargets: string[];
  includeProblem: () => void;
  selected: boolean;
}) {
  return (
    <motion.button
      type="button"
      {...hoverHandlers}
      onClick={includeProblem}
      aria-pressed={selected}
      className={`py-3 w-full min-w-0 shadow-sm 
        
      ${type === "secondary" ? "border-[0.5px] border-dashed border-neutral-400" : "border-[0.5px] border-neutral-400"}   
      transition-colors duration-300 cursor-pointer rounded-2xl
      flex flex-col items-center justify-center bg-white
      text-primary hover:bg-stone-200
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

type ConcernInfo = { label: string; description: string; signs: string[] };

const CONCERN_INFO: Record<SkinProblemMock, ConcernInfo> = {
  redness: {
    label: "Redness",
    description:
      "Persistent flushing or pink patches, often a sign of irritation or a weakened skin barrier.",
    signs: [
      "Pink cheeks or nose",
      "Flushes easily",
      "Stings with new products",
    ],
  },
  dryness: {
    label: "Dryness",
    description:
      "Skin that's low on moisture and struggles to hold on to it through the day.",
    signs: [
      "Tight after washing",
      "Flaky patches",
      "Makeup clings to dry spots",
    ],
  },
  acne: {
    label: "Acne",
    description:
      "Inflamed breakouts that form when pores get blocked by oil, dead skin and bacteria.",
    signs: ["Red, tender bumps", "Whiteheads", "Breakouts along jaw or chin"],
  },
  "dark-spots": {
    label: "Dark Spots",
    description:
      "Patches darker than your natural tone, left by sun exposure or past breakouts.",
    signs: [
      "Marks after pimples heal",
      "Spots that darken in sun",
      "Uneven tone",
    ],
  },
  "clogged-pores": {
    label: "Clogged Pores",
    description:
      "Pores filled with oil and dead skin. Not inflamed like acne, but they make skin feel rough.",
    signs: [
      "Blackheads on nose",
      "Tiny bumps under skin",
      "Rough texture to touch",
    ],
  },
  other: {
    label: "Something else",
    description:
      "Noticing something not on the list? You'll be able to describe it in your own words in the last step.",
    signs: ["Describe it in step 3", "We'll factor it into your routine"],
  },
};

const CONCERNS = Object.keys(CONCERN_INFO) as SkinProblemMock[];

function ConcernExplainer({
  shownConcern,
}: {
  shownConcern: SkinProblemMock | null;
}) {
  return (
    <div className="mt-2 grid" aria-live="polite">
      <motion.div
        aria-hidden={shownConcern !== null}
        initial={false}
        animate={{ opacity: shownConcern ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="col-start-1 row-start-1 flex flex-col gap-3 items-center justify-center px-6 text-center text-xs text-secondary"
      >
        <ScanSearch className="w-7 h-7" strokeWidth={1.4} />
        <span>Hover over a concern to see how to spot it</span>
      </motion.div>

      {CONCERNS.map((concern) => {
        const info = CONCERN_INFO[concern];
        const active = shownConcern === concern;
        return (
          <motion.div
            key={concern}
            aria-hidden={!active}
            initial={false}
            animate={
              active
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 6, filter: "blur(4px)" }
            }
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: active ? 0.05 : 0,
            }}
            className={cn(
              "col-start-1 row-start-1 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white/70 px-4 py-3.5",
              !active && "pointer-events-none",
            )}
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.18rem] text-primary font-medium">
                {concern === "other"
                  ? info.label
                  : `How to spot ${info.label.toLowerCase()}`}
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {info.description}
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {info.signs.map((sign, i) => (
                <motion.li
                  key={sign}
                  initial={false}
                  animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                  transition={{
                    delay: active ? 0.04 * i + 0.1 : 0,
                    duration: 0.2,
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] text-neutral-700"
                >
                  <span className="w-1 h-1 rounded-full bg-stone-1000" />
                  {sign}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}
