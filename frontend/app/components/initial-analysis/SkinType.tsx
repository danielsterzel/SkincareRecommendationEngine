"use client";

import { Skin } from "@/lib/initial-analysis/analysis-types";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { X } from "lucide-react";

export function SkinType({
  choosenSkinType,
  setChoosenSkinType,
}: {
  choosenSkinType: Skin | null;
  setChoosenSkinType: (skinType: Skin | null) => void;
}) {
  return (
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
        ${isChoosenAlready ? "bg-primary text-white " : "bg-white"}
        text-center border-[0.5px] border-neutral-400`}
    >
      {type}
    </button>
  );
}
