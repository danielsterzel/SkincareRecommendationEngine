"use client";

import { Check, LoaderCircle, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const badges = ["Dry skin", "Sensitivity", "Radiance goal"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.75,
    },
  },
};

const badgeVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: "blur(3px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

export function IntroductionNode() {
  const [completed, setCompleted] = useState(false);

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={completed ? "complete" : "analyzing"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className={`text-lg font-medium tracking-tight ${
                completed ? "text-charcoal" : "text-secondary"
              }`}
            >
              {completed
                ? "Your skin, understood."
                : "Understanding your skin..."}
            </motion.p>
          </AnimatePresence>
          <motion.p
            initial={false}
            animate={{ opacity: completed ? 1 : 0, y: completed ? 0 : 6 }}
            transition={{ duration: 0.35 }}
            aria-hidden={!completed}
            className="text-xs leading-relaxed text-secondary"
          >
            Your skin profile is ready to guide every step of your routine.
          </motion.p>
        </div>

        <div className="flex size-6 shrink-0 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {completed ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex size-5 items-center justify-center rounded-full bg-charcoal text-white"
              >
                <Check size={12} strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                exit={{ opacity: 0, scale: 0.6 }}
                className="flex size-5 items-center justify-center"
              >
                <LoaderCircle
                  size={16}
                  className="animate-spin text-secondary"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="flex min-h-8 shrink-0 flex-wrap items-center gap-1.5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={(definition) => {
          if (definition === "visible") setCompleted(true);
        }}
      >
        {badges.map((badge) => (
          <motion.span
            key={badge}
            variants={badgeVariants}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-charcoal/10 bg-stone-50/80 px-2 py-1 text-[11px] font-medium text-charcoal/80"
          >
            <span className="size-1 rounded-full bg-[#B7A393]" />
            {badge}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: completed ? 1 : 0, y: completed ? 0 : 6 }}
        transition={{ duration: 0.35 }}
        aria-hidden={!completed}
        className="flex items-center gap-1.5 text-xs text-secondary"
      >
        <Sparkles size={12} strokeWidth={1.4} className="shrink-0" />
        <span>Personalized to your skin's unique needs</span>
      </motion.div>
    </div>
  );
}
