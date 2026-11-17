"use client";
import { AnimatePresence, motion } from "motion/react";

export function ExpandableSection({ showState, component }: { showState: boolean, component: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {showState && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="overflow-hidden"
        >
            {component}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
