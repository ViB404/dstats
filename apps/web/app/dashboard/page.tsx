"use client";

import { Key, Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "@base-ui/react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import ApiKeyModal from "@/components/dashboard/api_key_modal";
import OverviewStatsCards from "@/components/dashboard/overview_card";
import BotSummaryCard from "@/components/dashboard/bot_summary_card";
import ChartsContainer from "@/components/dashboard/chart_container";
import GuildGrid from "@/components/dashboard/guild_grid";

import { useDashboardData } from "@/hooks/use_dashboard_data";
import { useBot } from "@/hooks/use_bot";
import { useStats } from "@/hooks/use_stats";
import { useGuilds } from "@/hooks/use_guilds";

const containerVariants: Variants = {
	hidden: {
		opacity: 0,
	},
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
		},
	},
};

export default function DashboardPage() {
	const {
		apiKey,

		isMounted,

		isModalOpen,
		setIsModalOpen,

		inputKey,
		setInputKey,

		isSavingKey,
		handleSaveKey,
	} = useDashboardData();

	const bot = useBot(apiKey);
	const stats = useStats(apiKey);
	const guilds = useGuilds(apiKey);

	if (!isMounted) {
		return null;
	}

	const isLoading = bot.isLoading || stats.isLoading || guilds.isLoading;

	const hasError = bot.isError || stats.isError || guilds.isError;

	if (hasError) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
				<p>Failed to load dashboard.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-neutral-950 font-sans">
			<Navbar />

			<ApiKeyModal
				open={isModalOpen}
				onOpenChangeAction={setIsModalOpen}
				inputKey={inputKey}
				onInputKeyChangeAction={setInputKey}
				onSaveAction={handleSaveKey}
				isSaving={isSavingKey}
			/>

			<main className="mx-auto flex w-full max-w-7xl grow flex-col px-4 pt-32 pb-12 md:px-12">
				{isLoading ? (
					<div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-neutral-500">
						<Loader2 className="h-10 w-10 animate-spin text-[#7F7EFF]" />

						<p className="font-mono text-sm uppercase tracking-widest">Fetching Analytics...</p>
					</div>
				) : (
					<motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-10">
						<header className="flex flex-col justify-between gap-6 border-b border-white/5 pb-6 md:flex-row md:items-end">
							<div className="space-y-2">
								<span className="text-xs font-semibold uppercase tracking-widest text-[#7F7EFF]">
									System Analytics
								</span>

								<h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
									Dashboard Overview
								</h1>
							</div>

							<Button
								onClick={() => setIsModalOpen(true)}
								className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-6 text-white transition-all hover:bg-white/10 active:scale-95"
							>
								<Key className="h-4 w-4 text-[#7F7EFF]" />
								Update API Key
							</Button>
						</header>

						<div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_360px]">
							<OverviewStatsCards stats={stats.data} />

							<BotSummaryCard botData={bot.data} />
						</div>

						<ChartsContainer stats={stats.data} />

						<hr className="border-white/5" />

						<GuildGrid
							guilds={guilds.data ?? []}
							hasMore={false}
							isFetchingMore={guilds.isFetching}
							onLoadMoreAction={() => {}}
						/>
					</motion.div>
				)}
			</main>

			<Footer />
		</div>
	);
}
