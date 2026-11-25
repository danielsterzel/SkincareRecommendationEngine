"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { SkinPlaquet } from "../SkinPlaquet";
import { Card } from "@/app/base-components/Card";
import {
  Droplets,
  Layers,
  Sparkle,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { CosmeticCategory } from "@/lib/cosmetics/types";
import { Product } from "@/lib/initial-analysis/analysis-schemas";
import { cn } from "@/lib/cn";

const MotionCard = motion.create(Card);

export function HeroImage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 10%"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <MotionCard
      ref={ref}
      style={reduceMotion ? undefined : { scale }}
      className="flex w-full max-w-[1200px] origin-top flex-col gap-3 p-3"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr] lg:gap-12">
        <div className="mt-2 flex flex-col gap-3 p-2">
          <StepBadge num={1} />
          <h1 className="text-4xl font-semibold">How can we help you today?</h1>
          <UserMessage />
          <StoryPath />
        </div>

        <div>
          <div className="relative h-[65svh] w-full overflow-hidden rounded-[22px]">
            <Image
              src="/aurelia-landing.webp"
              alt="Aurelia landing"
              fill
              quality={90}
              sizes="(min-width: 1024px) 720px, 100vw"
              loading="eager"
              className="object-cover object-[center_35%]"
            />
            <SkinPlaquet badge={<StepBadge
                  num={2}
                  className="border-transparent bg-white font-medium text-primary"
                />} />
          </div>
          <div className="flex flex-col gap-3 px-2 pb-1">
            <div className="mt-4 flex items-center gap-2">
              <StepBadge num={3} />
              <motion.div
                animate={{ rotate: 180 }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                  repeatDelay: 4,
                  repeat: Infinity,
                }}
              >
                <Sparkle className="w-6 h-6" strokeWidth={1.6} />
              </motion.div>
              <span className="font-semibold text-lg">
                Products that suit you
              </span>
            </div>
            <ChoosenProductsForYou />
          </div>
        </div>
      </div>
    </MotionCard>
  );
}

type ChoosenProductHero = {
  product: Product;
  category: CosmeticCategory;
};

const PRODUCTS: ChoosenProductHero[] = [
  {
    product: {
      brand: "The Ordinary",
      name: "Multi-Peptide + HA Serum",
      reasons: [],
      wsmScore: 0.94,
    },
    category: "peptide",
  },
  {
    product: {
      brand: "CeraVe",
      name: "Moisturising Cream",
      reasons: [],
      wsmScore: 0.9,
    },
    category: "moisturizer",
  },
  {
    product: {
      brand: "La Roche-Posay",
      name: "Anthelios UVmune SPF",
      reasons: [],
      wsmScore: 0.87,
    },
    category: "spf",
  },
];

function ChoosenProductsForYou() {
  function toPercentStr(num: number): string {
    return `${Math.round(num * 100)}%`;
  }
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {PRODUCTS.map((p, idx) => (
        <div
          key={p.product.name}
          className="flex min-w-0 flex-col gap-1 rounded-2xl bg-stone-50 px-3 py-2"
        >
          <span className="text-[10px] uppercase text-neutral-500">
            {p.category}
          </span>
          <h3 className="truncate text-sm font-medium">{p.product.name}</h3>
          <span className="truncate text-xs text-neutral-500">
            {p.product.brand}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: p.product.wsmScore }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.15,
                  ease: "easeOut",
                }}
                className="h-full w-full origin-left rounded-full bg-charcoal"
              />
            </div>
            <span className="text-xs tabular-nums text-neutral-600">
              {toPercentStr(p.product.wsmScore)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepBadge({ num, className }: { num: number; className?: string }) {
  return (
    <span
      className={cn(
        "w-6 p-1 h-6 text-xs text-secondary flex justify-center items-center rounded-full border border-neutral-300",
        className,
      )}
    >
      {" "}
      {num}{" "}
    </span>
  );
}

type Concern = { icon: LucideIcon; label: string };
type Period = "3 weeks ago" | "Last week";
type PeriodSummary = { period: Period; message: string; concerns: Concern[] };

const PERIODS: PeriodSummary[] = [
  {
    period: "3 weeks ago",
    message:
      "My skin has been so dry lately. It feels tight and flaky after every wash, and makeup clings to the dry patches.",
    concerns: [
      { icon: Droplets, label: "Dryness" },
      { icon: Layers, label: "Flaky patches" },
    ],
  },
  {
    period: "Last week",
    message:
      "The dryness is so much better now! But I've started noticing fine lines around my eyes and I'd love to get ahead of them.",
    concerns: [
      { icon: Waves, label: "Fine lines" },
      { icon: Droplets, label: "Keep hydration up" },
    ],
  },
];

function UserMessage() {
  const [active, setActive] = useState<Period>("Last week");
  const activeSummary = PERIODS.find((p) => p.period === active)!;
  const words = activeSummary.message.split(" ");

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="relative grid grid-cols-2 rounded-full bg-stone-100 p-1">
        <motion.span
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm"
          animate={{ x: active === "Last week" ? "100%" : "0%" }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        />
        {PERIODS.map(({ period }) => (
          <button
            key={period}
            onClick={() => setActive(period)}
            className={cn(
              "relative cursor-pointer rounded-full px-3 py-1 text-sm",
              active === period ? "text-primary" : "text-neutral-500",
            )}
          >
            {period}
          </button>
        ))}
      </div>

      <motion.p
        key={`message-${active}`}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="rounded-2xl rounded-tl-md bg-stone-50 p-4 text-lg leading-relaxed"
      >
        {words.map((word, idx) => (
          <motion.span
            key={idx}
            variants={{
              hidden: { opacity: 0, filter: "blur(4px)" },
              show: { opacity: 1, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.3 }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.p>

      <motion.ul
        key={`concerns-${active}`}
        initial="hidden"
        animate="show"
        variants={{
          show: {
            transition: {
              delayChildren: words.length * 0.05,
              staggerChildren: 0.15,
            },
          },
        }}
        className="flex flex-wrap gap-2"
      >
        {activeSummary.concerns.map(({ icon: Icon, label }) => (
          <motion.li
            key={label}
            variants={{
              hidden: { opacity: 0, y: 6 },
              show: { opacity: 1, y: 0 },
            }}
            className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700"
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            {label}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

const STORY_STEPS = [
  "You tell us about your skin",
  "We read what it needs",
  "We match products that suit you",
];

function StoryPath() {
  return (
    <ol className="mt-auto hidden flex-col gap-3 pt-8 lg:flex">
      {STORY_STEPS.map((step, idx) => (
        <li
          key={step}
          className={
            idx === 0
              ? "flex items-center gap-3 text-sm text-primary"
              : "flex items-center gap-3 text-sm text-neutral-400"
          }
        >
          <StepBadge num={idx + 1} />
          {step}
        </li>
      ))}
    </ol>
  );
}
