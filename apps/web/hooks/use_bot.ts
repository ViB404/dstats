"use client";

import { useQuery } from "@tanstack/react-query";

import { getBot } from "@/api/bot";

export function useBot(apiKey?: string | null) {
	return useQuery({
		queryKey: ["bot", apiKey],

		queryFn: () => getBot(apiKey!),

		enabled: !!apiKey,
	});
}
