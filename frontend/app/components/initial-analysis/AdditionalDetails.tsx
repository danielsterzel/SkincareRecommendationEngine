"use client";
import { ArrowUp } from "lucide-react";
import { useSkinProfile } from "./SkinProfileContext";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function AdditionalDetails({
  onSubmitSummary,
}: {
  onSubmitSummary: () => void;
}) {
  const [isMutliline, setIsMultiline] = useState(false);
  const { skinProfile, setFeature } = useSkinProfile();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="tracking-tight text-xl font-semibold cursor-default">
          Anything else you&apos;d like to share?
        </h2>
        <span className="text-secondary text-xs">This is Optional</span>
      </div>
      <div className="relative h-8">
        <div
          className={cn(
            "flex items-center gap-2 w-full absolute top-0 left-0 z-10 text-xs border-[0.5px] border-neutral-300 bg-white px-4 py-2 transition-colors focus-within:border-neutral-400 duration-200",
            isMutliline ? "rounded-3xl" : "rounded-full",
          )}
        >
          <textarea
            rows={1}
            value={skinProfile.other ?? ""}
            onChange={(e) => {
              setIsMultiline(e.target.scrollHeight > 24);
              setFeature("other", e.target.value);
            }}
            placeholder="e.g. I'm allergic to fragrance and I use retinol at night"
            spellCheck={false}
            className="block field-sizing-content overflow-y-auto max-h-18 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full  resize-none focus:outline-none"
          />
          <div className="self-end flex items-center justify-between">
            <button
              aria-label="Send Message"
              type="button"
              onClick={onSubmitSummary}
              className="cursor-pointer p-2 rounded-full bg-primary text-white"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
