"use client";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/initial-analysis/analysis-schemas";

const RANK_COLORS = ["bg-amber-400", "bg-neutral-300", "bg-orange-300"];
const MAX_EXTRA_REASONS = 2;

export function RecommendedProductCard({
  product,
  rank,
}: {
  product: Product;
  rank: number;
}) {
  const match = Math.round(product.wsmScore * 100);
  const profileReasons = product.reasons.filter((r) => r.matchesProfile);
  const extraReasons = product.reasons
    .filter((r) => !r.matchesProfile)
    .slice(0, MAX_EXTRA_REASONS);

  return (
    <div className="relative flex flex-col gap-5 rounded-2xl border-[0.5px] border-neutral-300 bg-white p-6">
      {rank <= RANK_COLORS.length && (
        <span
          className={cn(
            "absolute right-6 top-0 flex h-10 w-7 justify-center pt-1.5 text-xs font-semibold text-primary [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]",
            RANK_COLORS[rank - 1],
          )}
        >
          {rank}
        </span>
      )}

      <div className="pr-10">
        <p className="text-xs text-secondary">{product.brand}</p>
        <h4 className="text-xl font-semibold capitalize">{product.name}</h4>
      </div>

      {product.reasons.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-secondary">Why it&apos;s picked for you</span>
          <div className="flex flex-wrap gap-1.5">
            {profileReasons.map((reason) => (
              <span
                key={reason.label}
                className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs capitalize text-white"
              >
                <Check className="size-3" />
                {reason.label}
              </span>
            ))}
            {extraReasons.map((reason) => (
              <span
                key={reason.label}
                className="rounded-full border-[0.5px] border-neutral-400 px-3 py-1 text-xs capitalize"
              >
                {reason.label}
              </span>
            ))}
          </div>
          {profileReasons.length > 0 && extraReasons.length > 0 && (
            <span className="text-[10px] text-neutral-400">
              Filled = matches your skin profile
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5 border-t-[0.5px] border-neutral-200 pt-4">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-secondary">Match for you</span>
          <span className="text-base font-semibold">{match}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${match}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        disabled
        className="flex h-8 w-fit items-center gap-1 rounded-full border-[0.5px] border-neutral-300 bg-white px-3 text-xs font-medium text-secondary disabled:cursor-not-allowed"
      >
        <Plus className="size-3" />
        Add to my skin space
      </button>
    </div>
  );
}
