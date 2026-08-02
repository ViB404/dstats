"use client";

import { useQuery } from "@tanstack/react-query";

import { getStats } from "@/api/stats";

export function useStats(apiKey?: string | null) {
	return useQuery({
		queryKey: ["stats", apiKey],

		queryFn: () => getStats(apiKey!),

		enabled: !!apiKey,
	});
}
