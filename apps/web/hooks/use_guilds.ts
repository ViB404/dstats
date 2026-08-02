"use client";

import { useQuery } from "@tanstack/react-query";

import { getGuilds } from "@/api/guilds";

const PER_PAGE = 20;

export function useGuilds(apiKey?: string | null, page = 1) {
	return useQuery({
		queryKey: ["guilds", apiKey, page],

		queryFn: () => getGuilds(apiKey!, page, PER_PAGE),

		enabled: !!apiKey,

		placeholderData: previous => previous,
	});
}
