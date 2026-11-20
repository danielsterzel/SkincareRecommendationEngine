"use client";
import {
  LucideGraphHub,
  Repeat,
  ShieldCheck,
  CalendarDaysIcon,
  Check,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AboutYouCard } from "./philosophy-components/AboutYouCard";
import { ProductSelectionCard } from "./philosophy-components/ProductSelectionCard";
import { EnjoyCard } from "./philosophy-components/EnjoyCard";

type PhilosophySections = "approach" | "personal" | "guidance";

export function Philosophy() {
  const [activeSection, setActiveSection] =
    useState<PhilosophySections>("approach");

  return (
    <div className="flex flex-col bg-olive-100 border-[0.5px] border-olive-300 rounded-2xl max-w-[1200px] w-full min-h-screen">
      <div className="grid grid-cols-3 gap-1 rounded-2xl p-1 bg-olive-100 max-h-[120px]">
        <SectionSwitchButton
          ariaLabel="Our Approach"
          disabled={activeSection === "approach"}
          onSwitch={() => setActiveSection("approach")}
        >
          <div className="flex items-center justify-center gap-3">
            <div
              className="size-1 rounded-full 
            bg-cyan-400"
            />
            <span>Our Approach</span>
          </div>
        </SectionSwitchButton>
        <SectionSwitchButton
          ariaLabel="Skincare is Personal"
          disabled={activeSection === "personal"}
          onSwitch={() => setActiveSection("personal")}
        >
          <div className="flex items-center justify-center gap-3">
            <div
              className="size-1 rounded-full 
            bg-rose-500 "
            />
            <span>Skincare is Personal</span>
          </div>
        </SectionSwitchButton>
        <SectionSwitchButton
          ariaLabel="Guida"
          disabled={activeSection === "guidance"}
          onSwitch={() => setActiveSection("guidance")}
        >
          <div className="flex items-center justify-center gap-3">
            <div
              className="size-1 rounded-full 
            bg-emerald-500"
            />
            <p>Guidance not diagnosis</p>
          </div>
        </SectionSwitchButton>
      </div>

      <div className="relative flex-1  ">
        <div
          className="w-full absolute inset-0 bg-olive-50
        border-[0.5px] z-10 rounded-2xl border-olive-300"
        >
          <AnimatePresence>
            {activeSection === "approach" && <ApproachSection />}
            {activeSection === "personal" && <PersonalSection />}
            {activeSection === "guidance" && <GuidanceSection />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ApproachSection() {
  const [highlightedCard, setHighlightedCard] = useState("");
  return (
    <AnimatedSection>
      <div className="p-3 flex flex-col">
        <div className="flex flex-col gap-1 w-full items-center justify-center">
          <h2 className="text-3xl tracking-tighter">Making skincare simpler</h2>
          <p className="max-w-lg text-secondary text-sm text-center ">
            Life is complicated as it is already. Aurelia is here to make your
            skincare effective, easy and simple
          </p>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <div className="border-[0.5px] border-olive-300 bg-white w-[400px] h-[500px] rounded-2xl scale-[0.90] p-6">
            <div className="select-none relative w-full h-full object-cover overflow-hidden">
              <AboutYouCard />
            </div>
          </div>
          <ProductSelectionCard />
          <EnjoyCard />
        </div>
      </div>
    </AnimatedSection>
  );
}

const skinProgress = [
  {
    day: "21",
    heading: "Big difference",
    comments: [
      "Incredible skin tone",
      "perfect hydration",
      "skin clear as day!",
    ],
  },
  {
    day: "7",
    heading: "Small steps",
    comments: ["A little redness", "good skin tone", "glossy skin c:"],
  },
  {
    day: "7",
    heading: "A little help",
    comments: [
      "Hyaluronic serum",
      "To hydrate and give your skin that shiny look",
      "Use sunscreen and refrain from retinols, niacynamides etc. to help with redness",
    ],
  },
];
function PersonalSection() {
  return (
    <AnimatedSection>
      <div className="flex flex-col p-3">
        <div className="mt-8 grid grid-cols-[400px_1fr] gap-12 items-start">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.7,
            }}
            className="max-h-[400px] mt-4 "
          >
            <img src="sillouette.jpg" className="rounded-2xl object-cover" />
          </motion.div>
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.35, delay: 1.5 }}
            className="flex flex-col gap-2 justify-center items-start"
          >
            <h3 className="text-4xl tracking-tighter">For every skin</h3>
            <p className=" max-w-xl text-secondary text-md">
              To provide you with the best possible skincare routine including
              your personal history, your dermatologist advice and your
              preferences
            </p>
            <div className="grid grid-cols-3 gap-4 w-full mt-6">
              {["skincare-1.jpg", "skincare-2.jpg", "serum.jpg"].map(
                (src, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div
                      className="flex items-center gap-1 bg-amber-50 w-fit 
                    text-amber-800
                     rounded-full px-2 py-1 "
                    >
                      <CalendarDaysIcon className="size-4" />
                      <p
                        className="
                      uppercase tracking-widest text-xs "
                      >
                        Day: {skinProgress[idx].day}{" "}
                      </p>
                    </div>

                    <div
                      key={src}
                      className="aspect-square min-w-0 overflow-hidden rounded-2xl "
                    >
                      <img
                        src={src}
                        alt="Skincare"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                  <em className="text-xl">{skinProgress[idx].heading}</em>
                      
                      <ul className="flex flex-col gap-2">
                        {skinProgress[idx].comments.map((comment) => (
                          <li key={comment} className="text-xs flex text-secondary
                           gap-2 items-center">
                            <Check className="size-3 text-secondary shrink-0"/>
                            {comment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}
function GuidanceSection() {
  return (
    <AnimatedSection>
      <div>Guidance section</div>
    </AnimatedSection>
  );
}

function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(8px)", y: 12 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="absolute inset-0 flex flex-col gap-1"
    >
      {children}
    </motion.section>
  );
}

type SectionSwitchProps = {
  children: React.ReactNode;
  ariaLabel: string;
  disabled: boolean;
  onSwitch: () => void;
};

function SectionSwitchButton({
  children,
  ariaLabel,
  disabled,
  onSwitch,
}: SectionSwitchProps) {
  return (
    <motion.button
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onSwitch}
      type="button"
      className={`
        hover:bg-olive-200/60
        transition-colors
         duration-200
        relative isolate overflow-hidden
        w-full whitespace-nowrap
         text-md  cursor-pointer rounded-xl px-2 py-3`}
    >
      <AnimatePresence>
        {disabled && (
          <motion.span
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 1 }}
            exit={{ scale: 0.75, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0
            w-full
                rounded-xl bg-white border-[0.5px] border-olive-300"
          ></motion.span>
        )}
      </AnimatePresence>
      <span
        className={`relative z-10 
            tracking-tight
            ${disabled ? "text-primary" : "text-secondary"}
      `}
      >
        {children}
      </span>
    </motion.button>
  );
}
