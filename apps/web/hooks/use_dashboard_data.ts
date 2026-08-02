"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { decodeKey, encodeKey } from "@/lib/utils";

export function useDashboardData() {
	const [apiKey, setApiKey] = useState<string | null>(null);

	const [isMounted, setIsMounted] = useState(false);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [inputKey, setInputKey] = useState("");

	const [isSavingKey, setIsSavingKey] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		try {
			const stored = localStorage.getItem("dstats_key");

			if (!stored) {
				setIsModalOpen(true);
				return;
			}

			const decoded = decodeKey(stored);

			if (!decoded) {
				localStorage.removeItem("dstats_key");
				setIsModalOpen(true);
				return;
			}

			setApiKey(decoded);
			setInputKey(decoded);
			setIsModalOpen(false);
		} catch {
			localStorage.removeItem("dstats_key");
			setIsModalOpen(true);
		}
	}, []);

	const handleSaveKey = useCallback(() => {
		const trimmed = inputKey.trim();

		if (!trimmed) {
			toast.warning("API key required", {
				description: "Paste a valid DStats API key.",
			});

			return;
		}

		if (trimmed === apiKey) {
			toast.info("Already using this API key.");
			setIsModalOpen(false);
			return;
		}

		setIsSavingKey(true);

		try {
			localStorage.setItem("dstats_key", encodeKey(trimmed));

			setApiKey(trimmed);
			setInputKey(trimmed);
			setIsModalOpen(false);

			// TODO: clear the tanstack query cache

			toast.success("API key updated", {
				description: "Analytics are being refreshed.",
			});
		} finally {
			setIsSavingKey(false);
		}
	}, [apiKey, inputKey]);

	return {
		apiKey,
		setApiKey,

		isMounted,

		isModalOpen,
		setIsModalOpen,

		inputKey,
		setInputKey,

		isSavingKey,

		handleSaveKey,
	};
}
