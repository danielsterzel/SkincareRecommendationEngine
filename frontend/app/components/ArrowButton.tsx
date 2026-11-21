"use client";

import Link from "next/link";
import { motion } from "motion/react";

const MotionLink = motion.create(Link);

export function ArrowButton({
  href,
  children,
  className = "",
  onClick
}: {
  href: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  className?: string;
}) {
  return (
    <MotionLink
      href={href}
      onClick={onClick}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <span>{children}</span>

      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <motion.path
          d="M14 8H2"
          variants={{
            rest: { pathLength: 0, opacity: 0 },
            hover: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <path d="M9 3L14 8L9 13" />
      </svg>
    </MotionLink>
  );
}
