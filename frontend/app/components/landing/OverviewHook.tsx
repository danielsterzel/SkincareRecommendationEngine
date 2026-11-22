"use client";
import { ArrowLink } from "../ArrowActiveComponents";
import { motion } from "motion/react";

export function OverviewHook() {
  function clearBrowserSection(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    document
      .getElementById("step-by-step")
      ?.scrollIntoView({ behavior: "smooth" });

    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search,
    );
  }
  return (
    <div className="w-full mt-12 grid grid-cols-[1fr_400px] gap-6">
      <div className="w-full flex flex-col items-start gap-2 pb-6">
        <div className="w-full flex flex-col items-start gap-2">
          <motion.p
            initial="initial"
            animate="animate"
            variants={TextEnterVariant}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            className="cursor-default text-xs sm:text-[10px] font-light tracking-[0.25em] text-secondary uppercase"
          >
            Skincare redefined
          </motion.p>
          <motion.h1
            initial="initial"
            animate="animate"
            variants={TextEnterVariant}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="cursor-default text-5xl tracking-tighter"
          >
            Skincare that reads your skin
          </motion.h1>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <motion.p
          initial="initial"
          animate="animate"
          variants={TextEnterVariant}
          transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
          className="text-md font-medium"
        >
          A short skin quiz, a routine built around the results, and a SkinSpace
          that adapts as your skin changes
        </motion.p>
        <motion.div
          initial="initial"
          animate="animate"
          variants={TextEnterVariant}
          transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <ArrowLink
            href="initial-analysis"
            className="inline-flex  shrink-0
                 items-center gap-2 whitespace-nowrap 
                 rounded-full bg-charcoal px-6 py-3  font-medium text-white shadow-md"
          >
            Build my routine
          </ArrowLink>
          <ArrowLink
            href="#step-by-step"
            onClick={clearBrowserSection}
            className="rounded-full
                  hover:text-primary transition-colors duration-300
                  shadow-md text-secondary bg-white px-6 py-3 "
          >
            How it works
          </ArrowLink>
        </motion.div>
      </div>
    </div>
  );
}

const TextEnterVariant = {
  initial: { opacity: 0, filter: "blur(12px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
};
