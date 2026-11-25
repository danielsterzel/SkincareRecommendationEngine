"use client";
import {
  Ban,
  Check,
  FlaskConical,
  Search,
  ShieldAlert,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import {
  QuickSummary,
  UserSkinInformationInput,
} from "@/lib/initial-analysis/analysis-schemas";
import { Card } from "@/app/base-components/Card";
import { QuickSummarySkeleton } from "./QuickSummarySkeleton";

// Keys of QuickSummary whose value is a plain list of strings
type StringArrayKeys<T> = {
  [K in keyof T]: T[K] extends string[] ? K : never;
}[keyof T];

type ChipSection = {
  key: StringArrayKeys<QuickSummary>;
  category: string;
  title: string;
  icon: LucideIcon;
};

const CHIP_SECTIONS: ChipSection[] = [
  {
    key: "identifiedConcerns",
    category: "Concerns",
    title: "Found issues",
    icon: Search,
  },
  { key: "goals", category: "Goals", title: "What you want", icon: Trophy },
  { key: "avoid", category: "Avoid", title: "Keep away from", icon: Ban },
];

export function QuickSummaryStep({
  summary,
  confirmed,
  onConfirm,
  onEdit,
}: {
  summary: UseMutationResult<QuickSummary, Error, UserSkinInformationInput>;
  confirmed: boolean;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="w-full flex-1 min-h-0 flex flex-col gap-3">
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {summary.isError ? (
          <p className="text-sm text-secondary">
            Couldn&apos;t generate your summary. Go back and try again.
          </p>
        ) : summary.isSuccess ? (
          <Summary quickSummary={summary.data} />
        ) : (
          <QuickSummarySkeleton />
        )}
      </div>

      {summary.isSuccess && (
        <FeedbackBar
          confirmed={confirmed}
          onConfirm={onConfirm}
          onEdit={onEdit}
        />
      )}
    </div>
  );
}

function FeedbackBar({
  confirmed,
  onConfirm,
  onEdit,
}: {
  confirmed: boolean;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="shrink-0 flex items-center justify-between gap-3 rounded-full border-[0.5px] border-neutral-300 bg-white py-1.5 pl-4 pr-1.5">
      <span className="text-xs text-secondary">
        {confirmed
          ? "Great, you're ready to build your routine"
          : "Does this look right?"}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer h-8 px-3 rounded-full border-[0.5px] border-neutral-300 bg-white text-xs font-medium transition-colors hover:bg-black/5"
        >
          Not quite right
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmed}
          className="cursor-pointer h-8 px-3 rounded-full bg-primary text-white text-xs font-medium flex items-center gap-1 transition-opacity disabled:cursor-default"
        >
          {confirmed && <Check className="w-3 h-3" />}
          {confirmed ? "Confirmed" : "Looks good"}
        </button>
      </div>
    </div>
  );
}

function Summary({ quickSummary }: { quickSummary: QuickSummary }) {
  const routineItems = quickSummary.currentRoutine.map(routineLabel);

  return (
    <div className="flex flex-col gap-3">
      <span className="w-fit pb-0.5 text-secondary uppercase text-xs">
        Our Summary
      </span>
      <h3 className="text-xl font-semibold">Check if everything is in order</h3>
      {quickSummary.note && (
        <p className="text-sm text-secondary">{quickSummary.note}</p>
      )}

      {CHIP_SECTIONS.map(({ key, ...section }) => (
        <SummaryCard key={key} {...section} items={quickSummary[key]} />
      ))}
      <SummaryCard
        category="Sensitivity"
        title="How your skin reacts"
        icon={ShieldAlert}
        items={["INCLUDE SENSITIVITY"]}
      />
      <SummaryCard
        category="Routine"
        title="What you use now"
        icon={FlaskConical}
        items={routineItems}
      />
    </div>
  );
}

function SummaryCard({
  category,
  title,
  icon: Icon,
  items,
}: Omit<ChipSection, "key"> & { items: string[] }) {
  // Nothing to show, e.g. the user didn't mention anything to avoid
  if (items.length === 0) return null;

  return (
    <Card className="flex flex-col p-4 bg-stone-100">
      <div className="flex items-center justify-between">
        <Icon className="w-3 h-3" />
        <span className="text-xs text-secondary">{category}</span>
      </div>
      <div className="mt-2 flex flex-col items-start gap-1">
        <h4 className="font-semibold">{title}</h4>
        <div className="flex flex-wrap items-center gap-1">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full border-[0.5px] border-neutral-300 bg-white px-3 py-1 text-xs font-medium capitalize"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

// "Retinol · evening": most specific name we have, plus time of day when known
function routineLabel(item: QuickSummary["currentRoutine"][number]): string {
  const name =
    item.productName ?? item.activeIngredient ?? item.brand ?? "Product";
  return item.timeOfDay === "unknown" ? name : `${name} · ${item.timeOfDay}`;
}
