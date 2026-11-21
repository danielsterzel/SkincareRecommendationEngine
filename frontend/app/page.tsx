"use client";
import Image from "next/image";
import { motion } from "motion/react";

import { Navbar } from "./Navbar";

import { StepByStep } from "./components/landing/StepByStep";
import { SkinPlaquet } from "./components/SkinPlaquet";
import { OverviewHook } from "./components/landing/OverviewHook";

export default function Page() {
  return (
    <>
      <div className="min-h-svh flex flex-col items-center px-4">
        <div className="w-full p-6">
          <Navbar />
        </div>

        <motion.section
          id="landing"
          className="flex w-full max-w-[900px] flex-col gap-2 overflow-visible"
        >
          <div className="relative h-[350px] overflow-hidden rounded-t-2xl">
            <Image
              src="/landing.jpg"
              alt="Aurelia landing"
              fill
              sizes="(min-width: 932px) 900px, 100vw"
              loading="eager"
              className="object-cover object-top"
            />
            <SkinPlaquet />
          </div>
          <OverviewHook />
        </motion.section>
      </div>
      <StepByStep />
    </>
  );
}
