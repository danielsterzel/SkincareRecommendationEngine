"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { Aurelia } from "./Aurelia";
export function Navbar() {
  return (
    <div className="text-secondary w-full flex flex-wrap items-center justify-between">
      <nav aria-label="Main navigation" className="w-full flex justify-between items-center">
        <Aurelia />
        <ul className="flex items-center gap-3 text-sm font-medium">
          <Link
            href=""
            className="rounded-full px-4 py-2 bg-white shadow-md hover:text-primary duration-300"
          >
            Philosophy
          </Link>
          <Link
            href="/ingredients"
            className="rounded-full px-4 py-2 bg-white shadow-md flex items-center gap-0.5 hover:text-primary duration-300"
          >
            Ingredients
          </Link>
        <Link href="/skin-space" className="text-sm rounded-full px-4 py-2 bg-charcoal text-white">My SkinSpace</Link>

        </ul>

      </nav>
      
    </div>
  );
}
