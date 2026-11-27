"use client";
import { motion, AnimatePresence } from "motion/react";
import { MockIngredient, mockIngredients } from "./mock-ingredients";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { IngredientCard } from "./IngredientCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Ingredients() {
  const [selected, setSelected] = useState<MockIngredient | null>(null);
  function toggle(val: MockIngredient) {
    if (selected === val) {
      setSelected(null);
      return;
    }
    setSelected(val);
  }
  function selectById(id: string) {
    const ingredient = mockIngredients.find((i) => i.id === id);
    if (ingredient) setSelected(ingredient);
  }
  return (
    <div className="relative w-full min-h-screen flex flex-col gap-2 px-12 pt-12 pb-32 items-center">
      <Link
        href="/"
        className="
          absolute top-8 left-8 z-20
          flex items-center gap-3
          rounded-full
          border border-white/40
          bg-white/70 px-5 py-3
          text-sm font-medium tracking-wider
          text-charcoal backdrop-blur-md
          transition-all duration-300
          hover:bg-white hover:-translate-x-1
        "
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
        Back to home
      </Link>
      <h1 className="text-5xl font-semibold">Ingredient library</h1>
      <p className="text-md text-neutral-600">
        Tap any ingredient to learn what it does
      </p>
      <div className="mt-12 w-full flex gap-12 justify-center items-start">
        <motion.div
          layout
          className="flex-1 min-w-0 flex flex-wrap justify-center items-center gap-4"
        >
          {mockIngredients.map((ing, idx) => {
            const isSelected = selected?.id === ing.id;
            return (
              <motion.div
                key={ing.id}
                layout="position"
                transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
                style={{ marginTop: (idx % 2) * 128 }}
              >
                <motion.button
                  onClick={() => toggle(ing)}
                  animate={{ rotate: isSelected ? 0 : [-3, 3, -3] }}
                  transition={{
                    rotate: isSelected
                      ? { duration: 0.4, ease: "easeOut" }
                      : { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                  }}
                  style={{ transformOrigin: "top center" }}
                  className={cn(
                    "bg-white shadow-md transition-colors duration-200 rounded-full px-4 py-1.5 cursor-pointer",
                    isSelected && "bg-primary text-white",
                  )}
                >
                  {ing.name}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
        <AnimatePresence mode="popLayout">
          {selected && (
            <motion.aside
              key="ingredient-card"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 25 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="sticky top-8 bg-white w-lg shrink-0 rounded-3xl shadow-sm"
            >
              <IngredientCard
                ingredient={selected}
                onClose={() => setSelected(null)}
                onSelect={selectById}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
