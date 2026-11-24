"use client";
import { logoutRequest } from "@/lib/auth/auth-api";
import { useAuth } from "@/lib/auth/auth-storage";
import {
  Check,
  LoaderCircleIcon,
  LogOut,
  Moon,
  NotebookTextIcon,
  ScanFace,
  SlidersHorizontal,
  Sun,
  User,
  Plus,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Icon } from "@iconify-icon/react";
import {
  RoutineCosmetic,
  CosmeticCategory,
  SkinAilment,
} from "@/lib/cosmetics/types";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { ExpandableSection } from "../components/ExpandableSection";
import { MyDiary } from "./MyDiary";
import { MyNotes } from "./MyNotes";
import { InsightMock, LastInsights } from "./LastInsights";
const DAY_DIVISION = 6;

type AnalysisState = "uninitialized" | "initialized" | "finished";

export type NoteMock = {
  title: string;
  content: string;
};

const mockedInsights: InsightMock[] = [
  {
    solution: {
      heading: "Acne problem",
      description:
        "In order to help you with your acne problem we propose a peptide xyz. We would encourage to stay away from retinols as they are more potent and could damage your sensitive skin along with the second solution we proposed for you",
    },
    category: "acne",
    date: new Date(),
  },
  {
    solution: {
      heading: "Uneven Tone",
      description:
        "In order to improve your skin tone eveness we propose a light niacynamide with utmost 5% solution. Your skin is already sensitive and combined with peptides can introduce a redness problem so watch out and carefully monitor your skin",
    },
    category: "unevenTone",
    date: new Date(),
  },
];

export default function SkinSpace() {
  const [analysisPending, setAnalysisPending] =
    useState<AnalysisState>("uninitialized");
  const [notes, setNotes] = useState<NoteMock[]>([]);
  const [insights, setInights] = useState<InsightMock[]>(mockedInsights);
  const [showInsight, setShowInsight] = useState(true);
  const [showDiarySection, setShowDiarySection] = useState(true);
  const [showNotesSection, setShowNotesSection] = useState(true);
  // const [recentImage, setRecentImage] = useState() // to be filled

  // MOCK -> later use tanstack query and mutation.isPending
  useEffect(() => {
    if (analysisPending !== "initialized") return;
    const interval = setInterval(() => {
      setAnalysisPending("finished");
    }, 6_000);

    return () => clearInterval(interval);
  }, [analysisPending]);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <ProtectedRoute>
      <div className="w-full  px-6 py-6">
        <SkinSpaceMenu />
        <div className="grid grid-cols-[500px_1fr] gap-2">
          <CurrentRoutine />
          <div className="grid grid-cols-[1fr_1fr] items-center gap-2">
            <div>
              <div className="max-w-[400px] max-h-[400px]">
                <div className=""></div>

                <div
                  className="relative  py-32 px-16 
                border border-secondary rounded-2xl flex flex-col justify-center items-center"
                >
                  <div className="text-tertiary text-xs text-center">
                    <span
                      onClick={() => {
                        imageInputRef.current?.click();
                      }}
                      className="text-primary underline underline-offset-2 cursor-pointer"
                    >
                      Upload
                    </span>{" "}
                    or take a picture of your skin and learn how to improve
                    <input type="file" ref={imageInputRef} className="hidden" />
                  </div>
                  <button
                    onClick={() => {
                      setAnalysisPending("initialized");
                    }}
                    aria-label="Analyze my skin"
                    className="cursor-pointer 
                  absolute flex gap-1 items-center border border-secondary 
                  border-t-0 border-r-0 rounded-tl-[64px] rounded-bl-[64px]
                  rounded-tr-none rounded-br-none right-0 top-0 p-2"
                  >
                    <ScanFace className="size-6"></ScanFace>
                    <p className="text-sm">Analyze my skin</p>
                  </button>
                </div>
                <div className="flex justify-between mt-2 items-center">
                  <label className="tracking-widest uppercase text-tertiary text-xs">
                    Our analysis
                  </label>
                  <AnalysisPending state={analysisPending} />
                </div>
              </div>
            </div>
            <div className="flex flex-col  gap-6 w-full">
              <div className="flex flex-col self-start w-full">
                <div className="flex justify-between items-center w-full">
                  <h4 className="text-lg">Last Insights</h4>
                  <button
                    onClick={() => setShowInsight((prev) => !prev)}
                    className="cursor-pointer "
                  >
                    <ChevronDown
                      className={`size-4 transition-transform duration-300 ease-in-out
                      ${showInsight ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                </div>
                <ExpandableSection
                  component={<LastInsights insights={insights} />}
                  showState={showInsight}
                />
              </div>
              <div className="flex flex-col items-left gap-4">
                <div className="flex flex-col ">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg">My diary page</h2>
                    <button
                      onClick={() => setShowDiarySection((prev) => !prev)}
                      className="cursor-pointer"
                    >
                      <ChevronDown
                        className={`size-4 transition-transform duration-300 ease-in-out
                      ${showDiarySection ? "rotate-180" : "rotate-0"}`}
                      />
                    </button>
                  </div>
                  <ExpandableSection
                    showState={showDiarySection}
                    component={<MyDiary />}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <h3 className="text-md">My notes</h3>
                  <button
                    onClick={() => setShowNotesSection((prev) => !prev)}
                    className="cursor-pointer"
                  >
                    <ChevronDown
                      className={`size-4 transition-transform duration-300 ease-in-out
                      ${showNotesSection ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                </div>
                <ExpandableSection
                  showState={showNotesSection}
                  component={<MyNotes notes={notes} />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

const categoryToIconMapping: Record<CosmeticCategory, React.ReactNode> = {
  cleanser: (
    <Icon icon="fluent-emoji-high-contrast:lotion-bottle" className="" />
  ),
  moisturizer: <Icon icon="vadivam:tube-lotion" className="" />,
  peptide: <Icon icon="teenyicons:dropper-outline" className="" />,
  retinol: <Icon icon="iconoven:serum-dropper" className="" />,
  serum: <Icon icon="teenyicons:dropper-outline" className="" />,
  spf: <Icon icon="andrsrxn:tube-lotion" className="" />,
};

function AnalysisPending({ state }: { state: AnalysisState }) {
  return (
    <div className="flex gap-2 items-center text-sm text-secondary h-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex gap-1 items-center"
        >
          {state === "initialized" && (
            <>
              <span className="text-xs">Analizing...</span>
              <motion.div
                className="w-fit text-secondary"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                <LoaderCircleIcon className="size-4" />
              </motion.div>
            </>
          )}
          {state === "uninitialized" && (
            <span className="tracking-widest uppercase">Aurelia</span>
          )}
          {state === "finished" && (
            <span className="flex gap-1 items-center">
              Finished{" "}
              <div
                className="rounded-full 
            w-1 h-1 bg-emerald-500 animate-shimmer"
              />
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const myCurrentRoutine: RoutineCosmetic[] = [
  {
    brand: "CeraVe",
    product: "Cleanser",
    sizeMl: 1000,
    category: "cleanser",
    helpsWith: [{ category: "dirtiness", problem: "Dirty face" }],
    choosenFor: "Great cleansing qualities. Good feel on skin",
    applied: true,
  },
  {
    brand: "The Ordinary",
    product: "Hyaluronic Serum",
    sizeMl: 60,
    category: "serum",
    subCategory: "water-based",
    helpsWith: [{ category: "hydration", problem: "dryness" } as SkinAilment],
    choosenFor: "Great hydration effect",
    applied: true,
  },
  {
    brand: "Bioderma",
    product: "Atopic Intensive Baume",
    sizeMl: 500,
    category: "moisturizer",
    subCategory: "cream",
    helpsWith: [{ category: "hydration", problem: "dryness" } as SkinAilment],
    choosenFor: "Hydration and oclusiveness",
    applied: true,
  },
  {
    brand: "La Roche Posay",
    product: "Anthelios UVMune 50+ SPF",
    sizeMl: 50,
    category: "spf",
    subCategory: "cream",
    helpsWith: [
      { category: "sun-damage", problem: "protection" } as SkinAilment,
    ],
    choosenFor: "Great protection against the Sun",
    applied: false,
  },
];

function CurrentRoutine() {
  const [welcome] = useState(() => greeting());

  const barsToFill = fillDayProgression();

  return (
    <div>
      <h1 className="text-2xl">{welcome}</h1>
      <div
        className="flex  
        p-4
        flex-col gap-4 rounded-2xl max-w-[500px]"
      >
        <div className="flex flex-col">
          <p
            className="text-[10px] tracking-widest
        text-secondary
        uppercase"
          >
            daily ritual
          </p>
          <h1 className="text-xl ">Today&apos;s routine</h1>
        </div>

        <div className="max-w-md gap-4 flex justify-between">
          <div className="w-full flex gap-2 items-center">
            <Sun className="size-5 shrink-0 text-yellow-500" />
            {Array.from({ length: DAY_DIVISION }, (_, idx) => (
              <div
                key={idx}
                className={`h-px w-full ${idx < barsToFill ? "bg-charcoal" : "bg-tertiary"} `}
              ></div>
            ))}
          </div>
          <Moon className="size-5 shrink-0 text-taupe-700" />
        </div>
        <ul className="flex flex-col gap-2">
          {myCurrentRoutine.map((item) => (
            <CurrentRoutineItem
              cosmetic={item as RoutineCosmetic}
              key={item.product}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function CurrentRoutineItem({ cosmetic }: { cosmetic: RoutineCosmetic }) {
  const [applied, setApplied] = useState(cosmetic.applied);
  return (
    <li className="max-w-md grid grid-cols-[1fr_100px] gap-2 items-center bg-offwhite rounded-2xl px-4 py-2">
      <div className="flex flex-col gap-1 text-secondary items-left">
        <div className="flex items-center gap-2">
          <div className="">
            {applied ? (
              <Check className=" w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </div>
          <p className="text-[10px] tracking-widest uppercase">
            {cosmetic.category}
          </p>
          <div className="w-full h-px bg-tertiary" />
        </div>
        <div className="flex items-center">
          <div className="text-lg max-w-32 min-w-8">
            {categoryToIconMapping[cosmetic.category]}
          </div>
          <div>
            <h4 className="text-sm text-primary font-medium">
              {cosmetic.product}
            </h4>
            <p className="text-[10px]">{cosmetic.choosenFor}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button
          aria-label={`${applied ? "mark as not applied" : "mark as applied"}`}
          onClick={() => setApplied((prev) => !prev)}
          className={`rounded-full p-1 border cursor-pointer ${applied ? "bg-charcoal" : ""}`}
        ></button>
      </div>
    </li>
  );
}

function SkinSpaceMenu() {
  const [showLogout, setShowLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutFailed, setLogoutFailed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showLogout) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setShowLogout(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowLogout(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [showLogout]);

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutFailed(false);
    try {
      await logoutRequest();
      useAuth.getState().clearSession();
      window.location.replace("/login");
    } catch {
      setLogoutFailed(true);
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <div className="w-fit rounded-full p-1 border">
        <SlidersHorizontal strokeWidth={1.0} className="w-4 h-4" />
      </div>
      <div ref={menuRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-label="User menu"
          aria-expanded={showLogout}
          onClick={() => setShowLogout((open) => !open)}
          className="cursor-pointer rounded-full border p-1 transition-colors hover:bg-white"
        >
          <User className="size-4" strokeWidth={1.3} aria-hidden="true" />
        </button>
        {showLogout && (
          <div className="absolute top-full right-0 z-20 mt-2 w-40 rounded-xl border border-charcoal/10 bg-white p-1.5 shadow-lg">
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-charcoal transition-colors hover:bg-offwhite disabled:cursor-wait disabled:opacity-60"
            >
              <LogOut className="size-4 shrink-0" aria-hidden="true" />
              {isLoggingOut ? "Logging out…" : "Log out"}
            </button>
            {logoutFailed && (
              <p role="alert" className="px-3 py-2 text-xs text-red-700">
                Couldn’t log out. Try again.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function greeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return randomChoice(morningGreetings);
  if (hour >= 12 && hour < 18) return randomChoice(afternoonGreetings);
  return randomChoice(eveningGreetings);
}

function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const morningGreetings = [
  "Good morninnggggg",
  "Rise and shine beauty",
  "Helloooooo",
  "How did you sleep?",
];
const afternoonGreetings = [
  "How was your day?",
  "How is the weather?",
  "Hope you had a good day",
  "Tired after work?",
];

const eveningGreetings = [
  "What are we up to at this hour?",
  "Good evening",
  "Have you done your evening routine yet?",
  "One last look before sleep?",
];

function fillDayProgression(): number {
  const hour = new Date().getHours();
  const hourSpanPerBar = Math.floor(24 / DAY_DIVISION);

  const fillAmount = Math.floor(hour / hourSpanPerBar);
  return fillAmount;
}
