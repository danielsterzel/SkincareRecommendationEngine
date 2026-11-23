import { authFetch } from "../auth/auth-fetch";
import {
  analysisEvent,
  quickSummarySchema,
  type AnalysisEvent,
  type UserSkinInformationInput,
} from "./analysis-schemas";

export async function* streamAnalysis(
  input: UserSkinInformationInput,
): AsyncGenerator<AnalysisEvent> {
  const headers = {
    method: "POST",
    content: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  };
  const response = await authFetch("/initial-analysis/analysis", {
    method: headers.method,
    headers: headers.content,
    body: headers.body,
  });

  if (!response.ok) {
    const raw = await response.text();
    console.error("Backend response: ", raw);
    throw new Error(`Request failed: ${response.status}`);
  }
  if (!response.body) {
    throw Error(`Request returned empty body`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const line = event.split("\n").find((l) => l.startsWith("data: "));
        if (!line) continue;

        const json = line.slice(5).trim();
        yield analysisEvent.parse(JSON.parse(json));
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function fetchQuickSummary(data: UserSkinInformationInput) {
  const headers: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const response = await authFetch(`/initial-analysis/quick-summary`, headers);
  if (!response.ok) {
    throw new Error(`Couldn't fetch QuickSummary ${response.status}`);
  }
  return quickSummarySchema.parse(await response.json());
}
