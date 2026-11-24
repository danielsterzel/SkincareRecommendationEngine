"use client";

import { Skin } from "@/lib/initial-analysis/analysis-types";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ArrowUpRight, Droplets, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSkinProfile } from "./SkinProfileContext";

const HOW_TO_TELL_URL =
  "https://www.britishskinfoundation.org.uk/resources/identifying-your-skin-type-a-guide-by-dr-jonathan-kentley";

type SkinOption = {
  id: Skin;
  label: string;
  description: string;
  traits: string[];
};

const TYPES: SkinOption[] = [
  {
    id: "dry",
    label: "Dry",
    description:
      "Your skin produces less oil than it needs, so it struggles to hold on to moisture.",
    traits: ["Feels tight after washing", "Flaky patches", "Barely visible pores"],
  },
  {
    id: "normal",
    label: "Normal",
    description:
      "Oil and moisture are in balance. Your skin is comfortable most of the day.",
    traits: ["Rarely shiny", "Few breakouts", "Even texture"],
  },
  {
    id: "combination",
    label: "Combination",
    description:
      "Different zones behave differently: oily through the middle, drier on the sides.",
    traits: ["Oily T-zone", "Drier cheeks", "Pores visible on nose"],
  },
  {
    id: "oily",
    label: "Oily",
    description:
      "Your skin produces extra sebum, which keeps it supple but prone to shine and congestion.",
    traits: ["Shiny within hours", "Enlarged pores", "Prone to breakouts"],
  },
  {
    id: "not-sure",
    label: "Not sure",
    description:
      "No problem. Try this quick test, or skip it and we'll infer it from your other answers.",
    traits: [
      "Wash with a gentle cleanser",
      "Leave skin bare for 1 hour",
      "Check how it looks and feels",
    ],
  },
];

export function SkinType({
  choosenSkinType,
  setChoosenSkinType,
}: {
  choosenSkinType: Skin | null;
  setChoosenSkinType: (skinType: Skin | null) => void;
}) {
  const selectedType = TYPES.find((t) => choosenSkinType === t.id);
  const { setFeature, clearFeature } = useSkinProfile();

  return (
    <fieldset className="w-full m-0 border-0 p-0 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <legend className="mb-3.5 text-xl font-semibold">
          What's your skin type?
        </legend>
        <AnimatePresence>
          {choosenSkinType !== null && (
            <motion.button
              type="button"
              key="clear-selection"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(8px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => {
                setChoosenSkinType(null);
                clearFeature("skinType");
                toast.success("Selection Cleared");
              }}
              className="relative group cursor-pointer rounded-full h-5 w-5 bg-primary text-white flex items-center justify-center"
            >
              <X className="w-3 h-3" />
              <div className="text-xs text-primary border border-neutral-200 absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md mb-3 px-3 py-1.5 bg-white opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
                Clear Selection
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full grid grid-cols-5 rounded-full bg-ink/5 p-1">
        {TYPES.map((t) => {
          const selected = choosenSkinType === t.id;
          return (
            <label
              key={t.id}
              className="relative flex min-h-11 items-center justify-center rounded-full text-sm"
            >
              {selected && (
                <motion.span
                  layoutId="skin-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  style={{ borderRadius: 9999 }}
                  className="absolute inset-0 bg-white shadow-md"
                />
              )}
              <input
                type="radio"
                name="skin-type"
                value={t.id}
                checked={selected}
                onChange={() => {
                  setFeature("skinType", t.id);
                  setChoosenSkinType(t.id);
                }}
                className="absolute inset-0 z-10 opacity-0 cursor-pointer"
              />
              <span
                className={cn(
                  "relative transition-colors",
                  selected ? "font-semibold text-primary" : "text-ink/80",
                  t.id === "not-sure" && !selected && "text-secondary",
                )}
              >
                {t.label}
              </span>
            </label>
          );
        })}
      </div>

      <SkinTypeDescription selectedType={selectedType} />
    </fieldset>
  );
}

function SkinTypeDescription({
  selectedType,
}: {
  selectedType: SkinOption | undefined;
}) {
  return (
    <div className="mt-2 grid" aria-live="polite">
      <motion.div
        aria-hidden={selectedType !== undefined}
        initial={false}
        animate={{ opacity: selectedType ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "col-start-1 row-start-1 flex flex-col gap-3 items-center justify-center px-6 text-center text-xs text-secondary",
          selectedType && "pointer-events-none",
        )}
      >
        <Droplets className="w-7 h-7" strokeWidth={1.4} />
        <span>Pick a type to see what it means for your routine</span>
      </motion.div>

      {TYPES.map((type) => (
        <SkinTypeCard
          key={type.id}
          type={type}
          active={selectedType?.id === type.id}
        />
      ))}
    </div>
  );
}

function SkinTypeCard({ type, active }: { type: SkinOption; active: boolean }) {
  const isNotSure = type.id === "not-sure";
  return (
    <motion.div
      aria-hidden={!active}
      initial={false}
      animate={
        active
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 6, filter: "blur(4px)" }
      }
      transition={{ duration: 0.2, ease: "easeOut", delay: active ? 0.1 : 0 }}
      className={cn(
        "col-start-1 row-start-1 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white/70 px-4 py-3.5",
        !active && "pointer-events-none",
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.18rem] text-primary font-medium">
          {isNotSure ? "Quick test" : `${type.label} skin`}
        </span>
        <p className="text-xs text-neutral-600 leading-relaxed">
          {type.description}
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {type.traits.map((trait, i) => (
          <motion.li
            key={trait}
            initial={false}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
            transition={{ delay: active ? 0.05 * i + 0.15 : 0, duration: 0.2 }}
            className="flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] text-neutral-700"
          >
            {isNotSure ? (
              <span className="text-primary font-semibold">{i + 1}.</span>
            ) : (
              <span className="w-1 h-1 rounded-full bg-stone-1000" />
            )}
            {trait}
          </motion.li>
        ))}
      </ul>

      {isNotSure && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={HOW_TO_TELL_URL}
          tabIndex={active ? 0 : -1}
          className="self-start inline-flex items-center gap-1 text-xs text-secondary underline hover:text-primary transition-colors"
        >
          Read the full guide
          <ArrowUpRight className="w-3 h-3" />
        </a>
      )}
    </motion.div>
  );
}
