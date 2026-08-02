import { GuildInfo } from "@/types/api";
import { apiFetch } from "./client";

export function getGuilds(apiKey: string, page: number, perPage: number) {
	return apiFetch<GuildInfo[]>(`/guilds?page=${page}&per_page=${perPage}`, apiKey);
}
