import { Cosmetic } from "@/lib/cosmetics/types";
import { Clock, Droplet } from "lucide-react";

type InsightCategory =
  | "dryness"
  | "wantsGlow"
  | "redness"
  | "unevenTone"
  | "spots"
  | "acne";

// const categoryToIcon: Record<InsightCategory, React.ReactNode> = {
//     "dryness": ,
//     "acne" : ,
//     "redness": ,
//     "spots" : ,
//     "unevenTone": ,
//     "wantsGlow": ,
// }

type InsightSolution = {
  heading: string;
  description: string;
  cosmetic?: Cosmetic;
};

export type InsightMock = {
  solution: InsightSolution;
  category: InsightCategory;
  date: Date;
};

function formatDateToString(date: Date): string {
  return date.toLocaleString();
}

export function LastInsights({ insights }: { insights: InsightMock[] }) {
  return (
    <div className="p-2">
      <ul className="flex flex-col gap-2 items-start">
        {insights.map((item, idx) => (
          <li
            key={item.solution.heading}
            className="p-2 w-full flex items-center"
          >
            <div className="w-full flex flex-col gap-4">
              <div
                className="w-full flex justify-between items-center
              tracking-widest uppercase text-secondary text-xs"
              >
                <p className="">Insight / {String(idx + 1).padStart(2, "0")}</p>
                <div className="flex gap-1 items-center border border-tertiary rounded-2xl px-2 py-0.5">
                  <Clock className="size-4"/>
                  {formatDateToString(item.date)}
                  </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="size-6 text-secondary shrink-0" />
                <h5 className="">{item.solution.heading}</h5>
              </div>
              <p className="text-xs text-secondary">
                {item.solution.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
