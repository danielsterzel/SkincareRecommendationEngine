"use client";
import { motion } from "motion/react";
import { Droplets, Sun, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type SkinInsight = {
  icon: LucideIcon;
  text: string;
};

const INSIGHTS: SkinInsight[] = [
  { icon: Droplets, text: "Your skin looks well hydrated" },
  { icon: TrendingUp, text: "Texture improved since 2 weeks ago" },
  { icon: Sun, text: "Keep using SPF to protect your barrier" },
];

export function SkinPlaquet({
  className,
  badge,
}: {
  className?: string;
  badge?: React.ReactNode;
}) {
  return (
    <aside
      aria-labelledby="skinspace-preview-title"
      className={cn(
        "absolute inset-x-3 bottom-3 max-w-[240px] rounded-card bg-white/75 px-4 py-3 text-primary backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[280px] sm:max-w-none sm:px-5 sm:py-4",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2 text-[11px] leading-4">
        <div className="flex items-center gap-2">
          {badge}
          <p id="skinspace-preview-title" className="font-semibold">
            My SkinSpace
          </p>
        </div>
        <p className="text-charcoal/75">Sample data</p>
      </div>
      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          show: { transition: { delayChildren: 0.3, staggerChildren: 0.2 } },
        }}
        className="space-y-2.5"
      >
        {INSIGHTS.map(({ icon: Icon, text }) => (
          <motion.li
            key={text}
            variants={{
              hidden: { opacity: 0, y: 6 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-start gap-2.5 text-xs leading-4 sm:text-sm sm:leading-5"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white">
              <Icon className="h-3 w-3" strokeWidth={1.8} />
            </span>
            <span>{text}</span>
          </motion.li>
        ))}
      </motion.ul>
    </aside>
  );
}
