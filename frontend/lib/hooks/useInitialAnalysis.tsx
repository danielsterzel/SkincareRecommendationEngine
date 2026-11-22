"use client"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { UserSkinInformationInput } from "../initial-analysis/analysis-schemas"
import { streamAnalysis } from "../initial-analysis/analysis-api"
import { toast } from "sonner"

export function useInitialAnalysis()
{
    const [streamMessage, setStreamMessage] = useState("")

    const mutation = useMutation({
        mutationFn: async (input: UserSkinInformationInput) => {
            setStreamMessage("");
            for await (const event of streamAnalysis(input))
            {
                setStreamMessage(event.message)
                if(event.type === "completed") return event.data
            }
            throw new Error("Analysis ended without completion");
        },
        onSuccess:() => toast.success("Successfully analyzed your skin"),
        onError: () => toast.error("We couldn't analize your skin.")
    })

    return {...mutation, streamMessage}
}