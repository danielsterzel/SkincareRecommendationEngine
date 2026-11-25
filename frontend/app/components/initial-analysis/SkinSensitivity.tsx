"use client";
import { motion, type Variants } from "motion/react";
import { useState } from "react";
import { useSkinProfile } from "./SkinProfileContext";
import {
  SensitiveAnswer,
  SensitivityLabelsArray,
} from "@/lib/initial-analysis/analysis-types";
import { AnimatedCheck } from "./AnimatedCheck";
import { cn } from "@/lib/cn";

const ContainerVariant: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.2, duration: 0.3, ease: "easeOut" },
  },
};

const ItemVariant: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function SkinSensitivity() {
  const [chosenOption, setChosenOption] =
    useState<SensitiveAnswer>("unknown");

  const { toggleFeature } = useSkinProfile();

  return (
    <div className="flex flex-col gap-2">
      <h2 className="mb-6 text-2xl font-semibold text-primary">
        How does your skin react to new products?
      </h2>
      <motion.ul
        initial="initial"
        animate="animate"
        variants={ContainerVariant}
        className="flex flex-col gap-2 w-full"
      >
        {SensitivityLabelsArray.map((sensitivity) => {
          return (
            <motion.li variants={ItemVariant} key={sensitivity.sensitivity}>
              <button
                onClick={() => {
                  setChosenOption(sensitivity.sensitivity);
                  toggleFeature("sensitive", sensitivity.sensitivity);
                }}
                className={cn(
                  "hover:bg-stone-200 transition-colors duration-200 w-full cursor-pointer flex items-center justify-between rounded-2xl p-2",
                  chosenOption === sensitivity.sensitivity ? "bg-stone-300" : "bg-white",
                )}
              >
                <h4 className="text-sm font-medium">{sensitivity.label}</h4>
                <AnimatedCheck
                  className="w-5 h-5"
                  iconClassName="w-4 h-4"
                  checked={chosenOption === sensitivity.sensitivity}
                />
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
