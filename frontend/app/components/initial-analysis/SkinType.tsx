"use client";

import { Skin } from "@/lib/initial-analysis/analysis-types";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSkinProfile } from "./SkinProfileContext";

type SkinOption = { id: Skin; label: string; hint: string };
const TYPES: SkinOption[] = [
  { id: "dry", label: "Dry", hint: "Feels tight, may flake" },
  { id: "normal", label: "Normal", hint: "Balanced, rarely shiny" },
  {
    id: "combination",
    label: "Combination",
    hint: "Oily T-zone, drier cheeks",
  },
  { id: "oily", label: "Oily", hint: "Shiny within a few hours" },
];

export function SkinType({
  choosenSkinType,
  setChoosenSkinType,
}: {
  choosenSkinType: Skin | null;
  setChoosenSkinType: (skinType: Skin | null) => void;
}) {
  const selectedType = TYPES.find((t) => choosenSkinType === t.id);
  const { toggleFeature: toggleFeature } = useSkinProfile();

  return (
    <fieldset className="w-full m-0 border-0 p-0 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <legend className="mb-3.5  text-xl font-semibold">
          What's your skin type?
        </legend>
        <span className="text-secondary text-xs">
          Not sure?{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.britishskinfoundation.org.uk/resources/identifying-your-skin-type-a-guide-by-dr-jonathan-kentley"
            className="underline cursor-pointer"
          >
            How to tell
          </a>
        </span>
      </div>

      <div className="w-full grid grid-cols-4 rounded-full bg-ink/5 p-1">
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
                  className="absolute inset-0 bg-white shadow-md "
                />
              )}
              <input
                type="radio"
                name="skin-type"
                value={t.id}
                checked={choosenSkinType === t.id}
                onChange={() => {
                  toggleFeature("skinType", t.id);
                  setChoosenSkinType(t.id);
                }}
                className="absolute inset-0 z-10 opacity-0 cursor-pointer "
              />
              <span
                className={cn(
                  "relative transition-colors",
                  selected ? "font-semibold text-primary" : "text-ink/80",
                )}
              >
                {t.label}
              </span>
            </label>
          );
        })}
      </div>
      <div className="flex items-center justify-between h-5" aria-live="polite">
        <AnimatePresence mode="wait">
          {selectedType && (
            <motion.span
              key={selectedType.id}
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="block text-neutral-500 text-sm"
            >
              {selectedType.hint}
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {choosenSkinType !== null && (
            <motion.button
              key="clear-selection"
              initial={{
                opacity: 0,
                scale: 0.5,
                filter: "blur(8px)",
              }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(8px)" }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              onClick={() => {
                setChoosenSkinType(null);
                toggleFeature("skinType", "not-sure")
                toast.success("Selection Cleared");
              }}
              className="relative group cursor-pointer rounded-full h-5 w-5 bg-primary text-white flex items-center justify-center"
            >
              <X className="w-3 h-3" />
              <div className="text-xs text-primary border border-neutral-200 absolute bottom-full left-1/2 -translate-x-1/2  translate-y-1 whitespace-nowrap rounded-md mb-3 px-3 py-1.5 bg-white opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
                Clear Selection
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </fieldset>
  );
}
