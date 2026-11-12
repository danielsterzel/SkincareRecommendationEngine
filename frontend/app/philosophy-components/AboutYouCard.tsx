"use client";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export function AboutYouCard() {
  return (
    <div className="h-full w-full absolute inset-x-0 top-0 flex flex-col gap-3 p-4">
      <img
        src="white-background.jpg"
        className="absolute inset-0 object-cover w-full h-full rounded-2xl"
      />
      <div className="self-start max-w-[85%] rounded-2xl bg-white/85 backdrop-blur-sm px-4 py-3 text-xs text-primary shadow-sm">
        What would you like to improve today?
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="self-end mt-2 max-w-[80%] rounded-2xl border border-white/60 bg-white/25 backdrop-blur-md px-4 py-3  text-xs text-primary"
      >
        My skin feels a little bit dry ;(
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="self-start max-w-[90%] rounded-2xl bg-white/85 backdrop-blur-sm px-4 py-3 text-xs text-[#30251F] shadow-sm"
      >
        No worries we will find something that can help you with that
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 2.2 }}
        className="flex flex-wrap gap-2 self-start"
      >
        <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[10px] backdrop-blur-sm text-primary">
          Dryness
        </span>
        <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[10px] backdrop-blur-sm text-primary">
          Sensitivity
        </span>
      </motion.div>
      <div className="absolute bottom-3 left-4 rounded-3xl border border-white/80 bg-white/50 backdrop-blur-md p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-sm">About you</h3>
          <ArrowUpRight size={20} />
        </div>

        <p className="mt-2 text-xs text-neutral-500">
          Tell us about your skin, concerns and goals.
        </p>
      </div>
      Ś
    </div>
  );
}
