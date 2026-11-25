"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type {
  SkinProfile,
  SkinFeature,
} from "@/lib/initial-analysis/analysis-types";


interface SkinProfileContextValue {
  skinProfile: Partial<SkinProfile>;
  toggleFeature: <K extends ScalarFeautre>(
    feature: K,
    asnwer: SkinProfile[K],
  ) => void;
  toggleArrayFeature: <K extends ArrayFeature>(
    feature: K,
    value: SkinProfile[K][number],
  ) => void;
  setFeature: <K extends ScalarFeautre>(
    feature: K,
    answer: SkinProfile[K],
  ) => void;
  clearFeature: (feature: SkinFeature) => void;
  resetProfile: () => void;
}
type ArrayFeature = {
  [K in SkinFeature]: SkinProfile[K] extends unknown[] ? K : never;
}[SkinFeature];
type ScalarFeautre = Exclude<SkinFeature, ArrayFeature>;

const SkinProfileContext = createContext<SkinProfileContextValue | null>(null);

export function SkinProfileProvider({ children }: { children: ReactNode }) {
  const [skinProfile, setSkinProfile] = useState<Partial<SkinProfile>>({});
  function toggleArrayFeature<K extends ArrayFeature>(
    feature: K,
    value: SkinProfile[K][number],
  ): void {
    setSkinProfile((prev) => {
      const current = (prev[feature] ?? []) as SkinProfile[K][number][];

      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [feature]: next };
    });
  }
  function toggleFeature<K extends ScalarFeautre>(
    feature: K,
    answer: SkinProfile[K],
  ): void {
    setSkinProfile((prev) => {
      if (prev[feature] === answer) {
        const { [feature]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [feature]: answer };
    });
  }

  // plain set (not toggle), for text inputs; empty text removes the key
  function setFeature<K extends ScalarFeautre>(
    feature: K,
    answer: SkinProfile[K],
  ): void {
    setSkinProfile((prev) => {
      if (typeof answer === "string" && answer.trim() === "") {
        const { [feature]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [feature]: answer };
    });
  }

  function clearFeature(feature: SkinFeature): void {
    setSkinProfile((prev) => {
      const { [feature]: _removed, ...rest } = prev;
      return rest;
    });
  }

  function resetProfile(): void {
    setSkinProfile({});
  }

  return (
    <SkinProfileContext.Provider
      value={{ skinProfile, toggleFeature: toggleFeature, toggleArrayFeature: toggleArrayFeature, setFeature, clearFeature, resetProfile }}
    >
      {children}
    </SkinProfileContext.Provider>
  );
}

export function useSkinProfile() {
  const context = useContext(SkinProfileContext);
  if (!context) {
    throw new Error("useSkinProfileContext used outside SkinProfileProvider");
  }
  return context;
}
