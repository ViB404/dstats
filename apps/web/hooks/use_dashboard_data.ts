"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { decodeKey, encodeKey } from "@/lib/utils";
import { BotInfo, GuildInfo } from "@/types/api";
import { Stats } from "@/types/dashboard";

const PER_PAGE = 20;

export function useDashboardData() {
	const [apiKey, setApiKey] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [inputKey, setInputKey] = useState("");
	const [isMounted, setIsMounted] = useState(false);

	const [botData, setBotData] = useState<BotInfo>();
	const [stats, setStats] = useState<Stats>();
	const [guilds, setGuilds] = useState<GuildInfo[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isSavingKey, setIsSavingKey] = useState(false);

	// Load stored key on mount
	useEffect(() => {
		setIsMounted(true);
		const stored = localStorage.getItem("dstats_key");
		if (stored) {
			const decoded = decodeKey(stored);
			setApiKey(decoded);
			setInputKey(decoded);
		} else {
			setIsModalOpen(true);
			setIsLoading(false);
		}
	}, []);

	const resetToLoggedOut = () => {
		setGuilds([]);
		setApiKey(null);
		setBotData(undefined);
		setStats(undefined);
		setPage(1);
		setHasMore(true);

		localStorage.removeItem("dstats_key");

		setInputKey("");
		setIsModalOpen(true);
	};

	// Fetch bot/stats/guilds
	useEffect(() => {
		if (!apiKey) return;

		const fetchData = async () => {
			try {
				const baseUrl = process.env.NEXT_PUBLIC_API_URL;

				if (!baseUrl) {
					toast.error("API URL is not defined.");
					throw new Error("API URL is not defined.");
				}

				if (page === 1) {
					setIsLoading(true);
				} else {
					setIsFetchingMore(true);
				}

				if (page === 1) {
					const [botRes, statsRes] = await Promise.all([
						fetch(`${baseUrl}/bot`, {
							headers: { "x-api-key": apiKey },
						}),
						fetch(`${baseUrl}/stats`, {
							headers: { "x-api-key": apiKey },
						}),
					]);

					const botJson = await botRes.json();
					const statsJson = await statsRes.json();

					if (!botRes.ok) {
						toast.error("Authentication failed.");
						throw new Error(botJson.message ?? "Authentication failed.");
					}

					if (!statsRes.ok) {
						toast.error("Failed to fetch stats.");
						throw new Error(statsJson.message ?? "Failed to fetch stats.");
					}

					setBotData(botJson.data);
					setStats(statsJson.data);
				}

				const guildRes = await fetch(`${baseUrl}/guilds?page=${page}&per_page=${PER_PAGE}`, {
					headers: { "x-api-key": apiKey },
				});

				const guildJson = await guildRes.json();

				if (!guildRes.ok) {
					toast.error("Failed to fetch guilds.");
					throw new Error(guildJson.message ?? "Failed to fetch guilds.");
				}

				const newGuilds = guildJson.data ?? [];

				setGuilds(prev => (page === 1 ? newGuilds : [...prev, ...newGuilds]));
				setHasMore(newGuilds.length === PER_PAGE);
			} catch (err) {
				console.error(err);

				const message = err instanceof Error ? err.message : "Something went wrong.";

				toast.error("Failed to load dashboard", {
					description: message,
				});

				if (page === 1) {
					resetToLoggedOut();
				}
			} finally {
				setIsLoading(false);
				setIsFetchingMore(false);
			}
		};

		fetchData();
	}, [apiKey, page]);

	const handleSaveKey = async () => {
		const trimmed = inputKey.trim();

		if (!trimmed) {
			toast.warning("API key required", {
				description: "Paste a valid DStats API key to continue.",
			});
			return;
		}

		if (trimmed === apiKey) {
			toast.info("Already using this API key.");
			return;
		}

		setIsSavingKey(true);

		try {
			localStorage.setItem("dstats_key", encodeKey(trimmed));

			setApiKey(trimmed);
			setGuilds([]);
			setBotData(undefined);
			setStats(undefined);
			setPage(1);
			setHasMore(true);

			setIsModalOpen(false);

			toast.success("API key updated", {
				description: "Dashboard is refreshing with new data.",
			});
		} finally {
			setIsSavingKey(false);
		}
	};

	return {
		isMounted,
		isModalOpen,
		setIsModalOpen,
		inputKey,
		setInputKey,
		isSavingKey,
		handleSaveKey,

		botData,
		stats,
		guilds,

		isLoading,
		isFetchingMore,
		hasMore,
		loadMore: () => setPage(p => p + 1),
	};
}
