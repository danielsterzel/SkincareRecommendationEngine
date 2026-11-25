"use client";
import { motion } from "motion/react";

import { Navbar } from "./navbar";

import { HeroButtons } from "./components/landing/OverviewHook";
import { HeroImage } from "./components/landing/HeroImage";
import { Sparkle } from "lucide-react";
import { Philosophy } from "./Philosophy";
export default function Page() {
  return (
    <>
      <div className="min-h-svh flex flex-col items-center px-4">
        <div className="w-full p-6">
          <Navbar />
        </div>

        <motion.section
          id="landing"
          className="flex flex-col items-center justify-center w-full gap-10 py-8 md:grid-cols-[1fr_1.2fr] md:gap-16"
        >
          <div className="w-full flex flex-col my-18 gap-12 items-center justify-center p-4 rounded-full ">
            <span className="cursor-default font-medium bg-white px-4 py-2 border-[0.5px] border-neutral-300 text-neutral-600 text-sm shadow-md rounded-full">
              Welcome to Aurelia
            </span>
            <h1 className="text-6xl tracking-tight font-semibold">
              Skincare that reads your skin.
            </h1>

            <div className="w-full max-w-xl flex gap-12 items-center">
              <Sparkle className="w-4 h-4 text-netural-600" />
              <p className="text-neutral-600  text-lg max-w-md text-center">
                A quick and easy way to build your routine, find new products,
                or help you achieve your skin goals.
              </p>
              <Sparkle className="w-4 h-4 text-netural-600" />
            </div>

            <HeroButtons className="mt-2 justify-center" />
          </div>

          <HeroImage />
        </motion.section>
      </div>
    </>
  );
}
