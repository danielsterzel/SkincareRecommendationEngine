"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

export function AnimatedCheck({
  checked,
  className,
  iconClassName,
}: {
  checked: boolean;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-3 h-3 shrink-0 rounded-full border transition-colors duration-300",
        checked ? "bg-primary border-primary" : "bg-white border-neutral-400",
        className,
      )}
    >
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("w-2 h-2 text-white", iconClassName)}
      >
        <motion.path
          d="M5 12l4 4L19 6"
          initial={false}
          animate={{
            pathLength: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  );
}

export function NoFillAnimatedCheck({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("w-3.5 h-3.5 shrink-0", className)}
    >
      <motion.path
        d="M5 12l4 4L19 6"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
      />
    </motion.svg>
  );
}
