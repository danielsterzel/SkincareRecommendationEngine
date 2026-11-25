"use client";
import {
  Check,
  CircleCheck,
  Droplet,
  Moon,
  Sun,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  mockIngredients,
  type IngredientCategory,
  type MockIngredient,
} from "./mock-ingredients";

const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  retinoid: "bg-violet-100 text-violet-800",
  exfoliant: "bg-orange-100 text-orange-800",
  antioxidant: "bg-amber-100 text-amber-800",
  hydrator: "bg-sky-100 text-sky-800",
  brightener: "bg-indigo-100 text-indigo-800",
  soothing: "bg-emerald-100 text-emerald-800",
  peptide: "bg-pink-100 text-pink-800",
  emollient: "bg-stone-200 text-stone-800",
  "barrier-support": "bg-teal-100 text-teal-800",
};

const IRRITATION_LABELS = ["", "Low", "Medium", "High"];

const ingredientNames = new Map(mockIngredients.map((i) => [i.id, i.name]));

export function IngredientCard({
  ingredient,
  onClose,
  onSelect,
}: {
  ingredient: MockIngredient;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span
            className={cn(
              "w-fit rounded-full px-3 py-1 text-xs font-medium capitalize",
              CATEGORY_COLORS[ingredient.category],
            )}
          >
            {ingredient.category.replace("-", " ")}
          </span>
          <div>
            <h2 className="text-4xl font-semibold">{ingredient.name}</h2>
            <p className="mt-1 font-mono text-xs text-neutral-500">
              INCI · {ingredient.inci}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="cursor-pointer rounded-full p-2 text-neutral-500 transition-colors hover:bg-stone-100 hover:text-primary"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm font-medium">
        <div className="flex flex-col gap-1.5 rounded-xl bg-stone-100 px-3 py-2.5">
          <span className="text-xs font-normal text-neutral-500">When</span>
          <span className="flex items-center gap-1.5">
            {ingredient.timeOfDay !== "pm" && <Sun className="size-4" />}
            {ingredient.timeOfDay !== "am" && <Moon className="size-4" />}
            {ingredient.timeOfDay === "both"
              ? "AM / PM"
              : ingredient.timeOfDay.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-xl bg-stone-100 px-3 py-2.5">
          <span className="text-xs font-normal text-neutral-500">
            Irritation
          </span>
          <span className="flex items-center gap-2">
            <span className="flex gap-1" aria-hidden>
              {[1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className={cn(
                    "size-2 rounded-full",
                    dot <= ingredient.irritation
                      ? "bg-primary"
                      : "bg-neutral-300",
                  )}
                />
              ))}
            </span>
            {IRRITATION_LABELS[ingredient.irritation]}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-xl bg-stone-100 px-3 py-2.5">
          <span className="text-xs font-normal text-neutral-500">
            Skin types
          </span>
          <span className="flex items-center gap-1.5 capitalize">
            <Droplet className="size-4 shrink-0" />
            {ingredient.skinTypes.join(", ")}
          </span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-neutral-600">
        {ingredient.description}
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-neutral-500">Used for</span>
        <div className="flex flex-wrap gap-1.5">
          {ingredient.usedFor.map((concern) => (
            <span
              key={concern}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm capitalize text-white"
            >
              <Check className="size-3.5" />
              {concern}
            </span>
          ))}
        </div>
      </div>

      {ingredient.frequentlyUsedIn && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-neutral-500">Found in</span>
          <div className="flex flex-wrap gap-1.5">
            {ingredient.frequentlyUsedIn.map((product) => (
              <span
                key={product}
                className="rounded-full border-[0.5px] border-neutral-400 px-3 py-1 text-sm capitalize"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 border-t-[0.5px] border-neutral-300 pt-5 text-sm">
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 font-medium text-emerald-700">
            <CircleCheck className="size-4" />
            Pairs well with
          </span>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {ingredient.pairsWith.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                className="cursor-pointer underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-primary"
              >
                {ingredientNames.get(id) ?? id}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 font-medium text-amber-700">
            <TriangleAlert className="size-4" />
            Go easy with
          </span>
          {ingredient.avoidWith.length === 0 ? (
            <span className="text-neutral-500">Nothing notable</span>
          ) : (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {ingredient.avoidWith.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  className="cursor-pointer underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  {ingredientNames.get(id) ?? id}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
