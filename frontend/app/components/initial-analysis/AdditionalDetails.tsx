"use client";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircleMoreIcon, LoaderCircle } from "lucide-react";
import { useInitialAnalysis } from "@/lib/hooks/useInitialAnalysis";
import { useSkinProfile } from "./SkinProfileContext";

export function AdditionalDetails() {
  const analysis = useInitialAnalysis();
  const { skinProfile, setFeature } = useSkinProfile();
  return (
    <AnimatePresence mode="wait">
      {analysis.isPending ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="w-full h-20 flex items-center justify-center gap-4"
        >
          <LoaderCircle className="size-5 animate-spin text-indigo-600" />

          <motion.p
            key={analysis.streamMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-secondary"
          >
            {analysis.streamMessage || "Starting analysis..."}
          </motion.p>
        </motion.div>
      ) : analysis.isSuccess ? (
        <motion.div
          key="products"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col gap-4"
        >
          <h3 className="text-xl tracking-tight">Your recommended products</h3>

          {analysis.data.length === 0 ? (
            <p className="text-sm text-secondary">
              No matching products found.
            </p>
          ) : (
            analysis.data.map((product, index) => (
              <div
                key={`${product.brand}-${product.name}-${index}`}
                className="p-4 rounded-xl border border-neutral-200"
              >
                <p className="text-xs text-secondary">{product.brand}</p>
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
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="tracking-tight text-xl font-semibold cursor-default">
              Anything else you'd like to share?
            </h2>
            <span className="text-secondary text-xs">This is Optional</span>
          </div>
          <div className="w-full text-xs rounded-3xl border-[0.5px] border-neutral-300 bg-white px-4 py-2 transition-colors focus-within:border-neutral-400 duration-200">
            <textarea
              rows={1}
              value={skinProfile.other ?? ""}
              onChange={(e) => {
                setFeature("other", e.target.value);
              }}
              placeholder="e.g. I'm allergic to fragrance and I use retinol at night"
              spellCheck={false}
              className="mt-3 block field-sizing-content overflow-y-auto max-h-24 min-h-12  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full  resize-none focus:outline-none"
            />
          </div>

          <div className="w-full mt-4">
            <h3 className="text-lg font-semibold">Our Summary</h3>
            <div className="w-full h-full min-h-[100px] flex flex-col gap-3 items-center justify-center">
              <MessageCircleMoreIcon
                className="w-7 h-7 text-secondary"
                strokeWidth={1.4}
              />
              <span className="text-secondary text-xs">
                Here will be our summary of all the details you have provided
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
