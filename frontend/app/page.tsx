"use client";
import { Navbar } from "./Navbar";
import { Landing } from "./Landing";
import { ArrowUpRight, Layers, Leaf, Plus, Smile, User } from "lucide-react";
import { How } from "./How";
import { Purpose } from "./Purpose";
import { SectionSeparator } from "./SectionSeparator";
import type { LucideIcon } from "lucide-react/types";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IntroductionNode } from "./IntroductionNode";
import { SelectionNode } from "./SelectionNode";
import { RefinementNode } from "./RefinementNode";
import { Philosophy } from "./Philosophy";

const MAX_STEPS = 3;

enum StoryStep {
  INTRODUCTION = 1,
  SELECT = 2,
  REFINE = 3,
}

type StoryStepConfig = {
  component: React.ComponentType;
  title: string;
};

const INTRODUCTION_COMPONENT: Record<number, StoryStepConfig> = {
  [StoryStep.INTRODUCTION]: {
    component: IntroductionNode,
    title: "Introduction",
  },
  [StoryStep.SELECT]: {
    component: SelectionNode,
    title: "Selection",
  },
  [StoryStep.REFINE]: {
    component: RefinementNode,
    title: "Refinement",
  },
};

export default function Home() {
  const [introductionStep, setIntroductionStep] = useState(1);
  function parseStep(step: number) {
    return String(step).padStart(2, "0");
  }
  useEffect(() => {
    const storyIntervalSwitch = setInterval(() => {
      setIntroductionStep((prev) => {
        switch (prev) {
          case StoryStep.INTRODUCTION:
            return StoryStep.SELECT;

          case StoryStep.SELECT:
            return StoryStep.REFINE;

          case StoryStep.REFINE:
            return StoryStep.INTRODUCTION;

          default:
            return StoryStep.INTRODUCTION;
        }
      });
    }, 10_000);

    return () => clearInterval(storyIntervalSwitch);
  }, []);

  const { component: StoryComponent, title: StoryTitle } =
    INTRODUCTION_COMPONENT[introductionStep];

  return (
    <div className="mx-auto w-full max-w-[1440px] flex flex-col items-center">
      <div className="w-full min-h-[min(100svh,820px)] flex flex-col mb-12 lg:mb-16">
        <Navbar />

        <div className="flex-1 grid grid-cols-1 gap-8 px-6 pt-6 pb-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,40%)] lg:gap-10 lg:pl-0 lg:pr-12 xl:gap-16">
          <main className="min-w-0 flex flex-col gap-4">
            <Landing />
          </main>

          <aside className="w-full min-w-0 max-w-[560px] justify-self-center self-center">
            <div className="@container flex flex-col gap-4 rounded-lg border border-charcoal bg-white p-4 shadow-lg sm:pt-6 lg:-ml-12">
              <div className="contents lg:relative lg:block">
                <div className="relative mx-auto aspect-[4/3] max-h-[28svh] w-full max-w-[500px] overflow-hidden rounded-lg lg:max-h-[max(9rem,calc(100svh-33rem))] xl:max-h-[max(9rem,calc(100svh-25rem))]">
                  <img
                    src="/landing2.jpg"
                    alt="Beauty editorial portrait"
                    className="h-full w-full object-cover object-center"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[35%] bg-linear-to-t from-black/20 to-transparent"
                  />
                  <SkinAnnotations />
                  <GlossAdnotation />
                  <p className="absolute top-4 left-4 select-none text-xs tracking-widest text-white">
                    FIG. 01 / AURELIA
                  </p>
                  <Plus
                    className="absolute top-4 right-4 size-6 text-white"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                  <p className="absolute right-3 bottom-3 select-none text-[8px] tracking-widest text-white uppercase sm:text-[10px]">
                    Illustrative skin profile / 001
                  </p>
                </div>
                <div className="order-last flex flex-wrap gap-2 lg:absolute lg:top-1/2 lg:-left-12 lg:z-20 lg:-translate-y-1/2 lg:flex-col lg:gap-3 xl:[@media(min-height:760px)]:gap-8">
                  <SkinAnalysisCard
                    icon={User}
                    heading="skin profile"
                    text="Combination · Sensitive"
                  />
                  <SkinAnalysisCard
                    icon={Leaf}
                    heading="Ingredient match"
                    text="Peptides · Azelaic acid · Retinoids"
                  />
                  <SkinAnalysisCard
                    icon={Layers}
                    heading="routine balance"
                    text="Cleanse · Treat · Hydrate · Protect"
                    translate={true}
                  />
                </div>
              </div>
              <div className="h-[15.5rem] @min-[24rem]:h-[12.5rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={introductionStep}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex h-full flex-col gap-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-secondary uppercase">
                        {StoryTitle}
                      </p>
                      <p className="uppercase tracking-widest text-secondary">
                        {parseStep(introductionStep)} / 0{MAX_STEPS}
                      </p>
                    </div>
                    <div className="flex w-full shrink-0 gap-2" aria-hidden="true">
                      {Array.from({ length: MAX_STEPS }, (_, idx) => (
                        <div
                          key={idx}
                          className={
                            "h-px flex-1 rounded-full " +
                            (introductionStep === idx + 1
                              ? "bg-charcoal"
                              : "bg-tertiary")
                          }
                        />
                      ))}
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                      <StoryComponent />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* <Philosophy/> */}
      {/* <SectionSeparator text="Aurelia - the process" />
      <section id="how-it-works">
        <How />
      </section>

      <SectionSeparator text="What we strive for" />

      <section id="our-purpose">
        <Purpose />
      </section> */}
    </div>
  );
}

export function SkinAnalysisCard({
  icon,
  heading,
  text,
  translate = false,
}: Readonly<{
  icon: LucideIcon;
  heading: string;
  text: string;
  translate?: boolean;
}>) {
  const Icon = icon;

  return (
    <div
      className={`${translate ? "lg:-translate-x-4" : ""} flex items-center justify-between rounded-2xl ring-1 ring-inset ring-white/15
   gap-2 text-white px-2 py-1 w-full sm:w-56 min-h-12 lg:min-h-16 lg:[@media(max-height:740px)]:min-h-11
   hover:scale-[1.02] transition-[transform,box-shadow] duration-300 cursor-default
   hover:ring-white/30
   bg-charcoal/80 backdrop-blur-md shadow-md shadow-charcoal/10`}
    >
      <Icon className="w-4 h-4 shrink-0 text-ice" />
      <div className="flex flex-col gap-0">
        <h4 className="text-xs tracking-widest uppercase">{heading}</h4>
        <p className="text-[8px] text-white/75">{text}</p>
      </div>
      <ArrowUpRight className="w-3 h-3 shrink-0 text-ice" />
    </div>
  );
}

function SkinAnnotations() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none text-white">
      <div className="absolute inset-0 translate-x-[8px] -translate-y-[8px]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
          className="absolute inset-0 size-full stroke-white/70"
        ></svg>
      </div>
    </div>
  );
}

function GlossAdnotation() {
  return (
    <div className="pointer-events-none absolute top-[68%] left-[54%] z-10 hidden size-6 -translate-x-6 items-center justify-center rounded-full border border-white sm:flex">
      <div className="absolute right-full h-px bottom-1/2 translate-x-3 translate-y-6.5 w-10 bg-white/80 rotate-305" />

      <div className="absolute left-0 top-1/2 -translate-x-[35px] translate-y-[41px] h-px w-4 bg-white/80" />

      <div className="absolute w-24 flex flex-col gap-0.5 left-0 top-1/2 -translate-x-[80px] translate-y-[33px] tracking-wide uppercase text-xs text-white ">
        <span className="font-medium">Gloss</span>
        <span className="text-[8px] text-stone-300">A glassy shine</span>
      </div>
      <div className="self-center size-3 border border-white rounded-full" />
    </div>
  );
}
