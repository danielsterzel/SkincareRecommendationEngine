"use client";
import { motion } from "motion/react";

export function SkinPlaquet() {
  return (
    <aside
      aria-labelledby="skinspace-preview-title"
      className="absolute inset-x-3 bottom-3 max-w-[220px] rounded-card bg-white/75 px-4 py-3 text-primary backdrop-blur-xl sm:inset-x-auto sm:top-6 sm:bottom-auto sm:left-6 sm:w-[264px] sm:max-w-none sm:px-5 sm:py-4"
    >
      <div className="mb-2 flex items-center justify-between gap-2 text-[10px] leading-4 sm:mb-3 sm:text-[11px]">
        <p
          id="skinspace-preview-title"
          className="font-medium tracking-[0.2em] uppercase"
        >
          My SkinSpace
        </p>
        <p className="text-charcoal/75">Sample data</p>
      </div>
      <ul className="space-y-2 sm:space-y-2.5">
        <li>
          <div className="flex items-center justify-between gap-2 text-xs leading-4 sm:text-sm sm:leading-5">
            <span>Hydration</span>
            <span className="tabular-nums">
              94<span className="sr-only"> out of 100</span>
            </span>
          </div>
          <div aria-hidden="true" className="mt-1 h-1 rounded-full bg-black/15">
            <motion.div
              className="h-full w-[72%] origin-left rounded-full bg-primary motion-reduce:transform-none!"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.35, ease: "linear" }}
            />
          </div>
        </li>
        <li>
          <div className="flex items-center justify-between gap-2 text-xs leading-4 sm:text-sm sm:leading-5">
            <span>Barrier</span>
            <span className="tabular-nums">
              92<span className="sr-only"> out of 100</span>
            </span>
          </div>
          <div aria-hidden="true" className="mt-1 h-1 rounded-full bg-black/15">
            <motion.div
              className="h-full w-[92%] origin-left rounded-full bg-primary motion-reduce:transform-none!"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.35,
                delay: 0.1,
                ease: "linear",
              }}
            />
          </div>
        </li>
        <li>
          <div className="flex items-center justify-between gap-2 text-xs leading-4 sm:text-sm sm:leading-5">
            <span>Clarity</span>
            <span className="tabular-nums">
              81<span className="sr-only"> out of 100</span>
            </span>
          </div>
          <div aria-hidden="true" className="mt-1 h-1 rounded-full bg-black/15">
            <motion.div
              className="h-full w-[81%] origin-left rounded-full bg-primary motion-reduce:transform-none!"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.35,
                delay: 0.2,
                ease: "linear",
              }}
            />
          </div>
        </li>
      </ul>
    </aside>
  );
}
