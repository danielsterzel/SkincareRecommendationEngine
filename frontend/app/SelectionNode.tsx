
"use client";

import { Icon } from "@iconify-icon/react";
import { motion } from "motion/react";

const products = [
  {
    brand: "The Ordinary",
    name: "Hyaluronic Serum",
    icon: "tabler:dropper",
    category: "SERUM",
  },
  {
    brand: "Bioderma",
    name: "Intensive Baume",
    icon: "tabler:bottle",
    category: "MOISTURIZER",
  },
  {
    brand: "La Roche-Posay",
    name: "Anthelios UVMune",
    icon: "tabler:sun-high",
    category: "PROTECTION",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.35,
      staggerChildren: 0.65,
    },
  },
};

const productVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function SelectionNode() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium tracking-tight text-charcoal">
          Cosmetics with intention.
        </h3>
        <p className="text-xs leading-relaxed text-secondary">
          Thoughtfully selected products, matched to your skin.
        </p>
      </div>

      <motion.ul
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid gap-2 @min-[24rem]:grid-cols-3"
      >
        {products.map((product) => (
          <motion.li
            key={product.name}
            variants={productVariants}
            className="flex min-w-0 items-center gap-2 rounded-xl border border-charcoal/10 bg-stone-50/60 px-2 py-2 @min-[24rem]:flex-col @min-[24rem]:gap-1.5 @min-[24rem]:text-center"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white text-charcoal ring-1 ring-charcoal/5">
              <Icon icon={product.icon} width={18} height={18} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1 @min-[24rem]:flex-none">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 @min-[24rem]:flex-col @min-[24rem]:items-center">
                <span className="text-xs font-semibold leading-snug text-charcoal">
                  {product.brand}
                </span>
                <span className="text-[11px] font-medium leading-snug tracking-wide text-secondary @min-[24rem]:-order-1">
                  {product.category}
                </span>
              </div>
              <p className="text-xs leading-snug text-secondary">
                {product.name}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
