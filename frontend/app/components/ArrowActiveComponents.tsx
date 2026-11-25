"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/cn";
const MotionLink = motion.create(Link);

const variantContract = {
  rest: { pathLength: 0, opacity: 0 },
  hover: { pathLength: 1, opacity: 1 },
};

function DrawArrow() {
  return (
    <>
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
          variants={variantContract}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <path d="M9 3L14 8L9 13" />
      </svg>
    </>
  );
}

type ArrowButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: React.ReactNode;
};

export function ArrowButton({
  children,
  className,
  ...props
}: ArrowButtonProps) {
  return (
    <motion.button
      {...props}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={cn(
        "inline-flex items-center justify-center cursor-pointer gap-2",
        className,
      )}
    >
      <span>{children}</span>
      <DrawArrow />
    </motion.button>
  );
}


export function ArrowLink({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <MotionLink
      href={href}
      onClick={onClick}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span>{children}</span>
      <DrawArrow />
    </MotionLink>
  );
}
