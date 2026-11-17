import { NotebookTextIcon, Plus } from "lucide-react";
import type { NoteMock } from "./page";

export function MyNotes({ notes }: { notes: NoteMock[] }) {
  return (
    <>
      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <NotebookTextIcon
            className="text-tertiary size-12"
            strokeWidth={1.0}
          />
          <span className="text-tertiary text-xs self-center">
            Use this space to write notes on our approach
          </span>
          <button className="border rounded-lg px-2 py-1 cursor-pointer">
            <Plus className="size-3" />
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
