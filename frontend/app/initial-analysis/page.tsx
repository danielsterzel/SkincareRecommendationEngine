"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { SkinProblemMock } from "@/lib/initial-analysis/analysis-types";
import { Skin } from "@/lib/initial-analysis/analysis-types";
import {
  Product,
  UserSkinInformationInput,
} from "@/lib/initial-analysis/analysis-schemas";
import { streamAnalysis } from "@/lib/initial-analysis/analysis-api";
import { AnalysisHeading } from "../components/initial-analysis/AnalysisHeading";
import { SkinConcerns } from "../components/initial-analysis/SkinConcerns";
import { SkinType } from "../components/initial-analysis/SkinType";
import { Aurelia } from "../Aurelia";
import { Card } from "../base-components/Card";
import { SkinProfileCard } from "../components/initial-analysis/SkinProfileCard";
import type { SkinProfile } from "@/lib/initial-analysis/analysis-types";
import { useSkinProfile } from "../components/initial-analysis/SkinProfileContext";
import { AdditionalDetails } from "../components/initial-analysis/AdditionalDetails";
import { cn } from "@/lib/cn";
import {
  ANALYSIS_STEPS,
  AnalysisNavigation,
  getStepIndex,
  type AnalysisStep,
} from "@/lib/initial-analysis/analysis-steps";

const stepVariants = {
  enter: (direction: 1 | -1) => ({ opacity: 0, x: direction * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: 1 | -1) => ({ opacity: 0, x: direction * -24 }),
};

export default function InitialAnalysis() {
  const [showBeginOverlay, setShowBeginOverlay] = useState(true);
  const [choosenSkinType, setChoosenSkinType] = useState<Skin | null>(null);
  const [concerns, setConcerns] = useState<SkinProblemMock[]>([]);
  const [userChatInput, setUserChatInput] = useState("");
  const [fetchedProductList, setFetchedProductList] = useState<Product[]>();
  const [streamMessage, setStreamMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<AnalysisStep>("skin-concerns");
  const { previous: previousStep, next: nextStep } =
    AnalysisNavigation[currentStep];
  const continueBlocked =
    currentStep === "skin-concerns" && concerns.length === 0;
  const [direction, setDirection] = useState<1 | -1>(1);
  const goToStep = (step: AnalysisStep, dir: 1 | -1) => {
    setDirection(dir);
    setCurrentStep(step);
  };
  const {
    skinProfile,
    toggleFeature,
    setFeature,
    resetProfile,
  } = useSkinProfile();
  const updateConcerns = (concern: SkinProblemMock) => {
    setConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((item) => item !== concern)
        : [...prev, concern],
    );
  };
  return (
    <ProtectedRoute>
      <AnimatePresence mode="wait">
        {showBeginOverlay ? (
          <BeginOverlay closeOverlay={() => setShowBeginOverlay(false)} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: "easeInOut",
            }}
            key="analysis"
            className="relative min-h-screen flex flex-col items-center justify-center"
          >
            <Card
              className="w-full max-w-6xl bg-white  
            rounded-[32px] overflow-hidden"
            >
              <Header />
              <div className="grid grid-cols-2">
                <div className="min-w-0 w-full h-[560px] px-10 pt-8 pb-6 flex flex-col">
                  <AnalysisHeading
                    step={getStepIndex(currentStep) + 1}
                    totalSteps={ANALYSIS_STEPS.length}
                  />
                  <AnimatePresence
                    mode="wait"
                    custom={direction}
                    initial={false}
                  >
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full flex-1 flex flex-col justify-center gap-6 py-8"
                    >
                      {currentStep === "skin-concerns" && (
                        <SkinConcerns
                          concerns={concerns}
                          updateConcerns={updateConcerns}
                        />
                      )}
                      {currentStep === "skin-type" && (
                        <SkinType
                          choosenSkinType={choosenSkinType}
                          setChoosenSkinType={setChoosenSkinType}
                        />
                      )}
                      {currentStep === "additional-details" && (
                        <AdditionalDetails />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* {!initialAnalysisMutation.isPending &&
                    !initialAnalysisMutation.isSuccess && (
                      <button
                        onClick={() => {
                          setStreamMessage("");

                          initialAnalysisMutation.mutate({
                            concerns,
                            skinType: choosenSkinType,
                            additional_detail: userChatInput,
                          });
                        }}
                        className="mt-4 text-lg cursor-pointer transition-transform duration-200 rounded-2xl hover:scale-[1.02] px-4 py-1.5 bg-primary text-white"
                      >
                        Send
                      </button>
                    )} */}
                  <div className="w-full mt-auto pt-6  flex items-center justify-between">
                    <button
                      type="button"
                      disabled={!previousStep}
                      aria-hidden={!previousStep}
                      onClick={() => previousStep && goToStep(previousStep, -1)}
                      className={cn(
                        "cursor-pointer flex h-11 text-secondary items-center text-xs gap-2 font-medium transition-colors hover:text-primary",
                        !previousStep && "invisible",
                      )}
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>

                    <div className="flex items-center gap-4">
                      <AnimatePresence>
                        {continueBlocked && (
                          <motion.span
                            initial={{ opacity: 0, x: 6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 6 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="text-xs text-secondary"
                          >
                            Select at least one concern
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <button
                        type="button"
                        disabled={!nextStep || continueBlocked}
                        aria-hidden={!nextStep}
                        onClick={() => nextStep && goToStep(nextStep, 1)}
                        className={cn(
                          "cursor-pointer flex h-11 items-center gap-2 text-primary text-xs font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed",
                          !nextStep && "invisible",
                        )}
                      >
                        Continue
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mx-auto w-full max-w-6xl p-6">
                  <SkinProfileCard
                    currentStep={currentStep}
                    hasConcerns={concerns.length > 0}
                  />
                </div>

                <div />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <SoftGlowBg />
    </ProtectedRoute>
  );
}

function BeginOverlay({ closeOverlay }: { closeOverlay: () => void }) {
  useEffect(() => {
    const overlayTimeout = setTimeout(() => {
      closeOverlay();
    }, 3_000);

    return () => clearTimeout(overlayTimeout);
  }, []);
  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{
        duration: 0.35,
        ease: "easeInOut",
      }}
      className="absolute inset-0 w-full min-h-screen backdrop-blur-lg"
    >
      <div className="grid grid-cols-2">
        <div className="w-full min-h-screen flex items-center justify-center gap-3">
          <h3 className="text-2xl tracking-tight">
            Before we begin we need to learn a few things first
            <span className="w-4 inline-block  text-primary animated-dots" />
          </h3>
        </div>
      </div>
      <div></div>
    </motion.div>
  );
}

function SoftGlowBg() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
      radial-gradient(
        ellipse at 15% 10%,
        rgba(100, 150, 255, 0.12),
        transparent 55%
      ),
      radial-gradient(
        ellipse at 85% 80%,
        rgba(200, 180, 140, 0.10),
        transparent 55%
      ),
      radial-gradient(
        rgba(0, 0, 0, 0.04) 0.6px,
        transparent 0.6px
      )
    `,
        backgroundSize: "auto, auto, 20px 20px",
      }}
    />
  );
}

function Header() {
  return (
    <div className="w-full">
      <div className="px-10 py-2 w-full flex justify-between">
        <Aurelia className="text-lg tracking-widest" />
        <div className="flex items-center"></div>
      </div>
      <div className="bg-neutral-500 h-[0.5px] w-full" />
    </div>
  );
}
