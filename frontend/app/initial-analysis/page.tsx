"use client";

import { ScanFace, X, LoaderCircle } from "lucide-react";
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

export default function InitialAnalysis() {
  const [showBeginOverlay, setShowBeginOverlay] = useState(true);
  const [choosenSkinType, setChoosenSkinType] = useState<Skin | null>(null);
  const [concerns, setConcerns] = useState<SkinProblemMock[]>([]);
  const [userChatInput, setUserChatInput] = useState("");
  const [fetchedProductList, setFetchedProductList] = useState<Product[]>();
  const [streamMessage, setStreamMessage] = useState("");

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
            <div className="flex flex-col items-center gap-8">
              <AnalysisHeading />
              <SkinConcerns
                concerns={concerns}
                updateConcerns={updateConcerns}
              />


              <SkinType
                choosenSkinType={choosenSkinType}
                setChoosenSkinType={setChoosenSkinType}
              />
              
              <AnimatePresence mode="wait">
                {initialAnalysisMutation.isPending ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="min-w-[800px] h-20 flex items-center justify-center gap-4"
                  >
                    <LoaderCircle className="size-5 animate-spin text-indigo-600" />

                    <motion.p
                      key={streamMessage}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-secondary"
                    >
                      {streamMessage || "Starting analysis..."}
                    </motion.p>
                  </motion.div>
                ) : initialAnalysisMutation.isSuccess ? (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[800px] flex flex-col gap-4"
                  >
                    <h3 className="text-xl tracking-tight">
                      Your recommended products
                    </h3>

                    {initialAnalysisMutation.data.length === 0 ? (
                      <p className="text-sm text-secondary">
                        No matching products found.
                      </p>
                    ) : (
                      initialAnalysisMutation.data.map((product, index) => (
                        <div
                          key={`${product.brand}-${product.name}-${index}`}
                          className="p-4 rounded-xl border border-neutral-200"
                        >
                          <p className="text-xs text-secondary">
                            {product.brand}
                          </p>
                          <h4>{product.name}</h4>
                          <p className="text-xs text-secondary">
                            WSM Score: {product.wsm_score.toFixed(3)}
                          </p>
                        </div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="textarea"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                  >
                    <textarea
                      value={userChatInput}
                      onChange={(e) => setUserChatInput(e.target.value)}
                      placeholder="Type here additional details about your skin..."
                      spellCheck={false}
                      className="shadow-xs min-w-[800px] h-16 border-[0.5px] border-neutral-400 py-[18px] rounded-full resize-none outline-none px-6"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!initialAnalysisMutation.isPending &&
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
              )}
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
