import { BotInfo } from "@/types/api";
import { apiFetch } from "./client";

export function getBot(apiKey: string) {
	return apiFetch<BotInfo>("/bot", apiKey);
}
