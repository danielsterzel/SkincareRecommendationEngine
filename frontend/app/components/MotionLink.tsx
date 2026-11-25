"use client";

import Link from "next/link";
import { motion } from "motion/react";

const MotionLinkComponent = motion.create(Link);

export function MotionLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <MotionLinkComponent
      href={href}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={`relative inline-block ${className}`}
    >
      <svg
        className="pointer-events-none absolute -inset-[0.5px] h-[calc(100%+1px)] w-[calc(100%+1px)] overflow-visible"
        fill="none"
      >
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          ry="50%"
          stroke="currentColor"
          strokeWidth={1}
          className="text-primary"
          variants={{
            rest: { pathLength: 0, pathOffset: 1, opacity: 0 },
            hover: { pathLength: 1, pathOffset: 0, opacity: 1 },
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </svg>
      <span className="relative">{children}</span>
    </MotionLinkComponent>
  );
}
