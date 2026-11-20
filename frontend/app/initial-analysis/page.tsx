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
    onError: (e) => toast.error("Something went wrong", {description: `${e.message}`}),
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
            <div className="flex flex-col items-left gap-8">
              <div
                className="flex items-center gap-6  py-2 w-64
         rounded-full"
              >
                <div className="p-2 border border-indigo-600 rounded-full">
                  <ScanFace
                    className="size-12 text-indigo-600"
                    strokeWidth={1.0}
                  />
                </div>
                <div className="flex flex-col items-left">
                  <p className="text-secondary uppercase tracking-widest text-xs">
                    Initial Steps
                  </p>
                  <h1 className="text-5xl tracking-tight">Analysis</h1>
                </div>
              </div>

              <div className="flex flex-col">
                <h2 className="tracking-tight text-2xl">Quick Look</h2>
                <p className="text-secondary text-sm">
                  Does any of this apply to you?
                </p>
              </div>

              <div className="w-full flex items-center gap-3">
                <div className="grid grid-rows-2 gap-2">
                  <div className="flex items-center gap-1">
                    <SkinProblemBadge
                      selected={concerns.includes("redness")}
                      problem="Redness"
                      skinTargets={["Skin", "Tone"]}
                      includeProblem={() => updateConcerns("redness")}
                    />
                    <SkinProblemBadge
                      selected={concerns.includes("dryness")}
                      problem="Dryness"
                      skinTargets={["Hydration"]}
                      includeProblem={() => updateConcerns("dryness")}
                    />
                    <SkinProblemBadge
                      selected={concerns.includes("acne")}
                      problem="Acne"
                      skinTargets={["Skin", "Texture"]}
                      includeProblem={() => updateConcerns("acne")}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <SkinProblemBadge
                      selected={concerns.includes("dark-spots")}
                      problem="Dark Spots"
                      skinTargets={["Skin", "Tone"]}
                      includeProblem={() => updateConcerns("dark-spots")}
                    />
                    <SkinProblemBadge
                      selected={concerns.includes("clogged-pores")}
                      problem="Clogged Pores"
                      skinTargets={["Skin", "Texture"]}
                      includeProblem={() => updateConcerns("clogged-pores")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-left gap-8">
                <div className="">
                  <h4 className="text-2xl tracking-tight">
                    Which Skin Type applies to you?
                  </h4>
                  <div className="text-secondary text-xs">
                    Not sure? You can always check this{" "}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.britishskinfoundation.org.uk/resources/identifying-your-skin-type-a-guide-by-dr-jonathan-kentley"
                      className="underline cursor-pointer"
                    >
                      source
                    </a>{" "}
                    or skip this
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs ">
                  <ChooseSkinType
                    type="Dry"
                    isChoosenAlready={choosenSkinType == "dry"}
                    chooseType={() => setChoosenSkinType("dry")}
                  />
                  <ChooseSkinType
                    type="Normal"
                    isChoosenAlready={choosenSkinType == "normal"}
                    chooseType={() => setChoosenSkinType("normal")}
                  />
                  <ChooseSkinType
                    type="Combination"
                    isChoosenAlready={choosenSkinType == "combination"}
                    chooseType={() => setChoosenSkinType("combination")}
                  />
                  <ChooseSkinType
                    type="Oily"
                    isChoosenAlready={choosenSkinType == "oily"}
                    chooseType={() => setChoosenSkinType("oily")}
                  />
                  <AnimatePresence>
                    {choosenSkinType !== null && (
                      <motion.button
                        key="clear-selection"
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                          filter: "blur(8px)",
                        }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.5, filter: "blur(8px)" }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        onClick={() => {
                          setChoosenSkinType(null);
                          toast.success("Selection Cleared");
                        }}
                        className="relative group cursor-pointer rounded-full h-5 w-5 bg-primary text-white flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                        <div className="text-xs text-primary border border-neutral-200 absolute bottom-full left-1/2 -translate-x-1/2  translate-y-1 whitespace-nowrap rounded-md mb-3 px-3 py-1.5 bg-white opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
                          Clear Selection
                        </div>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
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

function ChooseSkinType({
  type,
  isChoosenAlready,
  chooseType,
}: {
  type: string;
  isChoosenAlready: boolean;
  chooseType: () => void;
}) {
  return (
    <button
      disabled={isChoosenAlready}
      onClick={() => chooseType()}
      className={`cursor-pointer rounded-lg w-32 h-8 py-2
        transition-colors duration-300 
         uppercase text-secondary 
        ${isChoosenAlready ? "bg-primary text-white " : "bg-transparent"}
        text-center border-[0.5px] border-neutral-400`}
    >
      {type}
    </button>
  );
}

function SkinProblemBadge({
  problem,
  skinTargets,
  includeProblem,
  selected,
}: {
  problem: string;
  skinTargets: string[];
  includeProblem: () => void;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={includeProblem}
      aria-pressed={selected}
      className={`py-2 w-36 shadow-sm border-[0.5px] border-neutral-400
      transition-colors duration-300 cursor-pointer rounded-full
      flex flex-col items-center justify-center
      ${
        selected
          ? "bg-charcoal text-white"
          : "bg-offwhite text-primary hover:bg-neutral-200/50"
      }
    `}
    >
      <h3 className="text-xs">{problem}</h3>
      <div className="flex items-center gap-[2px] tracking-widest text-secondary text-[10px]">
        {skinTargets.map((skinTargetPart, idx) => {
          if (idx === skinTargets.length - 1) {
            return <p key={idx}>{skinTargetPart}</p>;
          }
          return (
            <div key={idx} className="flex items-center gap-0.5">
              <p>{skinTargetPart}</p>
              <div className="w-[2px] h-[2px] rounded-full bg-neutral-500" />
            </div>
          );
        })}
      </div>
    </button>
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
