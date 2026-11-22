"use client";
import {motion, AnimatePresence} from "motion/react";
import {MessageCircleMoreIcon, LoaderCircle} from "lucide-react"
import { useInitialAnalysis } from "@/lib/hooks/useInitialAnalysis";
import { useSkinProfile } from "./SkinProfileContext";

export function AdditionalDetails() {

    const analysis = useInitialAnalysis()
    const {skinProfile, setFeature} = useSkinProfile()
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
          className="w-full text-xs rounded-3xl border border-neutral-300 bg-white px-4 py-2 transition-colors focus-within:border-neutral-400 shadow-md duration-200"
        >
          <div className="flex items-center gap-0.5">
            <MessageCircleMoreIcon className="w-3 text-secondary h-3 shrink-0" />
            <span className="font-medium text-secondary text-xs">
              Anything else we should know?
            </span>
          </div>
          <textarea
            rows={1}
            value={skinProfile.other ?? ""}
            onChange={(e) => {
              setFeature("other", e.target.value);
            }}
            placeholder="Type here additional details about your skin or any allergies you might have"
            spellCheck={false}
            className="mt-3 block field-sizing-content overflow-y-auto max-h-48 min-h-12  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full  resize-none focus:outline-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
