import { Stats } from "@/types/stats";
import { apiFetch } from "./client";

export function getStats(apiKey: string) {
	return apiFetch<Stats>("/stats", apiKey);
}
