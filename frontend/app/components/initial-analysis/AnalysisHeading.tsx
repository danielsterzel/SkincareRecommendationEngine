import { ScanFace } from "lucide-react";
export function AnalysisHeading() {
  return (
    <div className="flex flex-col items-start gap-3 py-2 rounded-full">
      <div className="flex items-center gap-4 y-2">
        <div className="p-3 bg-white border border-indigo-600 rounded-full">
          <ScanFace className="size-7 text-indigo-600" strokeWidth={1.3} />
        </div>
        <div className="w-full flex flex-col items-left">
          <p className="text-secondary uppercase tracking-[0.18rem] text-[10px]">
            Initial Analysis
          </p>
          <h1 className="text-4xl -tracking-[0.06em] font-semibold">
            Let's look at your skin
          </h1>
        </div>
      </div>
    </div>
  );
}
