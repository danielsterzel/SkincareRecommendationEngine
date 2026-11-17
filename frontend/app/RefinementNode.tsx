"use client";
import { Icon } from "@iconify-icon/react";
import { Check, Sun, X } from "lucide-react";
import {motion} from "motion/react"
type RoutineCosmeticCategory = "cleanser" | "serum" | "cream" | "spf";
type RoutineCosmetic = {
  position: number;
  completed: boolean;
  name: string;
  desc: string;
  category: RoutineCosmeticCategory;
};

const RoutineItems: RoutineCosmetic[] = [
  {
    position: 1,
    completed: true,
    name: "Cleansing",
    desc: "Wash away dirt and excess oil",
    category: "cleanser",
  },
  {
    position: 2,
    completed: true,
    name: "Vitamin C, Serum",
    desc: "Brighten and even skin tone",
    category: "serum",
  },
  {
    position: 3,
    completed: true,
    name: "Moisturizer",
    desc: "Hydrate and soften skin",
    category: "cream",
  },
  {
    position: 4,
    completed: false,
    name: "SPF",
    desc: "Protection against the sun",
    category: "spf",
  },
];

const categoryToIcon: Record<RoutineCosmeticCategory, React.ReactNode> = {
  cleanser: (
    <Icon className="" icon="fluent-emoji-high-contrast:lotion-bottle" />
  ),
  serum: <Icon className="" icon="heroicons:eye-dropper-20-solid" />,
  cream: <Icon className="" icon="iconoven:face-cream" />,
  spf: <Icon className="" icon="andrsrxn:tube-lotion" />,
};

export function RefinementNode() {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-medium tracking-tight text-charcoal">
        A routine, uniquely yours.
      </h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-secondary">
          <p className="text-secondary text-xs">Your morning routine checklist</p>
          <div className="border border-yellow-400 rounded-full p-0.5">
            <Sun className="size-3 text-yellow-400" />
          </div>
        </div>
      </div>
      <div className="pt-1 grid grid-cols-2 gap-x-3 gap-y-2">
        {RoutineItems.map((item) => (
          <RoutineItem key={item.position} cosmetic={item} />
        ))}
      </div>
    </div>
  );
}
enum RevealPosition {
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
    FOURTH = 4,
}

enum Reveal {
    IMMEDIATE = 0,
    AFTER_ONE_SECOND = 1,
    AFTER_TWO_SECONDS = 2,
    AFTER_THREE_SECONDS = 3,
}
const revealOrder: Record<number, number> = {
    [RevealPosition.FIRST]: Reveal.IMMEDIATE,
    [RevealPosition.SECOND]: Reveal.AFTER_ONE_SECOND,
    [RevealPosition.THIRD]: Reveal.AFTER_TWO_SECONDS,
    [RevealPosition.FOURTH]: Reveal.AFTER_THREE_SECONDS,
}
function RoutineItem({ cosmetic }: Readonly<{ cosmetic: RoutineCosmetic }>) {
  return (
    <motion.div 
    initial={{opacity: 0, y: -12}}
    whileInView={{opacity: 1, y:0}}
    viewport={{once: true}}
    transition={{duration: 0.5, delay: revealOrder[cosmetic.position], ease: "easeOut"}}

    className="row-span-2 grid grid-cols-[1.125rem_minmax(0,1fr)_0.75rem] grid-rows-subgrid items-start gap-x-1.5 gap-y-0.5">
      <div className="flex size-[1.125rem] items-center justify-center text-lg leading-none">
        {categoryToIcon[cosmetic.category]}
      </div>
      <h3 className="text-[13px] leading-[1.125rem]">
        {String(cosmetic.position).padStart(2, "0")}. {cosmetic.name}
      </h3>
      <span className="mt-0.5">
        {cosmetic.completed ? (
          <Check className="size-3" />
        ) : (
          <X className="size-3" />
        )}
      </span>
      <p className="col-span-2 col-start-2 text-[11px] leading-3.5 text-secondary">
        {cosmetic.desc}
      </p>
    </motion.div>
  );
}
