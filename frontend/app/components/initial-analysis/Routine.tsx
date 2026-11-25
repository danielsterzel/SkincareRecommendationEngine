"use client";
import { motion } from "motion/react";
import { LoaderCircle } from "lucide-react";
import { RecommendedProductCard } from "./RecommendedProductCard";
import type { useInitialAnalysis } from "@/lib/hooks/useInitialAnalysis";

type InitialAnalysis = ReturnType<typeof useInitialAnalysis>;

// TEMP: raw view of the analysis stream and product results, style later
export function Routine({ analysis }: { analysis: InitialAnalysis }) {
  if (analysis.isError) {
    return (
      <p className="text-sm text-secondary">
        We couldn&apos;t build your routine. Please try again.
      </p>
    );
  }

  if (analysis.isSuccess) {
    return (
      <div className="w-full flex-1 min-h-0 grid grid-cols-[220px_1fr] gap-6">
        {/* TODO: recommended tips */}
        <aside className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">Recommended tips</h3>
          <div className="flex-1 rounded-2xl border-[0.5px] border-dashed border-neutral-300 bg-stone-50 flex items-center justify-center p-4 text-center text-xs text-secondary">
            Tips will appear here
          </div>
        </aside>

        <section className="min-h-0 overflow-y-auto flex flex-col gap-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <h3 className="text-xl font-semibold">Your recommended products</h3>
          {analysis.data.length === 0 ? (
            <p className="text-sm text-secondary">
              No matching products found.
            </p>
          ) : (
            analysis.data.map((product, index) => (
              <RecommendedProductCard
                key={`${product.brand}-${product.name}-${index}`}
                product={product}
                rank={index + 1}
              />
            ))
          )}
        </section>
      </div>
    );
  }

  // Pending: show each status message from the stream as it arrives
  return (
    <div className="w-full flex items-center justify-center gap-3">
      <LoaderCircle className="size-5 animate-spin text-primary" />
      <motion.p
        key={analysis.streamMessage}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-secondary"
      >
        {analysis.streamMessage || "Starting analysis..."}
      </motion.p>
    </div>
  );
}
