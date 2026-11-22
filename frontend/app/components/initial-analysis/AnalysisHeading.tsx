import { ScanFace } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function AnalysisHeading({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  return (
    <div className="flex flex-col items-start gap-3 py-2 rounded-full">
      <div className="flex items-center gap-4 y-2">
        <div className="p-3 bg-white border border-indigo-600 rounded-full">
          <ScanFace className="size-7 text-indigo-600" strokeWidth={1.3} />
        </div>
        <div className="w-full flex flex-col items-left">
          <p className="flex items-center gap-2 text-secondary uppercase tracking-[0.18rem] text-[10px]">
            Initial Analysis
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span className="inline-flex">
              Step&nbsp;
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="text-indigo-600 font-semibold"
                >
                  {step}
                </motion.span>
              </AnimatePresence>
              &nbsp;of {totalSteps}
            </span>
          </p>
          <h1 className="text-4xl -tracking-[0.06em] font-semibold">
            Let's look at your skin
          </h1>
        </div>
      </div>
    </div>
  );
}
