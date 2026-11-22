"use client";

import { ScanFace, X, LoaderCircle, MessageCircleMoreIcon } from "lucide-react";
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

export default function InitialAnalysis() {
  const [showBeginOverlay, setShowBeginOverlay] = useState(true);
  const [choosenSkinType, setChoosenSkinType] = useState<Skin | null>(null);
  const [concerns, setConcerns] = useState<SkinProblemMock[]>([]);
  const [userChatInput, setUserChatInput] = useState("");
  const [fetchedProductList, setFetchedProductList] = useState<Product[]>();
  const [streamMessage, setStreamMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<
    "skin-concerns" | "skin-type" | "additional-details"
  >("skin-concerns");
  const {
    skinProfile,
    toggleFeature: updateFeature,
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
  const initialAnalysisMutation = useMutation({
    mutationFn: async (input: UserSkinInformationInput) => {
      for await (const event of streamAnalysis(input)) {
        setStreamMessage(event.message);

        if (event.type === "completed") {
          return event.data;
        }
      }

      throw new Error("Analysis ended without completion");
    },

    onSuccess: () => toast.success("Successfully analyzed your skin"),
    onError: (e) =>
      toast.error("Something went wrong", { description: `${e.message}` }),
  });
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
                <AnimatePresence mode="wait">
                  <motion.div className="min-w-0 w-full px-10 py-8 flex flex-col items-start gap-6">
                    {currentStep === "skin-concerns" && (
                      <>
                        <AnalysisHeading />
                        <SkinConcerns
                          concerns={concerns}
                          updateConcerns={updateConcerns}
                        />
                      </>
                    )}
                    {currentStep === "skin-type" && (
                      <SkinType
                        choosenSkinType={choosenSkinType}
                        setChoosenSkinType={setChoosenSkinType}
                      />
                    )}

                    
                    {/* {!initialAnalysisMutation.isPending &&
                    !initialAnalysisMutation.isSuccess && (
                      <button
                        onClick={() => {
                          setStreamMessage("");

                          initialAnalysisMutation.mutate({
                            concerns: { concerns },
                            skinType: choosenSkinType,
                            additional_detail: userChatInput,
                          });
                        }}
                        className="mt-4 text-lg cursor-pointer transition-transform duration-200 rounded-2xl hover:scale-[1.02] px-4 py-1.5 bg-primary text-white"
                      >
                        Send
                      </button>
                    )} */}
                  </motion.div>
                </AnimatePresence>
                <div className="mx-auto w-full max-w-6xl p-6">
                  <SkinProfileCard />
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
