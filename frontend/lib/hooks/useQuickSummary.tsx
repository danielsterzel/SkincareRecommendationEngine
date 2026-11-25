"use client"

import { useMutation } from "@tanstack/react-query"
import { fetchQuickSummary } from "../initial-analysis/analysis-api"
import { toast } from "sonner"


export function useQuickSummary()
{
    const summary = useMutation({
        mutationFn: fetchQuickSummary,
        onError: () => toast.error("Something went wrong with the quick summary")
    })

    return summary
}